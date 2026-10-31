#!/usr/bin/env node
// design-nexus evaluation runner. Node 18+, no dependencies (render step uses Playwright if present).
//
//   node eval/run.mjs prepare  [--label name] [--cases 01,03] [--split train|holdout|all] [--skill dir]   snapshot the skill, one PROMPT.md per case
//   node eval/run.mjs generate --run <dir> --cmd "<agent cli>"   optional: pipe each PROMPT.md to an agent CLI
//   node eval/run.mjs judge    --run <dir> [--cmd "<agent cli>"] write JUDGE_PROMPT.md per case; with --cmd, collect judge.json
//   node eval/run.mjs score    --run <dir>                       lint + render + judge*.json -> score.json, summary.md
//                                                                (several judge.<model>.json files are averaged)
//   node eval/run.mjs compare  --base <dir>[,<dir>…] --run <dir> [--primary opus] [--rescore no]   rescore the base(s), then accept/reject;
//                                                                several base runs of one version are averaged per case
//   node eval/run.mjs feedback --run <dir>                       aggregate failures into feedback.md for the loop
//   node eval/run.mjs pair     --base <dir>[,<dir>…] --run <dir> [--cases 01,03]   M-008: one PAIR_PROMPT.md per case and base run,
//                                                                pages shown as A/B in a fixed pseudo-random order
//   node eval/run.mjs pair-score --run <dir>                     candidate wins, losses, ties overall and per dimension
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
// `split: train` cases drive hypotheses; `split: holdout` cases are only for confirming a finished round.
const listCases = (only, split) => fs.readdirSync(CASES).filter((f) => f.endsWith('.md')).sort()
  .map((f) => parseCase(path.join(CASES, f)))
  .filter((c) => !only || only.split(',').some((p) => c.id.startsWith(p)))
  .filter((c) => !split || split === 'all' || (c.split || 'train') === split);

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
    // Render findings carry the width in `where`; when nothing else is left there, the message tells issues apart.
    const where = (f.where || '').replace(/@\d+px\s*/, '');
    const k = `${f.id}|${f.file || ''}|${f.line || ''}|${where}|${where ? '' : f.message}`;
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
    const cases = listCases(opt.cases, opt.split);
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
    writeJSON(path.join(run, 'run.json'), { id, version: version(), commit: gitRev(), skill: path.relative(ROOT, skillSrc), created: new Date().toISOString(), cases: cases.map((c) => c.id), ...(opt.split ? { split: opt.split } : {}), ...(opt.generator ? { generator: opt.generator } : {}) });
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

  // M-008: paired judging. The same panel sees the base page and the candidate page side by side and states a preference
  // per dimension, which cancels the judge's day-to-day calibration drift that absolute 0–4 scores carry.
  pair() {
    const cand = runDir(opt.run);
    const bases = String(opt.base || '').split(',').filter(Boolean).map(runDir);
    if (!bases.length) die('pair needs --base <dir>[,<dir>…]');
    const base = read(path.join(ROOT, 'eval/pair-prompt.md'));
    const pairsDir = path.join(cand, '_pairs');
    fs.mkdirSync(pairsDir, { recursive: true });
    const keyFile = path.join(pairsDir, 'key.json');
    const keys = fs.existsSync(keyFile) ? JSON.parse(read(keyFile)) : {};
    const only = opt.cases ? String(opt.cases).split(',') : null;
    let n = 0;
    for (const d of caseDirs(cand)) {
      if (only && !only.some((p) => d.startsWith(p))) continue;
      for (const b of bases) {
        if (!fs.existsSync(path.join(b, d))) continue;
        const id = `${d}--${path.basename(b)}`;
        // Fixed pseudo-random side, so re-running pair does not reshuffle a pair that was already judged.
        const h = [...id].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
        const candIsA = h % 2 === 0;
        keys[id] = { A: candIsA ? 'cand' : 'base', base: path.relative(ROOT, b) };
        const [aDir, bDir] = candIsA ? [path.join(cand, d), path.join(b, d)] : [path.join(b, d), path.join(cand, d)];
        const shots = (dir) => (fs.existsSync(path.join(dir, 'shots')) ? fs.readdirSync(path.join(dir, 'shots')).map((f) => `- ${path.join(dir, 'shots', f)}`) : ['(none)']);
        const caseFile = path.join(CASES, `${d}.md`);
        const brief = fs.existsSync(caseFile) ? parseCase(caseFile).brief : '(brief missing)';
        const prompt = [base, '', '## BRIEF', '', brief, '', '## Page A', '', aDir, '', ...shots(aDir), '', '## Page B', '', bDir, '', ...shots(bDir), ''].join('\n');
        fs.mkdirSync(path.join(pairsDir, id), { recursive: true });
        fs.writeFileSync(path.join(pairsDir, id, 'PAIR_PROMPT.md'), prompt);
        n++;
      }
    }
    writeJSON(keyFile, keys);
    console.log(`wrote ${n} PAIR_PROMPT.md under ${path.relative(ROOT, pairsDir)}/. Give each to a fresh-context judge and save its JSON as pair.<model>.json next to the prompt, then run \`pair-score\`.`);
  },

  'pair-score'() {
    const cand = runDir(opt.run);
    const pairsDir = path.join(cand, '_pairs');
    const keys = JSON.parse(read(path.join(pairsDir, 'key.json')));
    const dims = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'];
    const tally = () => ({ win: 0, loss: 0, tie: 0 });
    const byJudge = {}, byDim = Object.fromEntries(dims.map((k) => [k, tally()])), byCase = {};
    const side = (v, key) => (v !== 'A' && v !== 'B' ? 'tie' : (v === 'A') === (key.A === 'cand') ? 'win' : 'loss');
    for (const [id, key] of Object.entries(keys)) {
      const dir = path.join(pairsDir, id);
      if (!fs.existsSync(dir)) continue;
      for (const f of fs.readdirSync(dir).filter((x) => /^pair\..+\.json$/.test(x))) {
        const j = JSON.parse(read(path.join(dir, f)));
        const judge = f.replace(/^pair\.|\.json$/g, '');
        const o = side(j.overall, key);
        (byJudge[judge] = byJudge[judge] || tally())[o]++;
        const c = id.split('--')[0];
        (byCase[c] = byCase[c] || tally())[o]++;
        for (const k of dims) byDim[k][side(j.dims?.[k], key)]++;
      }
    }
    const all = Object.values(byJudge).reduce((a, t) => ({ win: a.win + t.win, loss: a.loss + t.loss, tie: a.tie + t.tie }), tally());
    // Two-sided sign test on decided pairs (ties dropped).
    const nDec = all.win + all.loss;
    const choose = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };
    const tail = (k) => { let p = 0; for (let i = 0; i <= k; i++) p += choose(nDec, i); return p / 2 ** nDec; };
    const p = nDec ? Math.min(1, 2 * tail(Math.min(all.win, all.loss))) : 1;
    const fmt = (t) => `${t.win}–${t.loss}–${t.tie}`;
    const lines = [`# Pairs: ${path.basename(cand)} (candidate) vs base`, '', `Overall (win–loss–tie, candidate's view): **${fmt(all)}**, sign test p = ${p.toFixed(3)}`, '',
      '| judge | overall |', '|---|---|', ...Object.entries(byJudge).map(([k, t]) => `| ${k} | ${fmt(t)} |`), '',
      '| case | overall |', '|---|---|', ...Object.entries(byCase).map(([k, t]) => `| ${k} | ${fmt(t)} |`), '',
      '| dim | win–loss–tie | net |', '|---|---|---|', ...dims.map((k) => `| ${k} | ${fmt(byDim[k])} | ${byDim[k].win - byDim[k].loss >= 0 ? '+' : ''}${byDim[k].win - byDim[k].loss} |`), ''];
    fs.writeFileSync(path.join(cand, 'pairs.md'), lines.join('\n'));
    writeJSON(path.join(cand, 'pairs.json'), { overall: all, p, byJudge, byCase, byDim });
    console.log(lines.join('\n'));
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
      // M-006: every scored render sees the same weekday mid-morning in the page's own zone, so a timetable or
      // opening-hours page isn't judged on whatever hour the scoring happened to run.
      const ja = /lang=["']ja/i.test(fs.readFileSync(entry, 'utf8').slice(0, 2000));
      const clock = ja ? ['--time', '2026-11-04T10:30:00+09:00', '--tz', 'Asia/Tokyo'] : ['--time', '2026-11-04T10:30:00-05:00', '--tz', 'America/New_York'];
      const renderArgs = [entry, '--out', path.join(dir, 'shots'), ...clock, ...(c.surface === 'mobile' ? ['--surface', 'mobile'] : [])];
      if (fs.existsSync(path.join(dir, 'SOURCE.html'))) {
        const before = path.join(dir, 'before.json');
        if (!fs.existsSync(before)) runTool('render-check.mjs', [path.join(dir, 'SOURCE.html'), '--out', path.join(dir, 'shots-source'), '--snapshot', before]);
        renderArgs.push('--compare', before);
      }
      const render = runTool('render-check.mjs', renderArgs);
      const findings = [...(lint.findings || []), ...(render.findings || [])];
      const auto = autoScore(findings);
      const samples = readJudges(dir);
      // Repeat samples of one model (judge.opus.json, judge.opus.2.json) are averaged first, so each model counts once.
      const judges = byModel(samples);
      const perJudge = Object.fromEntries(Object.entries(judges).map(([name, j]) => [name, judgeScore(j)]).filter(([, v]) => v !== null));
      const jvals = Object.values(perJudge);
      const js = jvals.length ? +(jvals.reduce((a, b) => a + b, 0) / jvals.length).toFixed(1) : null;
      const total = js === null ? null : +(auto.score + js).toFixed(1);
      const result = {
        case: d, surface: c.surface, split: c.split || 'train', auto, judge: js, total, gate: auto.floor === 0 ? 'pass' : 'fail',
        judges: perJudge, judge_spread: jvals.length > 1 ? +(Math.max(...jvals) - Math.min(...jvals)).toFixed(1) : null,
        render: render.skipped ? 'skipped' : render.error ? 'error' : 'ok',
        dims: meanDims(Object.values(judges)),
        fingerprint: { ...fingerprint(entry, dir), ...(render.look ? { look: render.look } : {}) },
        tools: { lint: lint.counts, render: render.counts || (render.skipped ? 'skipped' : render.error), ids: countIds(findings) },
      };
      // M-007: the judge is told to treat Floor findings as facts, so a verdict written against other tool results
      // (a check added or a false positive fixed since) is stale for this case.
      const jp = path.join(dir, 'JUDGE_PROMPT.md');
      if (Object.keys(judges).length && fs.existsSync(jp)) {
        const m = read(jp).match(/## Tool results\s*```json\s*([\s\S]*?)```/);
        let seen = null; try { seen = m && JSON.parse(m[1]); } catch {}
        const floorIds = (t) => JSON.stringify(Object.entries(t?.ids || {}).filter(([id]) => id.startsWith('F')).sort());
        if (seen && floorIds(seen) !== floorIds(result.tools)) {
          result.stale_judge = true;
          console.log(`warning: ${d} was judged against Floor findings ${floorIds(seen)} but the current tools report ${floorIds(result.tools)}; run \`judge\` again for this case and re-judge it`);
        }
      }
      const issues = Object.entries(samples).flatMap(([name, j]) => (j.top_issues || []).map((i) => ({ judge: name, ...i })));
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
      splits: splitMeans(scored),
      diversity: diversity(scored),
      cases: rows,
    };
    writeJSON(path.join(run, 'summary.json'), summary);
    fs.writeFileSync(path.join(run, 'summary.md'), summaryMd(summary));
    fs.appendFileSync(HISTORY, JSON.stringify({ run: summary.run, version: summary.version, commit: summary.commit, at: summary.scored_at, mean_auto: summary.mean_auto, mean_judge: summary.mean_judge, mean_total: summary.mean_total, gate_failures: summary.gate_failures.length }) + '\n');
    console.log(read(path.join(run, 'summary.md')));
  },

  compare() {
    // Rescore the base with the current checks first, so a check added since the base ran isn't counted as a regression.
    // --base may list several runs of the same version (comma-separated): each case is then the mean of its runs,
    // because one generation per case varies by about as much as a typical effect (M-005).
    const baseDirs = String(opt.base).split(',').map((b) => runDir(b.trim()));
    if (opt.rescore !== 'no') {
      for (const b of baseDirs) {
        const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), 'score', '--run', b], { encoding: 'utf8', maxBuffer: 64 << 20 });
        if (r.status !== 0) die(`rescoring the base failed:\n${r.stderr}`);
      }
    }
    const bases = baseDirs.map((b) => JSON.parse(read(path.join(b, 'summary.json'))));
    const cand = JSON.parse(read(path.join(runDir(opt.run), 'summary.json')));
    const key = bases.every((b) => b.mean_total !== null) && cand.mean_total !== null ? 'total' : 'auto';
    const val = (r) => (key === 'total' ? r.total : r.auto?.score);
    const mean1 = (xs) => +(xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(1);
    const byCase = {};
    for (const name of new Set(bases.flatMap((b) => b.cases.filter((c) => !c.missing).map((c) => c.case)))) {
      const rows = bases.map((b) => b.cases.find((c) => c.case === name && !c.missing)).filter(Boolean);
      if (rows.length === 1) { byCase[name] = rows[0]; continue; }
      const judgeModels = [...new Set(rows.flatMap((r) => Object.keys(r.judges || {})))];
      byCase[name] = {
        case: name,
        n: rows.length,
        total: rows.every((r) => r.total != null) ? mean1(rows.map((r) => r.total)) : null,
        auto: { score: mean1(rows.map((r) => r.auto?.score ?? 0)) },
        gate: rows.some((r) => r.gate === 'fail') ? 'fail' : 'pass',
        dims: rows.every((r) => r.dims) ? meanDims(rows.map((r) => ({ scores: r.dims }))) : null,
        judges: Object.fromEntries(judgeModels.map((m) => [m, mean1(rows.filter((r) => r.judges?.[m] !== undefined).map((r) => r.judges[m]))])),
      };
    }
    const base = { run: bases.map((b) => b.run).join(' + '), judges: bases.length === 1 ? bases[0].judges : null };
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
    // Means and dims over the cases both runs have, so a partial candidate (e.g. --cases 02,03,05) is compared like for like.
    const shared = cand.cases.filter((c) => !c.missing && byCase[c.case] && val(c) != null && val(byCase[c.case]) != null);
    const avg = (xs) => (xs.length ? +(xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(1) : null);
    const bm = avg(shared.map((c) => val(byCase[c.case])));
    const cm = avg(shared.map((c) => val(c)));
    const dm = +(cm - bm).toFixed(1);
    lines.push('', `Mean over ${shared.length} shared cases: ${bm} → ${cm} (${dm > 0 ? '+' : ''}${dm})`);
    const withDims = shared.filter((c) => c.dims && byCase[c.case].dims);
    if (withDims.length) {
      const bd = meanDims(withDims.map((c) => ({ scores: byCase[c.case].dims }))) || {};
      const cd = meanDims(withDims.map((c) => ({ scores: c.dims }))) || {};
      lines.push('', '| dim | base | cand | Δ |', '|---|---|---|---|');
      for (const d of Object.keys(DIMS)) {
        if (bd[d] === undefined || cd[d] === undefined) continue;
        const dd = +(cd[d] - bd[d]).toFixed(2);
        lines.push(`| ${d} | ${bd[d]} | ${cd[d]} | ${dd > 0 ? '+' : ''}${dd} |`);
      }
    }
    if (base.judges && cand.judges) lines.push('', `Judges (mean of 60): base ${JSON.stringify(base.judges)} → cand ${JSON.stringify(cand.judges)}`);
    // The primary judge has the final say: averaging in more lenient judges must not hide a drop it sees.
    const primary = opt.primary && opt.primary !== true ? opt.primary : 'opus';
    const common = cand.cases.filter((c) => !c.missing && byCase[c.case]?.judges?.[primary] !== undefined && c.judges?.[primary] !== undefined);
    if (common.length) {
      const pm = (rows, get) => +(rows.reduce((a, c) => a + get(c), 0) / rows.length).toFixed(1);
      const pb = pm(common, (c) => byCase[c.case].judges[primary]), pc = pm(common, (c) => c.judges[primary]);
      const dp = +(pc - pb).toFixed(1);
      lines.push('', `Primary judge (${primary}, mean of 60 over ${common.length} cases): ${pb} → ${pc} (${dp > 0 ? '+' : ''}${dp})`);
      if (dp < -1) reasons.push(`primary judge ${primary} dropped ${dp}`);
    }
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

function byModel(samples) {
  const groups = {};
  for (const [name, j] of Object.entries(samples)) (groups[name.split('.')[0]] ||= []).push(j);
  return Object.fromEntries(Object.entries(groups).map(([m, js]) => [m, js.length === 1 ? js[0] : { scores: meanDims(js), samples: js.length }]));
}

function meanDims(judges) {
  const acc = {};
  for (const j of judges) for (const [d, v] of Object.entries(j?.scores || {})) if (v !== 'n/a' && v !== null && !isNaN(Number(v))) (acc[d] ||= []).push(Number(v));
  const keys = Object.keys(acc);
  if (!keys.length) return null;
  return Object.fromEntries(keys.map((d) => [d, +(acc[d].reduce((a, b) => a + b, 0) / acc[d].length).toFixed(2)]));
}

function splitMeans(rows) {
  const acc = {};
  for (const r of rows) if (r.total !== null) (acc[r.split || 'train'] ||= []).push(r.total);
  return Object.fromEntries(Object.entries(acc).map(([k, v]) => [k, +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(1)]));
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
  for (const m of text.matchAll(/--([\w-]*font[\w-]*)\s*:\s*([^;}\n]+)/g)) {
    if (/size|weight|line|leading|tracking|spacing|feature|settings/i.test(m[1]) || !/^\s*["']|,/.test(m[2])) continue; // not a font stack
    const fam = m[2].split(',')[0].trim().replace(/^['"]|['"]$/g, '');
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
  // Ground tint: a pale ground still carries a hue (mint, sage, cream). Neutral grounds (channel spread < 6/255) have none.
  const groundHues = looks.map((l) => tintHue(l.ground_rgb)).filter((h) => h !== null);
  const accentHues = withFp.map((r) => r.fingerprint.accent_hue).filter((h) => h !== null);
  if (n >= 3) {
    for (const [f, k] of Object.entries(fontCount)) if (k / n >= 0.5) warnings.push(`font "${f}" appears in ${k}/${n} cases`);
    // Hues are compared within a 60° arc, so neighbours like amber and orange count as one family.
    const a = hueCluster(accentHues);
    if (a && a.k / n >= 0.5) warnings.push(`accent hue within 30° of ${a.h}° (${hueName(a.h)}) in ${a.k}/${n} cases`);
  }
  if (looks.length >= 3) {
    const g = hueCluster(groundHues);
    if (g && g.k / looks.length >= 0.5) warnings.push(`ground tinted toward ${g.h}° (${hueName(g.h)}) in ${g.k}/${looks.length} cases`);
  }
  return { fonts: fontCount, accent_hues: hueCount, grounds, ground_hues: groundHues, house_look: looks.length ? `${house.length}/${looks.length}` : null, warnings };
}

function tintHue(rgb) {
  if (!rgb) return null;
  const [r, g, b] = rgb;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  if (d < 6) return null;
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return Math.round(h * 60) % 360;
}
// The largest set of hues that fit within ±30° of one of them.
function hueCluster(hues) {
  let best = null;
  for (const c of hues) {
    const k = hues.filter((h) => Math.min(Math.abs(h - c), 360 - Math.abs(h - c)) <= 30).length;
    if (!best || k > best.k) best = { h: c, k };
  }
  return best;
}
const hueName = (h) => ['red', 'orange', 'yellow', 'yellow-green', 'green', 'green', 'cyan', 'azure', 'blue', 'violet', 'magenta', 'rose'][Math.round(h / 30) % 12];

function summaryDiversity(run) {
  const f = path.join(run, 'summary.json');
  if (!fs.existsSync(f)) return ['(run `score` first)'];
  const d = JSON.parse(read(f)).diversity;
  if (!d) return ['(none)'];
  return [`Fonts: ${JSON.stringify(d.fonts)}`, `Accent hues: ${JSON.stringify(d.accent_hues)}`, ...(d.ground_hues ? [`Ground tints: ${JSON.stringify(d.ground_hues)}`] : []), ...(d.warnings.length ? d.warnings.map((w) => `- WARNING ${w}`) : ['No convergence warnings.'])];
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
    ...(s.splits && Object.keys(s.splits).length > 1 ? [`By split (mean total): ${Object.entries(s.splits).map(([n, v]) => `${n} ${v}`).join(' · ')}`] : []),
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
