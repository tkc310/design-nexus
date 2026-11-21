// M-067: try a steer command on pages that already exist.
//   node eval/steer.mjs <sourceRun> --label <name> --command <word> --skill <skillDir> [--task "<what to do; SKILL stands for the skill folder>"] [--ask "<the owner's sentence>"] [--cases 01,02]
// Writes two runs: <stamp>-v<version>-<name> (each case folder holds the source page and a STEER_PROMPT.md for a
// fresh-context agent) and <stamp>-v<version>-<name>0 (the same pages, untouched: the "before" side, to be scored and
// rendered in today's environment). Then: run the agents, `score` both runs, `pair --base <name>0 --run <name>`.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const src = path.resolve(args[0]);
const get = (k) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : null; };
const label = get('label'), command = get('command'), skillSrc = get('skill') && path.resolve(get('skill')), ask = get('ask'), task = get('task'), only = get('cases')?.split(',');
if (!fs.existsSync(src) || !label || !command || !skillSrc) { console.error('usage: node eval/steer.mjs <sourceRun> --label <name> --command <word> --skill <skillDir> [--task "<what to do; SKILL stands for the skill folder>"] [--ask "..."] [--cases 01,02]'); process.exit(1); }
const version = fs.readFileSync(path.join(skillSrc, '../../VERSION'), 'utf8').trim();
const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '').replace(/^(\d{8})(\d{4})$/, '$1-$2');
const KEEP = /^(index\.html|DESIGN\.md|NOTES\.md|SOURCE\.html|[^/]+\.(png|jpg|jpeg|svg|webp))$/;
const cases = fs.readdirSync(src).filter((d) => /^\d\d-/.test(d) && (!only || only.some((p) => d.startsWith(p))));
for (const suffix of ['', '0']) {
  const id = `${stamp}-v${version}-${label}${suffix}`;
  const run = path.join(ROOT, 'eval/runs', id);
  fs.mkdirSync(run, { recursive: true });
  const skill = path.join(run, '_skill/design-nexus');
  if (!suffix) fs.cpSync(skillSrc, skill, { recursive: true });
  for (const c of cases) {
    const dir = path.join(run, c);
    fs.mkdirSync(dir, { recursive: true });
    for (const f of fs.readdirSync(path.join(src, c))) if (KEEP.test(f)) fs.copyFileSync(path.join(src, c, f), path.join(dir, f));
    if (suffix) continue;
    const s = fs.readFileSync(path.join(src, c, 'PROMPT.md'), 'utf8');
    const old = s.match(/read `([^`]+)\/SKILL\.md`/)[1];
    const tools = s.split('\n').find((l) => l.startsWith('Run the skill\'s lint and render check')).split(old).join(skill);
    const brief = s.slice(s.indexOf('## Brief'));
    fs.writeFileSync(path.join(dir, 'STEER_PROMPT.md'), [
      ...(task ? [`The page in this folder (${dir}) is finished: \`index.html\`, with its \`DESIGN.md\` and \`NOTES.md\`. The design-nexus skill is in \`${skill}\`. ${task.split('SKILL').join(skill)}`] : [
      `The page in this folder (${dir}) is finished: \`index.html\`, with its \`DESIGN.md\` and \`NOTES.md\`. Its owner now asks for one adjustment, the design-nexus steer command \`${command}\`${ask ? `, in these words: "${ask}"` : ''}.`,
      `Use the design-nexus skill in \`${skill}\`: read \`${skill}/SKILL.md\` for how a steer runs, then \`${skill}/references/steer.md\` and whatever its \`${command}\` row points to, and carry out that one command on \`index.html\`. Do nothing else to the page.`]),
      `Work only inside this folder. Do not look at other case folders or earlier runs.`,
      `Nobody will answer questions: state your assumptions and proceed.`,
      tools,
      '',
      brief,
    ].join('\n'));
  }
  fs.writeFileSync(path.join(run, 'run.json'), JSON.stringify({ id, version, steer: suffix ? null : command, source: path.relative(ROOT, src), skill: path.relative(ROOT, skillSrc), created: new Date().toISOString(), cases }, null, 1));
  console.log('prepared', path.relative(ROOT, run));
}
