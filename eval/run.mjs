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
//   node eval/run.mjs pair     --base <dir>[,<dir>…] --run <dir> [--cases 01,03] [--swap]   M-008: one PAIR_PROMPT.md per case and base run,
//                                                                pages shown as A/B in a fixed pseudo-random order; --swap adds the mirrored order
//   node eval/run.mjs pair-score --run <dir> [--base <dir>]      candidate wins, losses, ties overall and per dimension
//   node eval/run.mjs plateau                                    M-009: has the loop stalled since the last plan review?
//                                                                (exit 3 = run the plan review in loop/plan-review.md)
//
// Scale v2 (M-017): the judge decides 40 observable criteria (eval/judge-prompt-v2.md) and this file computes the scores.
//   node eval/run.mjs judge    --run <dir> --scale v2            write JUDGE_PROMPT.v2.md per case; replies go to judge-v2.<model>.json
//   node eval/run.mjs compare  --base <dir>[,<dir>…] --run <dir> --scale v2   v2 per case and dimension; the decision stays with pairs
//   node eval/run.mjs calib-archive --set <name>                 M-018: freeze the set's pages and their v1 and pair evidence in eval/calib
//   node eval/run.mjs calib    --set <name> [--tier core|extra|all|drift] [--pages id,…] [--label x]   blinded run of frozen pages
//   node eval/run.mjs restore  --set <name> --groups b100a,b100b   put archived pages back as their original runs (a fresh clone)
//   node eval/run.mjs validate --run <calib run> [--against <calib run>]   V1 known differences, V2 re-judging, V3 agreement with
//                                                                clear pair verdicts; --against: drift of the same pages between two runs
//   node eval/run.mjs ref      --list eval/reference/refs.json [--only id,…]   live reference pages as a run (V4)
//   node eval/run.mjs ref-compare --ref <run> --base <dir>[,<dir>…]   reference pages vs our pages on the dimensions both can be judged on
//   node eval/run.mjs v2-template                                a blank v2 judge file, for a human judge (V5)
import fs from 'node:fs';
import path from 'node:path';
import { execSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILL = path.join(ROOT, 'skills/design-nexus');
const CASES = path.join(ROOT, 'eval/cases');
const RUNS = path.join(ROOT, 'eval/runs');
const HISTORY = path.join(ROOT, 'eval/history.jsonl');
const DIMS = { D1: 1.5, D2: 1.5, D3: 1, D4: 1, D5: 1, D6: 1, D7: 1, D8: 1, D9: 1, D10: 1 };
// Scale v2 (M-017): four criteria per dimension. A dimension counts its met criteria (0–4); the total is the weighted share.
const V2_IDS = Object.keys(DIMS).flatMap((d) => [1, 2, 3, 4].map((i) => `${d}.${i}`));
// The dimensions a live reference page can be judged on (its brief is written from the page; no DESIGN.md, no readable code).
const V2_SUB = ['D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D9'];
// v2 scores come from one model; models are never averaged together (their strictness differs, M-017).
const PRIMARY = 'opus';
const CALIB = path.join(ROOT, 'eval/calib');

const [cmd, ...rest] = process.argv.slice(2);
const opt = {};
for (let i = 0; i < rest.length; i++) if (rest[i].startsWith('--')) opt[rest[i].slice(2)] = rest[i + 1]?.startsWith('--') ? true : rest[++i] ?? true;

const read = (p) => fs.readFileSync(p, 'utf8');
const promptId = () => createHash('sha1').update(read(path.join(ROOT, 'eval/judge-prompt-v2.md'))).digest('hex').slice(0, 10);
const briefHash = (c) => createHash('sha1').update(parseCase(path.join(CASES, `${c}.md`)).brief).digest('hex').slice(0, 12);
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
// A calibration run holds several pages of one case side by side ("03-dash-clinic--c07"); the case is the part before "--".
const caseOf = (d) => d.split('--')[0];
// A reference page carries its own brief in CASE.md (with a url); every other page takes its brief from eval/cases.
function caseMeta(dir, d) {
  const own = path.join(dir, 'CASE.md');
  if (fs.existsSync(own)) return parseCase(own);
  const f = path.join(CASES, `${caseOf(d)}.md`);
  return fs.existsSync(f) ? parseCase(f) : null;
}
// eval/calib/<set>.json: the frozen pages (id, run, case, group, tier), the pages judged twice, the checks and their targets.
function calibSet(name) {
  if (!name || name === true) die('--set <name> is required (a file eval/calib/<name>.json)');
  const f = path.join(CALIB, `${name}.json`);
  if (!fs.existsSync(f)) die(`calibration set not found: ${path.relative(ROOT, f)}`);
  return { set: name, ...JSON.parse(read(f)) };
}
// Screenshots grouped by width: the first screen, the 900px tiles in order, then the uncut page (an overview only).
function shotLines(dir) {
  const sd = path.join(dir, 'shots');
  const files = fs.existsSync(sd) ? fs.readdirSync(sd).filter((f) => f.endsWith('.png')).sort() : [];
  if (!files.length) return ['(none: run `score` first to render)'];
  const widths = [...new Set(files.map((f) => (f.match(/^w(\d+)/) || [])[1]).filter(Boolean))].sort((a, b) => a - b);
  const out = [];
  for (const w of widths) {
    const tiles = files.filter((f) => new RegExp(`^w${w}-\\d{2}\\.png$`).test(f));
    out.push(`- ${w}px`);
    if (files.includes(`w${w}-first.png`)) out.push(`  - first screen, as a visitor sees it: ${path.join(sd, `w${w}-first.png`)}`);
    tiles.forEach((f, i) => out.push(`  - tile ${i + 1} of ${tiles.length}: ${path.join(sd, f)}`));
    if (files.includes(`w${w}.png`)) out.push(`  - ${tiles.length ? 'uncut page (overview only)' : 'full page'}: ${path.join(sd, `w${w}.png`)}`);
  }
  for (const f of files.filter((f) => !/^w\d+(-first|-\d{2})?\.png$/.test(f))) out.push(`- ${path.join(sd, f)}`);
  return out;
}
// Pair copies keep the shots (the pair judge reads them) but never scores, judge files, or prompts.
const NOT_PAIR = /(^|\/)(score\.json|judge[^/]*\.json|pair\.[^/]*\.json|summary[^/]*|JUDGE_PROMPT[^/]*\.md|PROMPT\.md|generate\.log|judge\.log)$/;
const tiled = (dir) => fs.existsSync(path.join(dir, 'shots')) && fs.readdirSync(path.join(dir, 'shots')).some((f) => /^w\d+-01\.png$/.test(f));
// What a judge or pair judge must never see in a page copy: scores, judge files, prompts (PROMPT.md names the skill variant), shots of the generator.
const NOT_PAGE = /(^|\/)(score\.json|judge[^/]*\.json|pair\.[^/]*\.json|summary[^/]*|JUDGE_PROMPT[^/]*\.md|PROMPT\.md|before\.json|generate\.log|judge\.log|feedback\.md|compare\.md|shots[^/]*|\.design-nexus)$/;
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

// Scale v2: met criteria per dimension (0–4), at most 2 in a dimension a veto defect is charged to; total and sub are
// weighted shares (0–100). The judge's own consistency (a failed criterion names its defect) is reported, not enforced.
function v2Score(j) {
  if (!j?.criteria || typeof j.criteria !== 'object') return null;
  const warnings = [], met = {};
  for (const id of V2_IDS) {
    const c = j.criteria[id];
    const v = c && typeof c === 'object' ? c.met : c;
    met[id] = v === true ? 1 : v === false ? 0 : null;
    if (v === undefined) warnings.push(`${id} missing`);
  }
  const defects = Array.isArray(j.defects) ? j.defects.filter((x) => x && typeof x === 'object') : [];
  const vetoDims = new Set(defects.filter((x) => x.severity === 'veto' && x.criterion).map((x) => String(x.criterion).split('.')[0]));
  for (const id of V2_IDS) {
    const charged = defects.filter((x) => x.criterion === id && x.severity && x.severity !== 'minor');
    if (met[id] === 0 && !charged.length) warnings.push(`${id} is not met but no defect is charged to it`);
    if (met[id] === 1 && charged.length) warnings.push(`${id} is met although a ${charged[0].severity} defect is charged to it`);
  }
  const dims = {};
  for (const d of Object.keys(DIMS)) {
    const vals = [1, 2, 3, 4].map((i) => met[`${d}.${i}`]).filter((v) => v !== null);
    if (!vals.length) continue;
    const s = (vals.reduce((a, b) => a + b, 0) / vals.length) * 4;
    dims[d] = +(vetoDims.has(d) ? Math.min(s, 2) : s).toFixed(2);
  }
  return { total: v2Share(dims, Object.keys(DIMS)), sub: v2Share(dims, V2_SUB), dims, met, vetoes: [...vetoDims].sort(), defects: defects.filter((x) => x.severity && x.severity !== 'minor').length, minor: defects.filter((x) => x.severity === 'minor').length, warnings, judge_model: j.judge_model || null };
}
function v2Share(dims, keys) {
  let sum = 0, max = 0;
  for (const d of keys) if (dims[d] !== undefined && dims[d] !== null) { sum += dims[d] * DIMS[d]; max += 4 * DIMS[d]; }
  return max ? +((sum / max) * 100).toFixed(1) : null;
}
// judge-v2.json and judge-v2.<name>.json in a case folder, keyed by judge name. The v1 reader never matches these names.
function readJudgesV2(dir) {
  const out = {};
  for (const f of fs.readdirSync(dir)) {
    const m = f.match(/^judge-v2(?:\.([\w.-]+))?\.json$/);
    if (!m) continue;
    try { out[m[1] || 'judge'] = JSON.parse(read(path.join(dir, f))); } catch { console.log(`  ${f} did not parse; skipped`); }
  }
  return out;
}
const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const r1 = (x, k = 1) => (x === null || x === undefined || Number.isNaN(x) ? null : +x.toFixed(k));
// Samples of one model are scored one by one and averaged; the primary model's mean is the page's v2 score.
function v2Summary(samples) {
  const scored = Object.entries(samples).map(([name, j]) => [name, v2Score(j)]).filter(([, s]) => s);
  if (!scored.length) return null;
  const groups = {};
  for (const [name, s] of scored) (groups[name.split('.')[0]] ||= []).push(s);
  const models = {};
  for (const [m, ss] of Object.entries(groups)) {
    const dims = Object.fromEntries(Object.keys(DIMS).map((d) => [d, r1(mean(ss.map((s) => s.dims[d]).filter((v) => v !== undefined)), 2)]).filter(([, v]) => v !== null));
    const met = Object.fromEntries(V2_IDS.map((id) => [id, r1(mean(ss.map((s) => s.met[id]).filter((v) => v !== null)), 2)]));
    const totals = ss.map((s) => s.total).filter((v) => v !== null);
    models[m] = {
      samples: ss.length, total: r1(mean(totals)), sub: r1(mean(ss.map((s) => s.sub).filter((v) => v !== null))), dims, met,
      spread: totals.length > 1 ? r1(Math.max(...totals) - Math.min(...totals)) : null,
      vetoes: [...new Set(ss.flatMap((s) => s.vetoes))].sort(), defects: r1(mean(ss.map((s) => s.defects))), minor: r1(mean(ss.map((s) => s.minor))),
      warnings: ss.reduce((a, s) => a + s.warnings.length, 0), judge_models: [...new Set(ss.map((s) => s.judge_model).filter(Boolean))],
    };
  }
  const primary = models[PRIMARY] ? PRIMARY : Object.keys(models).sort()[0];
  const p = models[primary];
  return { scale: 'v2', primary, total: p.total, sub: p.sub, dims: p.dims, met: p.met, samples: p.samples, spread: p.spread, vetoes: p.vetoes, models: Object.fromEntries(Object.entries(models).map(([m, v]) => [m, m === primary ? { ...v, met: undefined } : v])) };
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
      // M-019: files the brief refers to (06: hero.png) are copied in under their own names, so every generation starts from the same images.
      for (const a of String(c.assets || '').split(',').map((x) => x.trim()).filter(Boolean)) fs.copyFileSync(path.join(ROOT, a), path.join(dir, path.basename(a)));
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
    // --scale v2 (M-017): criteria instead of scores; the prompt and the reply files carry the scale in their names,
    // so a v1 and a v2 judgement of the same page sit side by side.
    const v2 = opt.scale === 'v2';
    if (opt.scale && opt.scale !== true && !['v1', 'v2'].includes(opt.scale)) die('--scale is v1 (default) or v2');
    const base = read(path.join(ROOT, v2 ? 'eval/judge-prompt-v2.md' : 'eval/judge-prompt.md'));
    const promptName = v2 ? 'JUDGE_PROMPT.v2.md' : 'JUDGE_PROMPT.md';
    const replyName = v2 ? 'judge-v2.json' : 'judge.json';
    for (const d of caseDirs(run)) {
      const dir = path.join(run, d);
      const meta = caseMeta(dir, d);
      const brief = meta ? meta.brief : '(brief missing)';
      if (v2 && !tiled(dir)) console.log(`warning: ${d} has no tiled screenshots; run \`score\` first so the judge can read every width`);
      const tools = fs.existsSync(path.join(dir, 'score.json')) ? JSON.parse(read(path.join(dir, 'score.json'))).tools : null;
      const prompt = [
        // M-022: the prompt's id travels with the judgement, so a v2 series is (judge model, prompt, capture).
        ...(v2 ? [`<!-- judge-prompt-v2 ${promptId()} -->`, ''] : []),
        base, '', '## BRIEF', '', brief, '',
        '## Case directory', '', dir, '',
        ...(meta?.url ? ['## Reference page', '', `Live site: ${meta.url} (see *Reference pages* above).`, ''] : []),
        '## Screenshots', '', ...shotLines(dir), '',
        '## Tool results', '', '```json', JSON.stringify(tools, null, 2), '```', '',
      ].join('\n');
      // A judgement belongs to the prompt it was made with: replacing the prompt under existing v2 judgements breaks the series.
      const prev = v2 && fs.existsSync(path.join(dir, promptName)) ? (read(path.join(dir, promptName)).match(/<!-- judge-prompt-v2 (\w+) -->/) || [])[1] : null;
      if (prev && prev !== promptId() && Object.keys(readJudgesV2(dir)).length) console.log(`warning: ${d} has v2 judgements made with prompt ${prev}; the new prompt is ${promptId()}. Judge the page again (and move the old judge-v2 files aside) before scoring.`);
      fs.writeFileSync(path.join(dir, promptName), prompt);
      if (opt.cmd && opt.cmd !== true) {
        console.log(`judge ${d} …`);
        const r = spawnSync(opt.cmd, { cwd: dir, input: prompt, shell: true, encoding: 'utf8', maxBuffer: 16 << 20, timeout: 900000 });
        const out = r.stdout || '';
        const m = out.match(v2 ? /\{[\s\S]*"criteria"[\s\S]*\}/ : /\{[\s\S]*"scores"[\s\S]*\}/);
        if (!m) { console.log(`  no JSON in judge output; see judge.log`); fs.writeFileSync(path.join(dir, 'judge.log'), out + (r.stderr || '')); continue; }
        try { writeJSON(path.join(dir, replyName), JSON.parse(m[0])); } catch { fs.writeFileSync(path.join(dir, 'judge.log'), out); console.log('  judge JSON did not parse; see judge.log'); }
      }
    }
    const retest = path.join(run, '_calib', 'retest.txt');
    if (v2 && fs.existsSync(retest) && read(retest).trim()) console.log(`judge these a second time, each in another fresh context (judge-v2.opus.2.json): ${read(retest).trim().split('\n').join(', ')}`);
    if (!opt.cmd) console.log(v2
      ? 'wrote JUDGE_PROMPT.v2.md per case. Give each to a fresh-context agent (Opus; one page per agent) and save its JSON reply as judge-v2.opus.json (a second sample: judge-v2.opus.2.json), then run `score` again.'
      : 'wrote JUDGE_PROMPT.md per case. Give each to a fresh-context agent and save its JSON reply as judge.json in the same folder, then run `score` again.');
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
        // Both pages must be captured the same way (M-017: tiles and first screens), or the judge compares the capture.
        if (tiled(path.join(cand, d)) !== tiled(path.join(b, d))) die(`${d}: ${tiled(path.join(cand, d)) ? path.basename(b) : path.basename(cand)} was rendered without tiles; run \`score\` on both runs first`);
        const pid = `${d}--${path.basename(b)}`;
        // Fixed pseudo-random side, so re-running pair does not reshuffle a pair that was already judged.
        const h = [...pid].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
        // --swap also writes the mirrored order (id + "--swap"); pair-score keeps a verdict only when both orders agree.
        for (const swapped of opt.swap ? [false, true] : [false]) {
        const id = swapped ? `${pid}--swap` : pid;
        const candIsA = (h % 2 === 0) !== swapped;
        keys[id] = { A: candIsA ? 'cand' : 'base', base: path.relative(ROOT, b), pair: pid };
        const [srcA, srcB] = candIsA ? [path.join(cand, d), path.join(b, d)] : [path.join(b, d), path.join(cand, d)];
        // M-012: the judge sees copies named A and B, so run labels (dates, versions, "exp") never tell it which page is new.
        const [aDir, bDir] = [['A', srcA], ['B', srcB]].map(([side, src]) => {
          const dst = path.join(pairsDir, id, side);
          fs.rmSync(dst, { recursive: true, force: true });
          fs.cpSync(src, dst, { recursive: true, dereference: true, filter: (f) => !NOT_PAIR.test(path.relative(src, f)) });
          return dst;
        });
        const brief = caseMeta(path.join(cand, d), d)?.brief ?? '(brief missing)';
        const prompt = [base, '', '## BRIEF', '', brief, '', '## Page A', '', aDir, '', ...shotLines(aDir), '', '## Page B', '', bDir, '', ...shotLines(bDir), ''].join('\n');
        fs.mkdirSync(path.join(pairsDir, id), { recursive: true });
        fs.writeFileSync(path.join(pairsDir, id, 'PAIR_PROMPT.md'), prompt);
        n++;
        }
      }
    }
    writeJSON(keyFile, keys);
    console.log(`wrote ${n} PAIR_PROMPT.md under ${path.relative(ROOT, pairsDir)}/. Give each to a fresh-context judge and save its JSON as pair.<model>.json next to the prompt, then run \`pair-score\`.`);
  },

  // M-009: a stalled loop gets its plan reviewed by a fresh, maximum-effort agent instead of more of the same hypotheses.
  plateau() {
    const log = read(path.join(ROOT, 'loop/experiments.md'));
    const planFile = path.join(ROOT, 'loop/plan.md');
    const since = fs.existsSync(planFile) ? Number((read(planFile).match(/reviewed-after:\s*EXP-(\d+)/) || [])[1] || 0) : 0;
    const exps = [];
    for (const sec of log.split(/^### /m).slice(1)) {
      const id = Number((sec.match(/^EXP-(\d+)/) || [])[1]);
      const v = (sec.match(/^- verdict:\s*(.*)$/m) || [])[1];
      if (!id || !v) continue;
      const head = v.split('。')[0];
      const last = [...head.matchAll(/ACCEPT|REJECT/g)].pop();
      if (last) exps.push({ id, ok: last[0] === 'ACCEPT' });
    }
    const recent = exps.filter((e) => e.id > since);
    let streak = 0;
    for (let i = recent.length - 1; i >= 0 && !recent[i].ok; i--) streak++;
    const last4 = recent.slice(-4);
    const stalled = streak >= 3 || (last4.length === 4 && !last4.some((e) => e.ok));
    console.log(`experiments since the last plan review (EXP-${String(since).padStart(3, '0')}): ${recent.map((e) => `EXP-${String(e.id).padStart(3, "0")} ${e.ok ? 'ACCEPT' : 'REJECT'}`).join(', ') || 'none'}`);
    console.log(stalled
      ? `STALLED: ${streak >= 3 ? `${streak} rejects in a row` : 'no accept in the last 4'}. Run the plan review in loop/plan-review.md (fresh context, Opus at max effort) before the next hypothesis.`
      : `not stalled (${streak} reject(s) in a row; the review runs at 3 in a row or no accept in 4).`);
    if (stalled) process.exitCode = 3;
  },

  'pair-score'() {
    const cand = runDir(opt.run);
    const pairsDir = path.join(cand, '_pairs');
    const keys = JSON.parse(read(path.join(pairsDir, 'key.json')));
    const dims = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'];
    const tally = () => ({ win: 0, loss: 0, tie: 0 });
    const byJudge = {}, byDim = Object.fromEntries(dims.map((k) => [k, tally()])), byCase = {};
    const side = (v, key) => (v !== 'A' && v !== 'B' ? 'tie' : (v === 'A') === (key.A === 'cand') ? 'win' : 'loss');
    const baseFilter = opt.base ? String(opt.base).split(',').map((b) => path.basename(runDir(b))) : null;
    // Each judgement in the candidate's view; position = how often the page shown as A was chosen.
    // clear = only verdicts with margin clear or large count; in the M-008 validation every slight verdict that was
    // re-judged in the mirrored order flipped about half the time, and no clear verdict ever flipped.
    const seen = {}; const position = { A: 0, B: 0, tie: 0 }; const clearByJudge = {};
    for (const [id, key] of Object.entries(keys)) {
      if (baseFilter && !baseFilter.includes(path.basename(key.base))) continue;
      const dir = path.join(pairsDir, id);
      if (!fs.existsSync(dir)) continue;
      for (const f of fs.readdirSync(dir).filter((x) => /^pair\..+\.json$/.test(x))) {
        const j = JSON.parse(read(path.join(dir, f)));
        const judge = f.replace(/^pair\.|\.json$/g, '');
        position[j.overall === 'A' || j.overall === 'B' ? j.overall : 'tie']++;
        const k = `${key.pair || id}|${judge}`;
        (seen[k] = seen[k] || { judge, pair: key.pair || id, v: [] }).v.push({ overall: side(j.overall, key), clear: j.margin === 'slight' ? 'tie' : side(j.overall, key), dims: Object.fromEntries(dims.map((d) => [d, side(j.dims?.[d], key)])) });
      }
    }
    // With both orders judged, a verdict that flips with position counts as a tie.
    const merge = (xs) => (xs.every((x) => x === xs[0]) ? xs[0] : 'tie');
    let pairsBoth = 0, flips = 0;
    for (const { judge, pair, v } of Object.values(seen)) {
      if (v.length > 1) { pairsBoth++; if (merge(v.map((x) => x.overall)) === 'tie' && v.some((x) => x.overall !== 'tie')) flips++; }
      const o = merge(v.map((x) => x.overall));
      (byJudge[judge] = byJudge[judge] || tally())[o]++;
      (clearByJudge[judge] = clearByJudge[judge] || tally())[merge(v.map((x) => x.clear))]++;
      const c = pair.split('--')[0];
      (byCase[c] = byCase[c] || tally())[o]++;
      for (const d of dims) byDim[d][merge(v.map((x) => x.dims[d]))]++;
    }
    const all = Object.values(byJudge).reduce((a, t) => ({ win: a.win + t.win, loss: a.loss + t.loss, tie: a.tie + t.tie }), tally());
    // Two-sided sign test on decided pairs (ties dropped).
    const nDec = all.win + all.loss;
    const choose = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };
    const tail = (k) => { let p = 0; for (let i = 0; i <= k; i++) p += choose(nDec, i); return p / 2 ** nDec; };
    const p = nDec ? Math.min(1, 2 * tail(Math.min(all.win, all.loss))) : 1;
    const fmt = (t) => `${t.win}–${t.loss}–${t.tie}`;
    const lines = [`# Pairs: ${path.basename(cand)} (candidate) vs base`, '', `Overall (win–loss–tie, candidate's view): **${fmt(all)}**, sign test p = ${p.toFixed(3)}`, '',
      `Position: page A chosen ${position.A}, page B ${position.B}, tie ${position.tie}.` + (pairsBoth ? ` Judged in both orders: ${pairsBoth}, of which ${flips} flipped with position (counted as tie).` : ''), '',
      '| judge | overall | clear only (slight = tie) |', '|---|---|---|', ...Object.entries(byJudge).map(([k, t]) => `| ${k} | ${fmt(t)} | ${fmt(clearByJudge[k])} |`), '',
      '| case | overall |', '|---|---|', ...Object.entries(byCase).map(([k, t]) => `| ${k} | ${fmt(t)} |`), '',
      '| dim | win–loss–tie | net |', '|---|---|---|', ...dims.map((k) => `| ${k} | ${fmt(byDim[k])} | ${byDim[k].win - byDim[k].loss >= 0 ? '+' : ''}${byDim[k].win - byDim[k].loss} |`), ''];
    const tag = baseFilter ? '-' + baseFilter.join('+') : '';
    fs.writeFileSync(path.join(cand, `pairs${tag}.md`), lines.join('\n'));
    writeJSON(path.join(cand, `pairs${tag}.json`), { overall: all, p, position, pairsBoth, flips, byJudge, clearByJudge, byCase, byDim });
    console.log(lines.join('\n'));
  },

  score() {
    const run = runDir(opt.run);
    const meta = fs.existsSync(path.join(run, 'run.json')) ? JSON.parse(read(path.join(run, 'run.json'))) : { id: path.basename(run) };
    const rows = [];
    for (const d of caseDirs(run)) {
      const dir = path.join(run, d);
      const c = caseMeta(dir, d) || {};
      // A reference page (CASE.md with a url, V4) is rendered live; there is no file to lint.
      const entry = findEntry(dir) || (/^https?:\/\//.test(c.url || '') ? c.url : null);
      if (!entry) { rows.push({ case: d, missing: true }); continue; }
      const live = /^https?:\/\//.test(entry);
      const lint = live ? { counts: 'skipped (live page)', findings: [] } : runTool('lint.mjs', [entry, ...(fs.existsSync(path.join(dir, 'DESIGN.md')) ? ['--design', path.join(dir, 'DESIGN.md')] : [])]);
      // M-006: every scored render sees the same weekday mid-morning in the page's own zone, so a timetable or
      // opening-hours page isn't judged on whatever hour the scoring happened to run.
      const ja = live ? c.language === 'ja' : /lang=["']ja/i.test(fs.readFileSync(entry, 'utf8').slice(0, 2000));
      const clock = live ? [] : ja ? ['--time', '2026-11-04T10:30:00+09:00', '--tz', 'Asia/Tokyo'] : ['--time', '2026-11-04T10:30:00-05:00', '--tz', 'America/New_York'];
      // M-017: the first screen as a visitor sees it, and the page in 900px tiles with fixed and sticky bars laid out in flow,
      // so judges read every width without cropping and no bar covers content in a full-page shot. Findings do not change.
      const renderArgs = [entry, '--out', path.join(dir, 'shots'), ...clock, '--first-screen', '--tiles', ...(c.surface === 'mobile' ? ['--surface', 'mobile'] : [])];
      if (!live && fs.existsSync(path.join(dir, 'SOURCE.html'))) {
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
      // Scale v2 (M-017) sits beside v1 and never mixes with it: its own files, its own block, its own history line.
      const v2samples = readJudgesV2(dir);
      const v2 = v2Summary(v2samples);
      if (v2 && fs.existsSync(path.join(dir, 'JUDGE_PROMPT.v2.md'))) v2.prompt = (read(path.join(dir, 'JUDGE_PROMPT.v2.md')).match(/<!-- judge-prompt-v2 (\w+) -->/) || [])[1] || null;
      const scale = [jvals.length ? 'v1' : null, v2 ? 'v2' : null].filter(Boolean).join('+') || null;
      const result = {
        case: d, surface: c.surface, split: c.split || 'train', scale, auto, judge: js, total, gate: auto.floor === 0 ? 'pass' : 'fail',
        judges: perJudge, judge_spread: jvals.length > 1 ? +(Math.max(...jvals) - Math.min(...jvals)).toFixed(1) : null,
        render: render.skipped ? 'skipped' : render.error ? 'error' : 'ok',
        dims: meanDims(Object.values(judges)),
        ...(v2 ? { v2 } : {}),
        fingerprint: live ? null : { ...fingerprint(entry, dir), ...(render.look ? { look: render.look } : {}) },
        tools: { lint: lint.counts, render: render.counts || (render.skipped ? 'skipped' : render.error), ids: countIds(findings) },
      };
      // M-007: the judge is told to treat Floor findings as facts, so a verdict written against other tool results
      // (a check added or a false positive fixed since) is stale for this case.
      const floorIds = (t) => JSON.stringify(Object.entries(t?.ids || {}).filter(([id]) => id.startsWith('F')).sort());
      for (const [promptName, judged, flag] of [['JUDGE_PROMPT.md', Object.keys(judges).length, 'stale_judge'], ['JUDGE_PROMPT.v2.md', v2 !== null, 'stale_judge_v2']]) {
        const jp = path.join(dir, promptName);
        if (!judged || !fs.existsSync(jp)) continue;
        const m = read(jp).match(/## Tool results\s*```json\s*([\s\S]*?)```/);
        let seen = null; try { seen = m && JSON.parse(m[1]); } catch {}
        if (seen && floorIds(seen) !== floorIds(result.tools)) {
          result[flag] = true;
          console.log(`warning: ${d} was judged (${promptName}) against Floor findings ${floorIds(seen)} but the current tools report ${floorIds(result.tools)}; run \`judge\` again for this case and re-judge it`);
        }
      }
      const issues = [
        ...Object.entries(samples).flatMap(([name, j]) => (j.top_issues || []).map((i) => ({ judge: name, ...i }))),
        ...Object.entries(v2samples).flatMap(([name, j]) => (j.top_issues || []).map((i) => ({ judge: `v2.${name}`, ...i, dimension: i.dimension || String(i.criterion || '').split('.')[0] || undefined }))),
      ];
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
      scales: [...new Set(scored.flatMap((r) => (r.scale ? r.scale.split('+') : [])))].sort(),
      v2: v2RunSummary(scored),
      cases: rows,
    };
    writeJSON(path.join(run, 'summary.json'), summary);
    fs.writeFileSync(path.join(run, 'summary.md'), summaryMd(summary));
    // One line per scale. A line without `scale` was written before M-017 and is v1. Calibration and reference runs
    // (M-018, M-020) are not versions of the skill and stay out of the history.
    if (meta.kind === 'calib' || meta.kind === 'ref') { console.log(read(path.join(run, 'summary.md'))); return; }
    const line = { run: summary.run, version: summary.version, commit: summary.commit, at: summary.scored_at, ...(meta.generator ? { generator: meta.generator } : {}) };
    fs.appendFileSync(HISTORY, JSON.stringify({ ...line, scale: 'v1', mean_auto: summary.mean_auto, mean_judge: summary.mean_judge, mean_total: summary.mean_total, gate_failures: summary.gate_failures.length }) + '\n');
    if (summary.v2) fs.appendFileSync(HISTORY, JSON.stringify({ ...line, scale: 'v2', judge: summary.v2.primary, judge_models: summary.v2.judge_models, prompts: summary.v2.prompts, cases: summary.v2.cases, mean_total: summary.v2.mean_total, mean_sub: summary.v2.mean_sub, at_92: summary.v2.at_92, at_95: summary.v2.at_95, gate_failures: summary.gate_failures.length }) + '\n');
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
    if (opt.scale === 'v2') return compareV2(bases, cand);
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

  // M-018: the calibration set. Pages from earlier runs are frozen in eval/calib/pages (eval/runs is not in git), with the
  // v1 scores and pair verdicts they already have, so the scale can be validated and re-checked whenever the judge changes.
  'calib-archive'() {
    const set = calibSet(opt.set);
    const pagesDir = path.join(CALIB, 'pages');
    const evFile = path.join(CALIB, `${set.set}.evidence.json`);
    const old = fs.existsSync(evFile) ? JSON.parse(read(evFile)) : { pages: {}, pairs: [] };
    const evidence = { set: set.set, archived_at: new Date().toISOString(), pages: {}, pairs: [] };
    const kept = new Set();
    for (const p of set.pages) {
      const src = path.join(RUNS, p.run, p.case);
      const dst = path.join(pagesDir, p.id);
      // Where the runs are gone (a fresh clone), the archived copy and its evidence are kept as they are.
      if (!fs.existsSync(src)) { if (fs.existsSync(dst)) { kept.add(p.id); if (old.pages[p.id]) evidence.pages[p.id] = old.pages[p.id]; continue; } die(`${p.id}: ${path.relative(ROOT, src)} not found`); }
      if ((parseCase(path.join(CASES, `${p.case}.md`)).split || 'train') !== 'train') die(`${p.id}: ${p.case} is not a training case; the calibration set uses 01–06 only`);
      fs.rmSync(dst, { recursive: true, force: true });
      fs.cpSync(src, dst, { recursive: true, dereference: true, filter: (f) => !NOT_PAGE.test(path.relative(src, f)) });
      const v1 = {};
      for (const [name, j] of Object.entries(readJudges(src))) { const s = judgeScore(j); if (s !== null) v1[name] = { judge60: s, dims: j.scores }; }
      evidence.pages[p.id] = { run: p.run, case: p.case, group: p.group, v1 };
    }
    // Pair verdicts between two pages of the set, in the candidate's view (cand = the page from the run that held _pairs).
    const byRunCase = Object.fromEntries(set.pages.map((p) => [`${p.run}|${p.case}`, p.id]));
    for (const run of fs.readdirSync(RUNS)) {
      const kf = path.join(RUNS, run, '_pairs', 'key.json');
      if (!fs.existsSync(kf)) continue;
      for (const [id, key] of Object.entries(JSON.parse(read(kf)))) {
        const c = id.split('--')[0];
        const cand = byRunCase[`${run}|${c}`], base = byRunCase[`${path.basename(key.base)}|${c}`];
        if (!cand || !base) continue;
        const dir = path.join(RUNS, run, '_pairs', id);
        if (!fs.existsSync(dir)) continue;
        const side = (v) => (v !== 'A' && v !== 'B' ? 'tie' : (v === 'A') === (key.A === 'cand') ? 'cand' : 'base');
        for (const f of fs.readdirSync(dir).filter((x) => /^pair\..+\.json$/.test(x))) {
          const j = JSON.parse(read(path.join(dir, f)));
          evidence.pairs.push({ cand, base, model: f.replace(/^pair\.|\.json$/g, ''), pair: key.pair || id, swap: id.endsWith('--swap'), overall: side(j.overall), margin: j.margin || null, dims: Object.fromEntries(Object.keys(DIMS).map((d) => [d, side(j.dims?.[d])])) });
        }
      }
    }
    evidence.pairs.push(...old.pairs.filter((x) => kept.has(x.cand) || kept.has(x.base)));
    // The briefs the pages were judged against; `calib` warns when a case's brief has changed since.
    evidence.briefs = Object.fromEntries([...new Set(set.pages.map((p) => p.case))].sort().map((c) => [c, briefHash(c)]));
    // The runs' own metadata (version, commit, generator), for `restore` and for reading a page's origin.
    evidence.runs = { ...(old.runs || {}) };
    for (const r of new Set(set.pages.map((p) => p.run))) {
      const f = path.join(RUNS, r, 'run.json');
      if (fs.existsSync(f)) { const { cases, ...m } = JSON.parse(read(f)); evidence.runs[r] = m; }
    }
    writeJSON(evFile, evidence);
    console.log(`archived ${set.pages.length - kept.size} page(s) under ${path.relative(ROOT, pagesDir)}/${kept.size ? ` (${kept.size} kept from an earlier archive)` : ''} and ${evidence.pairs.length} pair verdict(s) in ${path.relative(ROOT, evFile)}`);
  },

  // Puts archived pages back as the run they came from (case folders by name, not blinded), for a fresh clone where
  // eval/runs is empty: `restore --set v2-validation --groups b100a,b100b` gives the v0.10.0 base runs back.
  restore() {
    const set = calibSet(opt.set);
    const groups = String(opt.groups || '').split(',').filter(Boolean);
    if (!groups.length) die('restore needs --groups <group>[,<group>…] (the "group" field in the set file)');
    for (const g of groups) {
      const pages = set.pages.filter((p) => p.group === g);
      if (!pages.length) die(`no group ${g} in ${set.set}`);
      const run = path.join(RUNS, pages[0].run);
      if (fs.existsSync(run)) { console.log(`${pages[0].run} exists; left as it is`); continue; }
      for (const p of pages) fs.cpSync(path.join(CALIB, 'pages', p.id), path.join(run, p.case), { recursive: true });
      const evFile = path.join(CALIB, `${set.set}.evidence.json`);
      const m = (fs.existsSync(evFile) ? JSON.parse(read(evFile)).runs || {} : {})[pages[0].run] || { id: pages[0].run, version: pages[0].version };
      writeJSON(path.join(run, 'run.json'), { ...m, restored_from: `eval/calib/pages (${set.set})`, restored_at: new Date().toISOString(), cases: pages.map((p) => p.case) });
      console.log(`restored ${pages[0].run} (${pages.map((p) => p.case).join(', ')}); run \`score\` on it before judging or pairing`);
    }
  },

  // A blinded run of calibration pages: folders "<case>--cNN" in an order fixed by a hash, the key kept in _calib/.
  calib() {
    const set = calibSet(opt.set);
    const tier = opt.tier && opt.tier !== true ? opt.tier : 'core';
    const only = opt.pages && opt.pages !== true ? String(opt.pages).split(',') : null;
    const pages = set.pages.filter((p) => (only ? only.includes(p.id) : tier === 'all' || (tier === 'drift' ? (set.drift || []).includes(p.id) : p.tier === tier)));
    if (!pages.length) die(`no pages in ${set.set} for ${only ? '--pages ' + only.join(',') : '--tier ' + tier}`);
    const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '').replace(/^(\d{8})(\d{4})$/, '$1-$2');
    const id = `${stamp}-calib-${set.set}${opt.label && opt.label !== true ? '-' + opt.label : ''}`;
    const run = path.join(RUNS, id);
    fs.mkdirSync(path.join(run, '_calib'), { recursive: true });
    const h = (x) => [...`${set.set}|${x}`].reduce((a, c) => (a * 33 + c.charCodeAt(0)) >>> 0, 5381);
    const slots = [...set.pages].sort((a, b) => h(a.id) - h(b.id)).map((p) => p.id);
    const key = {};
    for (const p of pages) {
      const d = `${p.case}--c${String(slots.indexOf(p.id) + 1).padStart(2, '0')}`;
      const archived = path.join(CALIB, 'pages', p.id), live = path.join(RUNS, p.run, p.case);
      const src = fs.existsSync(archived) ? archived : fs.existsSync(live) ? live : die(`${p.id}: neither ${path.relative(ROOT, archived)} nor ${path.relative(ROOT, live)} exists; run calib-archive where the runs are`);
      fs.cpSync(src, path.join(run, d), { recursive: true, dereference: true, filter: (f) => !NOT_PAGE.test(path.relative(src, f)) });
      key[d] = { id: p.id, run: p.run, case: p.case, group: p.group, tier: p.tier };
    }
    writeJSON(path.join(run, '_calib', 'key.json'), key);
    const evFile = path.join(CALIB, `${set.set}.evidence.json`);
    const briefs = fs.existsSync(evFile) ? JSON.parse(read(evFile)).briefs || {} : {};
    for (const c of [...new Set(pages.map((p) => p.case))]) if (briefs[c] && briefs[c] !== briefHash(c)) console.log(`warning: the brief of ${c} changed after the set was archived; its pages are judged against a brief they were not made for, so drift and validation on ${c} are not comparable`);
    const retest = Object.entries(key).filter(([, k]) => (set.retest || []).includes(k.id)).map(([d]) => d).sort();
    fs.writeFileSync(path.join(run, '_calib', 'retest.txt'), retest.join('\n') + (retest.length ? '\n' : ''));
    writeJSON(path.join(run, 'run.json'), { id, kind: 'calib', set: set.set, tier: only ? 'pages' : tier, version: version(), commit: gitRev(), created: new Date().toISOString(), cases: Object.keys(key).sort() });
    console.log(`prepared ${path.relative(ROOT, run)} with ${pages.length} page(s); ${retest.length} of them are judged twice (listed in _calib/retest.txt).`);
    console.log(`next: node eval/run.mjs score --run ${id} && node eval/run.mjs judge --run ${id} --scale v2, then one fresh Opus judge per page, then validate.`);
  },

  // V1–V3 (and V5 when a person judged too): is scale v2 measuring what the pairs see, and how much does it move between judgements?
  validate() {
    const run = runDir(opt.run);
    const key = JSON.parse(read(path.join(run, '_calib', 'key.json')));
    const meta = JSON.parse(read(path.join(run, 'run.json')));
    const set = calibSet(meta.set);
    const evFile = path.join(CALIB, `${set.set}.evidence.json`);
    const ev = fs.existsSync(evFile) ? JSON.parse(read(evFile)) : { pages: {}, pairs: [] };
    const T = set.targets || {};
    const page = {};
    for (const [d, k] of Object.entries(key)) {
      const dir = path.join(run, d);
      if (!fs.existsSync(dir)) continue;
      const samples = Object.entries(readJudgesV2(dir)).map(([name, j]) => ({ name, model: name.split('.')[0], s: v2Score(j) })).filter((x) => x.s && x.s.total !== null);
      page[k.id] = { dir: d, ...k, samples };
    }
    const prim = (id) => page[id]?.samples.filter((x) => x.model === PRIMARY) || [];
    const score = (id) => mean(prim(id).map((x) => x.s.total));
    const first = (id) => prim(id).sort((a, b) => a.name.localeCompare(b.name))[0]?.s;
    const sd = (xs) => (xs.length > 1 ? Math.sqrt(xs.reduce((a, x) => a + (x - mean(xs)) ** 2, 0) / (xs.length - 1)) : null);
    const corr = (xs, ys) => { const mx = mean(xs), my = mean(ys); const sxy = xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0); const sx = Math.sqrt(xs.reduce((a, x) => a + (x - mx) ** 2, 0)), sy = Math.sqrt(ys.reduce((a, y) => a + (y - my) ** 2, 0)); return sx && sy ? sxy / (sx * sy) : null; };
    const judged = Object.keys(page).filter((id) => score(id) !== null);
    const lines = [`# Validation of scale v2: ${path.basename(run)}`, '', `Set ${set.set}, ${judged.length} of ${Object.keys(key).length} page(s) judged by ${PRIMARY}. Targets were fixed in eval/calib/${set.set}.json before judging.`, ''];
    const out = { run: path.basename(run), set: set.set, judged: judged.length, checks: {} };
    const verdict = (name, ok, text) => { out.checks[name] = { ok, text }; lines.push(`- **${ok === null ? 'n/a' : ok ? 'PASS' : 'FAIL'}** ${text}`); };

    // V1: differences the pairs already established, read per case (several pages of a group in a case are averaged).
    lines.push('## V1 Known differences', '');
    for (const k of set.checks?.known || []) {
      const diffs = [];
      for (const c of [...new Set(judged.map((id) => page[id].case))].sort()) {
        const g = (groups) => mean(judged.filter((id) => page[id].case === c && groups.includes(page[id].group)).map(score));
        const b = g(k.better), w = g(k.worse);
        if (b !== null && w !== null) diffs.push([c, b - w]);
      }
      const ds = diffs.map((x) => x[1]), m = mean(ds), s = sd(ds), dz = m !== null && s ? m / s : null;
      lines.push(`${k.name} (${k.evidence || 'pairs'}): ${diffs.map(([c, x]) => `${c.slice(0, 2)} ${x > 0 ? '+' : ''}${r1(x)}`).join(' · ') || 'no case with both groups judged'}`);
      if (ds.length < 2) { verdict(`V1 ${k.name}`, null, `${k.name}: fewer than two cases`); continue; }
      verdict(`V1 ${k.name}`, m > 0 && dz >= (T.v1_dz_min ?? 0.5), `${k.name}: mean ${m > 0 ? '+' : ''}${r1(m)} over ${ds.length} cases, d_z ${r1(dz, 2)} (target > 0 and d_z ≥ ${T.v1_dz_min ?? 0.5}), ${ds.filter((x) => x > 0).length}/${ds.length} cases positive`);
    }
    for (const k of set.checks?.same || []) {
      const ds = [];
      for (const c of [...new Set(judged.map((id) => page[id].case))]) {
        const [a, b] = k.groups.map((g) => mean(judged.filter((id) => page[id].case === c && page[id].group === g).map(score)));
        if (a !== null && b !== null) ds.push(a - b);
      }
      if (ds.length) lines.push(`${k.name} (same skill, two generations): mean ${r1(mean(ds))}, SD ${r1(sd(ds)) ?? '-'} over ${ds.length} case(s). This SD is the generation noise one page carries.`);
    }
    lines.push('');

    // V2: the same page judged twice by the primary model; the measurement error against the spread between pages.
    lines.push('## V2 Re-judging', '');
    const re = judged.filter((id) => prim(id).length >= 2).map((id) => { const [a, b] = prim(id).sort((x, y) => x.name.localeCompare(y.name)); return { id, a: a.s, b: b.s }; });
    if (re.length >= 3) {
      const diffs = re.map((x) => x.a.total - x.b.total);
      const agree = re.map((x) => { const ids = V2_IDS.filter((i) => x.a.met[i] !== null && x.b.met[i] !== null); return ids.filter((i) => x.a.met[i] === x.b.met[i]).length / (ids.length || 1); });
      const flips = {};
      for (const x of re) for (const i of V2_IDS) if (x.a.met[i] !== null && x.b.met[i] !== null && x.a.met[i] !== x.b.met[i]) flips[i] = (flips[i] || 0) + 1;
      const se = sd(diffs) / Math.SQRT2;
      // Pairs and compare read differences within a case, so the spread that counts is around each case's mean.
      const byC = {};
      for (const id of judged) (byC[page[id].case] ||= []).push(first(id).total);
      const dof = judged.length - Object.keys(byC).length;
      const spread = dof > 0 ? Math.sqrt(Object.values(byC).reduce((a, xs) => a + xs.reduce((b, x) => b + (x - mean(xs)) ** 2, 0), 0) / dof) : null;
      const rel = spread ? 1 - (se * se) / (spread * spread) : null;
      const r = corr(re.map((x) => x.a.total), re.map((x) => x.b.total));
      lines.push(`${re.length} page(s) judged twice: |Δ| mean ${r1(mean(diffs.map(Math.abs)))}, max ${r1(Math.max(...diffs.map(Math.abs)))}; one judgement's SD ${r1(se)}; spread of pages within a case (first judgements, ${judged.length} pages) ${r1(spread)}, across all pages ${r1(sd(judged.map((id) => first(id).total)))}; retest r ${r1(r, 2)}.`,
        `Criteria flipped most: ${Object.entries(flips).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([i, n]) => `${i} ×${n}`).join(' · ') || 'none'}`);
      verdict('V2 agreement', mean(agree) >= (T.v2_agreement_min ?? 0.85), `criteria agree in ${r1(mean(agree) * 100)}% of decisions (target ≥ ${(T.v2_agreement_min ?? 0.85) * 100}%)`);
      verdict('V2 error', se <= (T.v2_sd_max ?? 3.5), `one judgement's SD ${r1(se)} points (target ≤ ${T.v2_sd_max ?? 3.5})`);
      verdict('V2 reliability', rel !== null && rel >= (T.v2_reliability_min ?? 0.6), `reliability within a case, 1 − error²/spread² = ${r1(rel, 2)} (target ≥ ${T.v2_reliability_min ?? 0.6}; v1's retest r was 0.27)`);
      out.retest = { pages: re.length, diffs: diffs.map((x) => r1(x)), sd_one: r1(se), spread: r1(spread), reliability: r1(rel, 2), r: r1(r, 2), flips };
    } else lines.push(`Only ${re.length} page(s) have two ${PRIMARY} judgements; judge the pages in _calib/retest.txt a second time (judge-v2.${PRIMARY}.2.json).`);
    // V5 and cross-model: any other judge on the same pages, criterion by criterion against the primary's first judgement.
    const others = [...new Set(judged.flatMap((id) => page[id].samples.filter((x) => x.model !== PRIMARY).map((x) => x.model)))];
    for (const m of others) {
      const rows = judged.map((id) => [first(id), page[id].samples.find((x) => x.model === m)?.s]).filter(([, b]) => b);
      const ag = mean(rows.map(([a, b]) => { const ids = V2_IDS.filter((i) => a.met[i] !== null && b.met[i] !== null); return ids.filter((i) => a.met[i] === b.met[i]).length / (ids.length || 1); }));
      lines.push(`${m} on ${rows.length} page(s): criteria agree with ${PRIMARY} in ${r1(ag * 100)}%, mean ${m} − ${PRIMARY} ${r1(mean(rows.map(([a, b]) => b.total - a.total)))}${rows.length > 2 ? `, r ${r1(corr(rows.map(([a]) => a.total), rows.map(([, b]) => b.total)), 2)}` : ''}. Models are not averaged; a different model is a different series.`);
    }
    lines.push('');

    // V3: page pairs whose pair verdict was clear (every order, every model that judged it clear on the same side).
    lines.push('## V3 Agreement with clear pair verdicts', '');
    const byPair = {};
    for (const p of ev.pairs) (byPair[`${p.cand}|${p.base}`] ||= []).push(p);
    const rows = [];
    for (const [k, ps] of Object.entries(byPair)) {
      const [cand, base] = k.split('|');
      if (score(cand) === null || score(base) === null) continue;
      const models = {};
      for (const p of ps) (models[p.model] ||= []).push(p.margin === 'slight' ? 'tie' : p.overall);
      const calls = Object.values(models).map((v) => (v.every((x) => x === v[0]) ? v[0] : 'tie')).filter((x) => x !== 'tie');
      if (!calls.length || !calls.every((x) => x === calls[0])) continue;
      const d = score(cand) - score(base);
      const v1 = (id) => ev.pages[id]?.v1?.[PRIMARY]?.judge60 ?? null;
      const d1 = v1(cand) !== null && v1(base) !== null ? v1(cand) - v1(base) : null;
      const call = (x) => (x === null ? null : Math.abs(x) < 0.5 ? 'tie' : (x > 0) === (calls[0] === 'cand') ? 'agree' : 'disagree');
      rows.push({ cand, base, winner: calls[0], d: r1(d), v2: call(d), v1: call(d1), models: Object.keys(models) });
    }
    const rate = (xs) => (xs.length ? (xs.filter((x) => x === 'agree').length + 0.5 * xs.filter((x) => x === 'tie').length) / xs.length : null);
    const cnt = (xs) => `${xs.filter((x) => x === 'agree').length} agree / ${xs.filter((x) => x === 'disagree').length} disagree / ${xs.filter((x) => x === 'tie').length} tie`;
    for (const r of rows) lines.push(`- ${r.winner === 'cand' ? r.cand : r.base} over ${r.winner === 'cand' ? r.base : r.cand} (${r.models.join('+')}): v2 Δ ${r.winner === 'cand' ? r.d : -r.d} → ${r.v2}${r.v1 ? `; v1 ${r.v1}` : ''}`);
    if (rows.length) {
      const v2s = rows.map((r) => r.v2), both = rows.filter((r) => r.v1);
      lines.push('', `v2: ${cnt(v2s)} over ${rows.length} clear page pair(s).` + (both.length ? ` On the ${both.length} pair(s) v1 also scored: v2 ${cnt(both.map((r) => r.v2))}; v1 ${cnt(both.map((r) => r.v1))}.` : ''));
      verdict('V3 agreement', rate(v2s) >= (T.v3_agree_min ?? 0.75) && (!both.length || rate(both.map((r) => r.v2)) >= rate(both.map((r) => r.v1))), `agreement ${r1(rate(v2s) * 100)}% (a tie counts half; target ≥ ${(T.v3_agree_min ?? 0.75) * 100}% and not below v1 on the pairs both scored${both.length ? `: v2 ${r1(rate(both.map((r) => r.v2)) * 100)}% vs v1 ${r1(rate(both.map((r) => r.v1)) * 100)}%` : ''})`);
      out.pairs = rows;
    } else lines.push('No clear pair verdict among the judged pages (judge the extra tier too: --tier all).');
    // Per dimension, over every pair verdict (slight ones too): does the v2 dimension move toward the side the pair judge chose?
    const dimRows = Object.keys(DIMS).map((dm) => {
      let a = 0, n = 0;
      for (const p of ev.pairs) {
        const fc = first(p.cand), fb = first(p.base);
        if (!fc || !fb || p.dims[dm] === 'tie' || fc.dims[dm] === undefined || fb.dims[dm] === undefined || fc.dims[dm] === fb.dims[dm]) continue;
        n++; if ((fc.dims[dm] > fb.dims[dm]) === (p.dims[dm] === 'cand')) a++;
      }
      return [dm, a, n];
    }).filter(([, , n]) => n);
    if (dimRows.length) lines.push('', 'Per dimension, all pair verdicts where both v2 dimensions differ (information, no target):', '', '| dim | agree | of |', '|---|---|---|', ...dimRows.map(([dm, a, n]) => `| ${dm} | ${a} | ${n} |`));
    lines.push('');

    // Drift: the same frozen pages in another calibration run (a new judge model, a new prompt, a later weekend).
    if (opt.against && opt.against !== true) {
      const other = runDir(opt.against);
      const okey = JSON.parse(read(path.join(other, '_calib', 'key.json')));
      const oscore = {};
      for (const [d, k] of Object.entries(okey)) { if (!fs.existsSync(path.join(other, d))) continue; const ss = Object.entries(readJudgesV2(path.join(other, d))).filter(([n]) => n.split('.')[0] === PRIMARY).map(([, j]) => v2Score(j)).filter((x) => x && x.total !== null); if (ss.length) oscore[k.id] = mean(ss.map((x) => x.total)); }
      const common = judged.filter((id) => oscore[id] !== undefined);
      const ds = common.map((id) => score(id) - oscore[id]);
      lines.push('## Drift', '', common.length ? `${common.length} page(s) also in ${path.basename(other)}: mean Δ (this − that) ${r1(mean(ds))}, SD ${r1(sd(ds)) ?? '-'}. A shift beyond the V2 error (${out.retest?.sd_one ?? '?'} per judgement) means the judge moved: start a new v2 series (eval/rubric.md).` : `no page in common with ${path.basename(other)}`, '');
      out.drift = { against: path.basename(other), pages: common.length, mean: r1(mean(ds)), sd: r1(sd(ds)) };
    }
    const fails = Object.entries(out.checks).filter(([, c]) => c.ok === false).map(([n]) => n);
    // PASS needs every check of the set decided: V1 for each known difference judged, V2 (three of them) and V3.
    const decided = Object.values(out.checks).filter((c) => c.ok !== null).length;
    const needed = ['V2 agreement', 'V2 error', 'V2 reliability', 'V3 agreement'].every((n) => out.checks[n]);
    out.result = fails.length ? 'FAIL' : decided && needed ? 'PASS' : 'incomplete';
    lines.push(`**Result: ${out.result === 'FAIL' ? 'FAIL (' + fails.join(', ') + ')' : out.result === 'PASS' ? 'PASS' : 'incomplete (judge the retest pages twice and the pages that carry clear pair verdicts)'}**`, '', 'On PASS, v2 tracks the level (eval/rubric.md). On FAIL, revise judge-prompt-v2.md once for the failing part, then validate on pages it was not revised on (loop/plan.md).');
    fs.writeFileSync(path.join(run, 'validate.md'), lines.join('\n') + '\n');
    writeJSON(path.join(run, 'validate.json'), out);
    console.log(lines.join('\n'));
  },

  // V4 (M-020): live reference pages as a run. Each entry has a url and a brief written from the page before judging.
  ref() {
    const listFile = opt.list && opt.list !== true ? path.resolve(opt.list) : path.join(ROOT, 'eval/reference/refs.json');
    const refs = JSON.parse(read(listFile)).refs.filter((r) => !opt.only || opt.only === true || String(opt.only).split(',').includes(r.id));
    const bad = refs.filter((r) => !/^https?:\/\//.test(r.url || '') || !r.brief || !r.surface || !r.language);
    if (bad.length) die(`each reference needs url, surface, language and a brief written before judging: ${bad.map((r) => r.id).join(', ')}`);
    const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '').replace(/^(\d{8})(\d{4})$/, '$1-$2');
    const id = `${stamp}-ref${opt.label && opt.label !== true ? '-' + opt.label : ''}`;
    const run = path.join(RUNS, id);
    for (const r of refs) {
      const dir = path.join(run, r.id);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'CASE.md'), ['---', `id: ${r.id}`, `url: ${r.url}`, `surface: ${r.surface}`, `language: ${r.language}`, `like: ${r.like || ''}`, 'split: ref', '---', r.brief, ''].join('\n'));
    }
    writeJSON(path.join(run, 'run.json'), { id, kind: 'ref', version: version(), commit: gitRev(), created: new Date().toISOString(), list: path.relative(ROOT, listFile), cases: refs.map((r) => r.id) });
    console.log(`prepared ${path.relative(ROOT, run)} with ${refs.length} reference page(s). next: score --run ${id} (renders the live pages; needs network), judge --run ${id} --scale v2, then ref-compare.`);
  },

  // Reference pages against our pages on the dimensions both can be judged on (D2–D7, D9). A gap is read, not converted.
  'ref-compare'() {
    const ref = JSON.parse(read(path.join(runDir(opt.ref), 'summary.json')));
    const bases = String(opt.base || '').split(',').filter(Boolean).map((b) => JSON.parse(read(path.join(runDir(b), 'summary.json'))));
    if (!bases.length) die('ref-compare needs --base <dir>[,<dir>…]');
    const subs = (rows) => rows.filter((r) => !r.missing && r.v2 && r.v2.sub !== null);
    const R = subs(ref.cases), B = bases.flatMap((b) => subs(b.cases));
    const stat = (xs) => { const m = mean(xs); const s = xs.length > 1 ? Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1)) : null; return { m, se: s !== null ? s / Math.sqrt(xs.length) : null, n: xs.length }; };
    const fmt = (s) => `${r1(s.m)}${s.se !== null ? ` ± ${r1(s.se)}` : ''} (${s.n})`;
    const rs = stat(R.map((r) => r.v2.sub)), bs = stat(B.map((r) => r.v2.sub));
    const lines = [`# Reference pages vs ${bases.map((b) => b.run).join(' + ')}`, '', 'Subtotal over D2–D7 and D9 (0–100, mean ± SE, pages). Reference pages are judged on these only.', '',
      `Reference: ${fmt(rs)} · ours: ${fmt(bs)} · gap ${rs.m !== null && bs.m !== null ? r1(rs.m - bs.m) : '-'}`, '', '| page | sub | like |', '|---|---|---|',
      ...R.map((r) => `| ${r.case} | ${r.v2.sub} | ${(caseMeta(path.join(runDir(opt.ref), r.case), r.case) || {}).like || ''} |`), '', '| dim | reference | ours |', '|---|---|---|'];
    for (const d of V2_SUB) lines.push(`| ${d} | ${r1(mean(R.map((r) => r.v2.dims?.[d]).filter((v) => v !== undefined)), 2)} | ${r1(mean(B.map((r) => r.v2.dims?.[d]).filter((v) => v !== undefined)), 2)} |`);
    lines.push('', 'Read with eval/reference/README.md: if the references do not score above our pages, the subtotal does not credit professional work and the 95 reading is void until the criteria are revised.');
    fs.writeFileSync(path.join(runDir(opt.ref), 'ref-compare.md'), lines.join('\n') + '\n');
    console.log(lines.join('\n'));
  },

  // V5: a blank v2 judge file for a person; save it as judge-v2.human.json in the case folder and run `score`.
  'v2-template'() {
    console.log(JSON.stringify({ scale: 'v2', judge_model: 'human', criteria: Object.fromEntries(V2_IDS.map((id) => [id, { met: null, evidence: '' }])), defects: [], top_issues: [], panel: {}, verdict: '' }, null, 2));
  },

  feedback() {
    const run = runDir(opt.run);
    const ids = {}, dims = {}, issues = [], crit = {};
    for (const d of caseDirs(run)) {
      const f = path.join(run, d, 'score.json');
      if (!fs.existsSync(f)) continue;
      const s = JSON.parse(read(f));
      for (const [id, n] of Object.entries(s.tools?.ids || {})) ids[id] = (ids[id] || 0) + n;
      for (const [dim, v] of Object.entries(s.dims || {})) if (v !== 'n/a') (dims[dim] ||= []).push(Number(v));
      for (const [id, v] of Object.entries(s.v2?.met || {})) if (v !== null) (crit[id] ||= []).push(v);
      for (const i of s.top_issues || []) issues.push({ case: d, ...i });
    }
    const critRows = Object.entries(crit).map(([id, v]) => [id, +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(2), v.length]).sort((a, b) => a[1] - b[1]);
    const dimRows = Object.entries(dims).map(([d, v]) => [d, +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(2)]).sort((a, b) => a[1] - b[1]);
    const idRows = Object.entries(ids).sort((a, b) => b[1] - a[1]);
    const md = [
      `# Feedback for ${path.basename(run)}`, '',
      'Input for one iteration of loop/IMPROVEMENT.md. Pick ONE hypothesis from here.', '',
      '## Most frequent findings', '', '| id | count |', '|---|---|', ...idRows.map(([id, n]) => `| ${id} | ${n} |`), '',
      '## Weakest dimensions (mean 0–4)', '', '| dim | mean |', '|---|---|', ...dimRows.map(([d, v]) => `| ${d} | ${v} |`), '',
      ...(critRows.length ? ['## Scale v2: criteria met least often (share of pages)', '', '| criterion | met | pages |', '|---|---|---|', ...critRows.slice(0, 12).map(([id, v, n]) => `| ${id} | ${v} | ${n} |`), ''] : []),
      '## Judge issues with rule suggestions', '',
      ...(issues.length ? issues.map((i) => `- [${i.case}${i.judge ? ' · ' + i.judge : ''}] (${i.dimension || '?'}) ${i.issue}${i.rule_suggestion ? `\n  - suggestion: ${i.rule_suggestion}` : ''}`) : ['(no judge.json found)']), '',
      '## Diversity across cases', '', ...(summaryDiversity(run)), '',
      '## Human feedback', '', 'See loop/feedback.md entries with status `open`.', '',
    ].join('\n');
    fs.writeFileSync(path.join(run, 'feedback.md'), md);
    console.log(md);
  },
};

// Scale v2 never accepts or rejects a skill change by itself: pairs decide (eval/rubric.md, 手順). This reports the level,
// the dimensions, and the criteria that moved, and holds the decision when v2 falls clearly (two standard errors).
function compareV2(bases, cand) {
  const pick = (r) => (r && r.v2 && r.v2.total !== null ? r.v2 : null);
  const byCase = {};
  for (const b of bases) for (const r of b.cases) if (!r.missing && pick(r)) (byCase[r.case] ||= []).push(r);
  const rows = cand.cases.filter((r) => !r.missing && pick(r) && byCase[r.case]);
  const lines = [`# Compare ${cand.run} vs base ${bases.map((b) => b.run).join(' + ')} (scale v2)`, '', 'v2 is a separate series from v1. Pairs decide acceptance (eval/rubric.md); this table reports the level and what moved.', '', '| case | base v2 | cand v2 | Δ | gate |', '|---|---|---|---|---|'];
  const reasons = [], diffs = [];
  for (const r of rows) {
    const bs = byCase[r.case];
    const bv = mean(bs.map((x) => x.v2.total));
    const d = r.v2.total - bv;
    diffs.push(d);
    const bg = bs.some((x) => x.gate === 'fail') ? 'fail' : 'pass';
    lines.push(`| ${r.case} | ${r1(bv)}${bs.length > 1 ? ` (${bs.length} runs)` : ''} | ${r.v2.total} | ${d > 0 ? '+' : ''}${r1(d)} | ${bg}→${r.gate} |`);
    if (r.gate === 'fail' && bg === 'pass') reasons.push(`${r.case}: new Floor failure`);
  }
  if (!rows.length) die('no case has v2 judgements in both runs; judge with --scale v2 and run score first');
  // M-022: a v2 difference means something only within one series (same judge model, same prompt, same capture).
  // The model is the judge file's name (judge-v2.opus.json); the model id a judge reports about itself is only recorded.
  const series = (ss) => JSON.stringify([...new Set(ss.flatMap((x) => [x.v2?.primary, ...(x.v2?.prompts || [])]).filter(Boolean))].sort());
  if (series(bases) !== series([cand])) lines.splice(4, 0, `**warning**: base and candidate were judged with a different primary model or prompt (${series(bases)} vs ${series([cand])}); judge both the same way before reading Δ.`, '');
  const md = mean(diffs);
  const sd = diffs.length > 1 ? Math.sqrt(diffs.reduce((a, x) => a + (x - md) ** 2, 0) / (diffs.length - 1)) : null;
  const se = sd !== null ? sd / Math.sqrt(diffs.length) : null;
  lines.push('', `Mean Δ over ${rows.length} case(s): ${md > 0 ? '+' : ''}${r1(md)}` + (se !== null ? ` (SE ${r1(se)} from the spread of the per-case Δ)` : ''));
  const dimOf = (rs, d) => mean(rs.map((x) => x.v2.dims?.[d]).filter((v) => v !== undefined && v !== null));
  lines.push('', '| dim | base | cand | Δ |', '|---|---|---|---|');
  for (const d of Object.keys(DIMS)) {
    const b = mean(rows.map((r) => dimOf(byCase[r.case], d)).filter((v) => v !== null)), c = dimOf(rows, d);
    if (b === null || c === null) continue;
    lines.push(`| ${d} | ${r1(b, 2)} | ${r1(c, 2)} | ${c - b > 0 ? '+' : ''}${r1(c - b, 2)} |`);
  }
  const metOf = (rs, id) => mean(rs.map((x) => x.v2.met?.[id]).filter((v) => v !== null && v !== undefined));
  const moved = V2_IDS.map((id) => [id, metOf(rows, id), mean(rows.map((r) => metOf(byCase[r.case], id)).filter((v) => v !== null))])
    .filter(([, c, b]) => c !== null && b !== null && Math.abs(c - b) >= 0.25).sort((x, y) => Math.abs(y[1] - y[2]) - Math.abs(x[1] - x[2]));
  if (moved.length) lines.push('', 'Criteria whose met rate moved by a quarter or more (base → cand):', ...moved.slice(0, 12).map(([id, c, b]) => `- ${id}: ${r1(b, 2)} → ${r1(c, 2)}`));
  let verdict = reasons.length ? 'REJECT' : 'PAIRS';
  if (!reasons.length && se !== null && rows.length >= 3 && md < -2 * se) { verdict = 'HOLD'; reasons.push(`v2 fell ${r1(md)} (more than two standard errors): read the reasons before the pair verdict is applied (eval/rubric.md 手順 f)`); }
  lines.push('', `**Verdict: ${verdict}**${verdict === 'PAIRS' ? ' (decide by pair-score and eval/rubric.md)' : ''}`, ...reasons.map((r) => `- ${r}`));
  const out = lines.join('\n') + '\n';
  fs.writeFileSync(path.join(runDir(opt.run), 'compare-v2.md'), out);
  console.log(out);
  process.exit(verdict === 'REJECT' ? 3 : 0);
}

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

// The run's v2 level: the primary model's mean over the cases it judged, the dimensions, and the criteria failed most often.
function v2RunSummary(rows) {
  const v = rows.filter((r) => r.v2 && r.v2.total !== null);
  if (!v.length) return null;
  const count = {};
  for (const r of v) count[r.v2.primary] = (count[r.v2.primary] || 0) + 1;
  const primary = Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
  const models = {};
  for (const r of v) for (const [m, x] of Object.entries(r.v2.models || {})) if (x.total !== null) (models[m] ||= []).push(x.total);
  const met = Object.fromEntries(V2_IDS.map((id) => [id, r1(mean(v.map((r) => r.v2.met?.[id]).filter((x) => x !== null && x !== undefined)), 2)]).filter(([, x]) => x !== null));
  return {
    scale: 'v2', primary, cases: v.length, missing: rows.filter((r) => !r.v2).map((r) => r.case),
    mean_total: r1(mean(v.map((r) => r.v2.total))), mean_sub: r1(mean(v.map((r) => r.v2.sub).filter((x) => x !== null))),
    dims: meanDims(v.map((r) => ({ scores: r.v2.dims }))),
    models: Object.fromEntries(Object.entries(models).map(([m, xs]) => [m, { cases: xs.length, mean_total: r1(mean(xs)) }])),
    failed_most: Object.entries(met).sort((a, b) => a[1] - b[1]).slice(0, 8).map(([id, x]) => ({ id, met: x })),
    // Pages at the loop's goal, v2 92 (the old 95, judge 55/60; M-023), and at 95 (eval/rubric.md, 尺度 v2).
    at_92: v.filter((r) => r.v2.total >= 92).length,
    at_95: v.filter((r) => r.v2.total >= 95).length,
    prompts: [...new Set(v.map((r) => r.v2.prompt).filter(Boolean))],
    judge_models: [...new Set(v.flatMap((r) => Object.values(r.v2.models || {}).flatMap((x) => x.judge_models || [])))],
  };
}

// A rough reading of a v2 number on the old scale, for comparing with the old goal of 95 only (M-023):
// it assumes the old automatic 40 points were full and the judge share equals v2. Never used for decisions.
function oldScale(v2) { return v2 === null || v2 === undefined ? '-' : `≈${r1(40 + 0.6 * v2)}`; }

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
  // Scale v2 is a separate series (M-017): its numbers are never added to, averaged with, or compared against v1.
  if (s.v2) {
    lines.push('', `## Scale v2 (${s.v2.primary}; a separate series, not comparable with the v1 total)`, '',
      `Mean v2 ${s.v2.mean_total} / 100 over ${s.v2.cases} case(s) (old-scale estimate ${oldScale(s.v2.mean_total)}) · D2–D7+D9 subtotal ${s.v2.mean_sub ?? '-'} · pages at the goal, 92 or more: ${s.v2.at_92 ?? '-'}/${s.v2.cases} · at 95 or more: ${s.v2.at_95}/${s.v2.cases}` + (s.v2.missing.length ? ` · not judged on v2: ${s.v2.missing.join(', ')}` : ''),
      ...(s.v2.prompts.length > 1 ? [`warning: pages were judged with ${s.v2.prompts.length} different versions of judge-prompt-v2.md (${s.v2.prompts.join(', ')}); they are not one series`] : []),
      ...(Object.keys(s.v2.models).length > 1 ? [`By model: ${Object.entries(s.v2.models).map(([m, x]) => `${m} ${x.mean_total} (${x.cases})`).join(' · ')}`] : []),
      '', '| case | v2 | sub | samples | spread | vetoes |', '|---|---|---|---|---|---|');
    for (const r of s.cases.filter((r) => r.v2)) lines.push(`| ${r.case} | ${r.v2.total} | ${r.v2.sub ?? '-'} | ${r.v2.samples} | ${r.v2.spread ?? '-'} | ${r.v2.vetoes.join(' ') || '-'} |`);
    lines.push('', `Dims (count of met criteria, 0–4): ${Object.entries(s.v2.dims || {}).map(([d, v]) => `${d} ${v}`).join(' · ')}`,
      `Most often failed: ${s.v2.failed_most.map((x) => `${x.id} ${x.met}`).join(' · ')}`);
  }
  return lines.join('\n') + '\n';
}

if (!commands[cmd]) {
  const head = read(fileURLToPath(import.meta.url)).split('\n').slice(1);
  console.log(head.slice(0, head.findIndex((l) => !l.startsWith('//'))).join('\n').replace(/^\/\/ ?/gm, ''));
  process.exit(cmd ? 1 : 0);
}
commands[cmd]();
