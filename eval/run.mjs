#!/usr/bin/env node
// design-nexus evaluation runner. Node 18+, no dependencies (render step uses Playwright if present).
//
//   node eval/run.mjs prepare  [--label name] [--cases 01,03] [--skill dir]   snapshot the skill, one PROMPT.md per case
//   node eval/run.mjs generate --run <dir> --cmd "<agent cli>"   optional: pipe each PROMPT.md to an agent CLI
//   node eval/run.mjs judge    --run <dir> [--cmd "<agent cli>"] write JUDGE_PROMPT.md per case; with --cmd, collect judge.json
//   node eval/run.mjs score    --run <dir>                       lint + render + judge*.json -> score.json, summary.md
//                                                                (several judge.<model>.json files are averaged)
//   node eval/run.mjs compare  --base <dir> --run <dir>          accept/reject a skill change (rules in eval/rubric.md)
//   node eval/run.mjs feedback --run <dir>                       aggregate failures into feedback.md for the loop
import fs from 'node:fs';
import path from 'node:path';
import { execSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILL = path.join(ROOT, 'skills/design-nexus');
const CASES = path.join(ROOT, 'eval/cases');
const RUNS = path.join(ROOT, 'eval/runs');
const HISTORY = path.join(ROOT, 'eval/history.jsonl');
const DIMS = { D1: 1.5, D2: 1.5, D3: 1, D4: 1, D5: 1, D6: 1, D7: 1, D8: 1, D9: 1, D10: 1 };

const [cmd, ...rest] = process.argv.slice(2);
const opt = {};
for (let i = 0; i < rest.length; i++) if (rest[i].startsWith('--')) opt[rest[i].slice(2)] = rest[i + 1]?.startsWith('--') ? true : rest[++i] ?? true;

const read = (p) => fs.readFileSync(p, 'utf8');
const writeJSON = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + '\n');
const version = () => read(path.join(ROOT, 'VERSION')).trim();
const gitRev = () => { try { return execSync('git rev-parse --short HEAD', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { return null; } };

function parseCase(file) {
  const text = read(file);
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const meta = {};
  for (const line of m[1].split('\n')) { const [k, ...v] = line.split(':'); meta[k.trim()] = v.join(':').trim(); }
  return { ...meta, brief: m[2].trim() };
}
const listCases = (only) => fs.readdirSync(CASES).filter((f) => f.endsWith('.md')).sort()
  .map((f) => parseCase(path.join(CASES, f)))
  .filter((c) => !only || only.split(',').some((p) => c.id.startsWith(p)));

const runDir = (v) => {
  if (!v || v === true) die('--run <dir> is required');
  const p = fs.existsSync(v) ? v : path.join(RUNS, v);
  if (!fs.existsSync(p)) die(`run not found: ${v}`);
  return path.resolve(p);
};
// Case folders only: `_skill` (the snapshot) and dot folders are not cases.
const caseDirs = (run) => fs.readdirSync(run).filter((d) => !/^[_.]/.test(d) && fs.statSync(path.join(run, d)).isDirectory()).sort();
function die(msg) { console.error(msg); process.exit(1); }

function findEntry(dir) {
  for (const name of ['index.html', 'out/index.html', 'dist/index.html']) if (fs.existsSync(path.join(dir, name))) return path.join(dir, name);
  const html = fs.readdirSync(dir).filter((f) => f.endsWith('.html') && !/^SOURCE/.test(f));
  return html.length ? path.join(dir, html[0]) : null;
}

function runTool(script, args) {
  const r = spawnSync(process.execPath, [path.join(SKILL, 'scripts', script), ...args, '--json'], { encoding: 'utf8', maxBuffer: 32 << 20 });
  try { return JSON.parse(r.stdout); } catch { return { error: (r.stderr || r.stdout || '').slice(0, 500) }; }
}

function autoScore(findings) {
  // The same issue seen at several widths counts once.
  const seen = new Set();
  const open = findings.filter((f) => {
    if (f.kept) return false;
    const k = `${f.id}|${f.file || ''}|${f.line || ''}|${(f.where || '').replace(/@\d+px\s*/, '')}|${f.where ? '' : f.message}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const floor = open.filter((f) => f.id[0] === 'F').length;
  const reflex = open.filter((f) => f.id[0] === 'R').length;
  const finish = open.filter((f) => f.id[0] === 'N').length;
  const score = Math.max(0, 40 - 8 * floor - Math.min(16, 2 * reflex) - Math.min(4, 0.5 * finish));
  return { floor, reflex, finish, score: +score.toFixed(1) };
}

function judgeScore(j) {
  if (!j?.scores) return null;
  let sum = 0, max = 0;
  for (const [d, w] of Object.entries(DIMS)) {
    const v = j.scores[d];
    if (v === 'n/a' || v === null || v === undefined) continue;
    sum += Number(v) * w;
    max += 4 * w;
  }
  return max ? +((sum / max) * 60).toFixed(1) : null;
}

// ---------------- commands ----------------

const commands = {
  prepare() {
    const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '').replace(/^(\d{8})(\d{4})$/, '$1-$2');
    const id = `${stamp}-v${version()}${opt.label ? '-' + opt.label : ''}`;
    const run = path.join(RUNS, id);
    fs.mkdirSync(run, { recursive: true });
    const cases = listCases(opt.cases);
    // Snapshot the skill so the run is reproducible and later edits don't leak into a running generation.
    const skillSrc = path.resolve(opt.skill && opt.skill !== true ? opt.skill : SKILL);
    const skill = path.join(run, '_skill/design-nexus');
    fs.cpSync(skillSrc, skill, { recursive: true });
    for (const c of cases) {
      const dir = path.join(run, c.id);
      fs.mkdirSync(dir, { recursive: true });
      if (c.source) fs.copyFileSync(path.join(ROOT, c.source), path.join(dir, 'SOURCE.html'));
      fs.writeFileSync(path.join(dir, 'PROMPT.md'), [
        `Use the design-nexus skill: read \`${skill}/SKILL.md\` and follow it (budget: ${c.budget}, surface: ${c.surface}). Its references, scripts, and templates are in that same folder.`,
        `Work only inside this folder (${dir}). Write the result as a single self-contained \`index.html\` (inline CSS/JS) unless the brief says otherwise. Do not look at other case folders or earlier runs.`,
        `Nobody will answer questions: state your assumptions and proceed.`,
        `Run the skill's lint and render check on \`index.html\` (\`node ${skill}/scripts/lint.mjs index.html\`, \`node ${skill}/scripts/render-check.mjs index.html --out shots\`) and fix Floor findings before finishing.`,
        `Treat this folder as the project root: if the skill's steps call for a \`DESIGN.md\`, write it here.`,
        `When done, write \`NOTES.md\` with: the three directions you considered, the chosen one, the signature element, and any Reflex findings kept with reasons.`,
        '', '## Brief', '', c.brief, '',
      ].join('\n'));
    }
    writeJSON(path.join(run, 'run.json'), { id, version: version(), commit: gitRev(), skill: path.relative(ROOT, skillSrc), created: new Date().toISOString(), cases: cases.map((c) => c.id), ...(opt.generator ? { generator: opt.generator } : {}) });
    console.log(`prepared ${path.relative(ROOT, run)} with ${cases.length} case(s)`);
    console.log('next: have your agent complete each PROMPT.md in its folder (or use `generate --cmd`), then `judge` and `score`.');
  },

  generate() {
    const run = runDir(opt.run);
    if (!opt.cmd || opt.cmd === true) die('--cmd "<agent cli that reads a prompt on stdin>" is required, e.g. --cmd "claude -p" or --cmd "codex exec -"');
    for (const d of caseDirs(run)) {
      const dir = path.join(run, d);
      console.log(`generate ${d} …`);
      const r = spawnSync(opt.cmd, { cwd: dir, input: read(path.join(dir, 'PROMPT.md')), shell: true, encoding: 'utf8', maxBuffer: 64 << 20, timeout: Number(opt.timeout || 1800) * 1000 });
      fs.writeFileSync(path.join(dir, 'generate.log'), (r.stdout || '') + (r.stderr || ''));
      if (!findEntry(dir)) console.log(`  no HTML produced; see ${path.relative(ROOT, dir)}/generate.log`);
    }
  },

  judge() {
    const run = runDir(opt.run);
    const base = read(path.join(ROOT, 'eval/judge-prompt.md'));
    for (const d of caseDirs(run)) {
      const dir = path.join(run, d);
      const caseFile = path.join(CASES, `${d}.md`);
      const brief = fs.existsSync(caseFile) ? parseCase(caseFile).brief : '(brief missing)';
      const shots = fs.existsSync(path.join(dir, 'shots')) ? fs.readdirSync(path.join(dir, 'shots')).map((f) => path.join(dir, 'shots', f)) : [];
      const tools = fs.existsSync(path.join(dir, 'score.json')) ? JSON.parse(read(path.join(dir, 'score.json'))).tools : null;
      const prompt = [
        base, '', '## BRIEF', '', brief, '',
        '## Case directory', '', dir, '',
        '## Screenshots', '', ...(shots.length ? shots.map((s) => `- ${s}`) : ['(none: run `score` first to render)']), '',
        '## Tool results', '', '```json', JSON.stringify(tools, null, 2), '```', '',
      ].join('\n');
      fs.writeFileSync(path.join(dir, 'JUDGE_PROMPT.md'), prompt);
      if (opt.cmd && opt.cmd !== true) {
        console.log(`judge ${d} …`);
        const r = spawnSync(opt.cmd, { cwd: dir, input: prompt, shell: true, encoding: 'utf8', maxBuffer: 16 << 20, timeout: 900000 });
        const out = r.stdout || '';
        const m = out.match(/\{[\s\S]*"scores"[\s\S]*\}/);
        if (!m) { console.log(`  no JSON in judge output; see judge.log`); fs.writeFileSync(path.join(dir, 'judge.log'), out + (r.stderr || '')); continue; }
        try { writeJSON(path.join(dir, 'judge.json'), JSON.parse(m[0])); } catch { fs.writeFileSync(path.join(dir, 'judge.log'), out); console.log('  judge JSON did not parse; see judge.log'); }
      }
    }
    if (!opt.cmd) console.log('wrote JUDGE_PROMPT.md per case. Give each to a fresh-context agent and save its JSON reply as judge.json in the same folder, then run `score` again.');
  },

  score() {
    const run = runDir(opt.run);
    const meta = fs.existsSync(path.join(run, 'run.json')) ? JSON.parse(read(path.join(run, 'run.json'))) : { id: path.basename(run) };
    const rows = [];
    for (const d of caseDirs(run)) {
      const dir = path.join(run, d);
      const entry = findEntry(dir);
      if (!entry) { rows.push({ case: d, missing: true }); continue; }
      const caseFile = path.join(CASES, `${d}.md`);
      const c = fs.existsSync(caseFile) ? parseCase(caseFile) : {};
      const lint = runTool('lint.mjs', [entry, ...(fs.existsSync(path.join(dir, 'DESIGN.md')) ? ['--design', path.join(dir, 'DESIGN.md')] : [])]);
      const renderArgs = [entry, '--out', path.join(dir, 'shots'), ...(c.surface === 'mobile' ? ['--surface', 'mobile'] : [])];
      if (fs.existsSync(path.join(dir, 'SOURCE.html'))) {
        const before = path.join(dir, 'before.json');
        if (!fs.existsSync(before)) runTool('render-check.mjs', [path.join(dir, 'SOURCE.html'), '--out', path.join(dir, 'shots-source'), '--snapshot', before]);
        renderArgs.push('--compare', before);
      }
      const render = runTool('render-check.mjs', renderArgs);
      const findings = [...(lint.findings || []), ...(render.findings || [])];
      const auto = autoScore(findings);
      const judges = readJudges(dir);
      const perJudge = Object.fromEntries(Object.entries(judges).map(([name, j]) => [name, judgeScore(j)]).filter(([, v]) => v !== null));
      const jvals = Object.values(perJudge);
      const js = jvals.length ? +(jvals.reduce((a, b) => a + b, 0) / jvals.length).toFixed(1) : null;
      const total = js === null ? null : +(auto.score + js).toFixed(1);
      const result = {
        case: d, surface: c.surface, auto, judge: js, total, gate: auto.floor === 0 ? 'pass' : 'fail',
        judges: perJudge, judge_spread: jvals.length > 1 ? +(Math.max(...jvals) - Math.min(...jvals)).toFixed(1) : null,
        render: render.skipped ? 'skipped' : render.error ? 'error' : 'ok',
        dims: meanDims(Object.values(judges)),
        fingerprint: { ...fingerprint(entry, dir), ...(render.look ? { look: render.look } : {}) },
        tools: { lint: lint.counts, render: render.counts || (render.skipped ? 'skipped' : render.error), ids: countIds(findings) },
      };
      const issues = Object.entries(judges).flatMap(([name, j]) => (j.top_issues || []).map((i) => ({ judge: name, ...i })));
      writeJSON(path.join(dir, 'score.json'), { ...result, findings, top_issues: issues });
      rows.push(result);
    }
    const scored = rows.filter((r) => !r.missing);
    const mean = (xs) => (xs.length ? +(xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(1) : null);
    const summary = {
      run: meta.id, version: meta.version, commit: meta.commit, scored_at: new Date().toISOString(),
      mean_auto: mean(scored.map((r) => r.auto.score)),
      mean_judge: mean(scored.filter((r) => r.judge !== null).map((r) => r.judge)),
      mean_total: scored.every((r) => r.total !== null) ? mean(scored.map((r) => r.total)) : null,
      gate_failures: scored.filter((r) => r.gate === 'fail').map((r) => r.case),
      missing: rows.filter((r) => r.missing).map((r) => r.case),
      dims: meanDims(scored.filter((r) => r.dims).map((r) => ({ scores: r.dims }))),
      judges: judgeMeans(scored),
      diversity: diversity(scored),
      cases: rows,
    };
    writeJSON(path.join(run, 'summary.json'), summary);
    fs.writeFileSync(path.join(run, 'summary.md'), summaryMd(summary));
    fs.appendFileSync(HISTORY, JSON.stringify({ run: summary.run, version: summary.version, commit: summary.commit, at: summary.scored_at, mean_auto: summary.mean_auto, mean_judge: summary.mean_judge, mean_total: summary.mean_total, gate_failures: summary.gate_failures.length }) + '\n');
    console.log(read(path.join(run, 'summary.md')));
  },

  compare() {
    const base = JSON.parse(read(path.join(runDir(opt.base), 'summary.json')));
    const cand = JSON.parse(read(path.join(runDir(opt.run), 'summary.json')));
    const key = base.mean_total !== null && cand.mean_total !== null ? 'total' : 'auto';
    const val = (r) => (key === 'total' ? r.total : r.auto?.score);
    const byCase = Object.fromEntries(base.cases.filter((c) => !c.missing).map((c) => [c.case, c]));
    const lines = [`# Compare ${cand.run} vs base ${base.run}`, '', `Metric: ${key}${key === 'auto' ? ' (judge scores missing in one run; automatic part only)' : ''}`, '', '| case | base | cand | Δ | gate |', '|---|---|---|---|---|'];
    const reasons = [];
    for (const c of cand.cases.filter((c) => !c.missing)) {
      const b = byCase[c.case];
      if (!b) continue;
      const d = +(val(c) - val(b)).toFixed(1);
      lines.push(`| ${c.case} | ${val(b)} | ${val(c)} | ${d > 0 ? '+' : ''}${d} | ${b.gate}→${c.gate} |`);
      if (c.gate === 'fail' && b.gate === 'pass') reasons.push(`${c.case}: new Floor failure`);
      if (d < -5) reasons.push(`${c.case}: regressed ${d}`);
    }
    const bm = key === 'total' ? base.mean_total : base.mean_auto;
    const cm = key === 'total' ? cand.mean_total : cand.mean_auto;
    const dm = +(cm - bm).toFixed(1);
    lines.push('', `Mean: ${bm} → ${cm} (${dm > 0 ? '+' : ''}${dm})`);
    if (base.dims && cand.dims) {
      lines.push('', '| dim | base | cand | Δ |', '|---|---|---|---|');
      for (const d of Object.keys(DIMS)) {
        if (base.dims[d] === undefined || cand.dims[d] === undefined) continue;
        const dd = +(cand.dims[d] - base.dims[d]).toFixed(2);
        lines.push(`| ${d} | ${base.dims[d]} | ${cand.dims[d]} | ${dd > 0 ? '+' : ''}${dd} |`);
      }
    }
    if (base.judges && cand.judges) lines.push('', `Judges (mean of 60): base ${JSON.stringify(base.judges)} → cand ${JSON.stringify(cand.judges)}`);
    if (cand.diversity?.warnings?.length) lines.push('', 'Diversity warnings (candidate):', ...cand.diversity.warnings.map((w) => `- ${w}`));
    if (dm < -1) reasons.push(`mean dropped ${dm}`);
    let verdict = reasons.length ? 'REJECT' : dm >= 0 ? 'ACCEPT' : 'NEUTRAL';
    if (verdict === 'NEUTRAL') lines.push('Within noise (−1 to 0): accept only if the targeted dimension or check improved (see eval/rubric.md).');
    lines.push('', `**Verdict: ${verdict}**`, ...reasons.map((r) => `- ${r}`));
    const md = lines.join('\n') + '\n';
    fs.writeFileSync(path.join(runDir(opt.run), 'compare.md'), md);
    console.log(md);
    process.exit(verdict === 'REJECT' ? 3 : 0);
  },

  feedback() {
    const run = runDir(opt.run);
    const ids = {}, dims = {}, issues = [];
    for (const d of caseDirs(run)) {
      const f = path.join(run, d, 'score.json');
      if (!fs.existsSync(f)) continue;
      const s = JSON.parse(read(f));
      for (const [id, n] of Object.entries(s.tools?.ids || {})) ids[id] = (ids[id] || 0) + n;
      for (const [dim, v] of Object.entries(s.dims || {})) if (v !== 'n/a') (dims[dim] ||= []).push(Number(v));
      for (const i of s.top_issues || []) issues.push({ case: d, ...i });
    }
    const dimRows = Object.entries(dims).map(([d, v]) => [d, +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(2)]).sort((a, b) => a[1] - b[1]);
    const idRows = Object.entries(ids).sort((a, b) => b[1] - a[1]);
    const md = [
      `# Feedback for ${path.basename(run)}`, '',
      'Input for one iteration of loop/IMPROVEMENT.md. Pick ONE hypothesis from here.', '',
      '## Most frequent findings', '', '| id | count |', '|---|---|', ...idRows.map(([id, n]) => `| ${id} | ${n} |`), '',
      '## Weakest dimensions (mean 0–4)', '', '| dim | mean |', '|---|---|', ...dimRows.map(([d, v]) => `| ${d} | ${v} |`), '',
      '## Judge issues with rule suggestions', '',
      ...(issues.length ? issues.map((i) => `- [${i.case}${i.judge ? ' · ' + i.judge : ''}] (${i.dimension || '?'}) ${i.issue}${i.rule_suggestion ? `\n  - suggestion: ${i.rule_suggestion}` : ''}`) : ['(no judge.json found)']), '',
      '## Diversity across cases', '', ...(summaryDiversity(run)), '',
      '## Human feedback', '', 'See loop/feedback.md entries with status `open`.', '',
    ].join('\n');
    fs.writeFileSync(path.join(run, 'feedback.md'), md);
    console.log(md);
  },
};

// judge.json and judge.<name>.json in a case folder, keyed by judge name.
function readJudges(dir) {
  const out = {};
  for (const f of fs.readdirSync(dir)) {
    const m = f.match(/^judge(?:\.([\w.-]+))?\.json$/);
    if (!m) continue;
    try { out[m[1] || 'judge'] = JSON.parse(read(path.join(dir, f))); } catch { console.log(`  ${f} did not parse; skipped`); }
  }
  return out;
}

function meanDims(judges) {
  const acc = {};
  for (const j of judges) for (const [d, v] of Object.entries(j?.scores || {})) if (v !== 'n/a' && v !== null && !isNaN(Number(v))) (acc[d] ||= []).push(Number(v));
  const keys = Object.keys(acc);
  if (!keys.length) return null;
  return Object.fromEntries(keys.map((d) => [d, +(acc[d].reduce((a, b) => a + b, 0) / acc[d].length).toFixed(2)]));
}

function judgeMeans(rows) {
  const acc = {};
  for (const r of rows) for (const [n, v] of Object.entries(r.judges || {})) (acc[n] ||= []).push(v);
  return Object.fromEntries(Object.entries(acc).map(([n, v]) => [n, +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(1)]));
}

// A coarse visual fingerprint: primary font families and accent hue. Used to spot a skill that makes everything look alike.
function fingerprint(entry, dir) {
  const text = read(entry) + (fs.existsSync(path.join(dir, 'DESIGN.md')) ? '\n' + read(path.join(dir, 'DESIGN.md')) : '');
  const fonts = new Map();
  for (const m of text.matchAll(/font-family\s*:\s*([^;}{\n]+)/g)) {
    const fam = m[1].split(',')[0].trim().replace(/^['"]|['"]$/g, '');
    if (!fam || fam.startsWith('var(') || /^(inherit|serif|sans-serif|monospace)$/i.test(fam)) continue;
    fonts.set(fam, (fonts.get(fam) || 0) + 1);
  }
  for (const m of text.matchAll(/--[\w-]*font[\w-]*\s*:\s*([^;}\n]+)/g)) {
    const fam = m[1].split(',')[0].trim().replace(/^['"]|['"]$/g, '');
    if (fam && !/^(var\(|inherit|serif|sans-serif|monospace|\d)/i.test(fam)) fonts.set(fam, (fonts.get(fam) || 0) + 2);
  }
  for (const m of text.matchAll(/^\s*font\.[\w-]+\s*:\s*(.+)$/gm)) {
    const fam = m[1].split(',')[0].trim().replace(/^['"]|['"]$/g, '');
    if (fam) fonts.set(fam, (fonts.get(fam) || 0) + 2);
  }
  const hues = new Map();
  for (const m of text.matchAll(/#[0-9a-fA-F]{6}\b/g)) {
    const n = parseInt(m[0].slice(1), 16);
    const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, dlt = max - min;
    if (dlt === 0) continue;
    const sat = l > 0.5 ? dlt / (2 - max - min) : dlt / (max + min);
    if (sat < 0.35 || l < 0.15 || l > 0.85) continue;
    let h = max === r ? (g - b) / dlt + (g < b ? 6 : 0) : max === g ? (b - r) / dlt + 2 : (r - g) / dlt + 4;
    const bucket = Math.round((h * 60) / 30) * 30 % 360;
    hues.set(bucket, (hues.get(bucket) || 0) + 1);
  }
  const top = (m, n) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k]) => k);
  return { fonts: top(fonts, 3), accent_hue: top(hues, 1)[0] ?? null };
}

function diversity(rows) {
  const withFp = rows.filter((r) => r.fingerprint);
  const n = withFp.length;
  const fontCount = {}, hueCount = {};
  for (const r of withFp) {
    for (const f of new Set(r.fingerprint.fonts)) fontCount[f] = (fontCount[f] || 0) + 1;
    if (r.fingerprint.accent_hue !== null) hueCount[r.fingerprint.accent_hue] = (hueCount[r.fingerprint.accent_hue] || 0) + 1;
  }
  const warnings = [];
  const looks = withFp.map((r) => r.fingerprint.look).filter(Boolean);
  const house = looks.filter((l) => l.ground === 'light' && !l.shadows && l.radius_median <= 4);
  if (looks.length >= 3 && house.length / looks.length >= 0.5) warnings.push(`house look (light ground, no shadows, radius ≤4px) in ${house.length}/${looks.length} cases`);
  const grounds = {};
  for (const l of looks) grounds[l.ground] = (grounds[l.ground] || 0) + 1;
  if (n >= 3) {
    for (const [f, k] of Object.entries(fontCount)) if (k / n >= 0.5) warnings.push(`font "${f}" appears in ${k}/${n} cases`);
    for (const [h, k] of Object.entries(hueCount)) if (k / n >= 0.5) warnings.push(`accent hue ~${h}° in ${k}/${n} cases`);
  }
  return { fonts: fontCount, accent_hues: hueCount, grounds, house_look: looks.length ? `${house.length}/${looks.length}` : null, warnings };
}

function summaryDiversity(run) {
  const f = path.join(run, 'summary.json');
  if (!fs.existsSync(f)) return ['(run `score` first)'];
  const d = JSON.parse(read(f)).diversity;
  if (!d) return ['(none)'];
  return [`Fonts: ${JSON.stringify(d.fonts)}`, `Accent hues: ${JSON.stringify(d.accent_hues)}`, ...(d.warnings.length ? d.warnings.map((w) => `- WARNING ${w}`) : ['No convergence warnings.'])];
}

function countIds(findings) {
  const out = {};
  for (const f of findings) if (!f.kept) out[f.id] = (out[f.id] || 0) + 1;
  return out;
}

function summaryMd(s) {
  const lines = [
    `# Eval ${s.run}`, '', `version ${s.version}${s.commit ? ` · commit ${s.commit}` : ''}`, '',
    `Mean auto ${s.mean_auto ?? '-'} / 40 · judge ${s.mean_judge ?? '-'} / 60 · total ${s.mean_total ?? '-'} / 100`,
    s.gate_failures.length ? `Floor gate failed: ${s.gate_failures.join(', ')}` : 'Floor gate: all pass',
    ...(s.judges && Object.keys(s.judges).length ? [`Judges (mean of 60): ${Object.entries(s.judges).map(([n, v]) => `${n} ${v}`).join(' · ')}`] : []),
    ...(s.diversity?.warnings?.length ? [`Diversity: ${s.diversity.warnings.join('; ')}`] : []),
    '', '| case | auto | judge | total | floor | reflex | finish | render |', '|---|---|---|---|---|---|---|---|',
  ];
  for (const r of s.cases) {
    if (r.missing) { lines.push(`| ${r.case} | – | – | – | – | – | – | no output |`); continue; }
    lines.push(`| ${r.case} | ${r.auto.score} | ${r.judge ?? 'pending'}${r.judge_spread ? ` (±${r.judge_spread / 2})` : ''} | ${r.total ?? '-'} | ${r.auto.floor} | ${r.auto.reflex} | ${r.auto.finish} | ${r.render} |`);
  }
  if (s.dims) lines.push('', `Dims: ${Object.entries(s.dims).map(([d, v]) => `${d} ${v}`).join(' · ')}`);
  return lines.join('\n') + '\n';
}

if (!commands[cmd]) {
  console.log(read(fileURLToPath(import.meta.url)).split('\n').slice(1, 10).join('\n').replace(/^\/\/ ?/gm, ''));
  process.exit(cmd ? 1 : 0);
}
commands[cmd]();
