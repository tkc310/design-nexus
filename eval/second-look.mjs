// usage: node eval/second-look.mjs <runDir>
// After generation: keep a copy of each index.html in _before/, and write SECOND_PROMPT.md per case. Give each SECOND_PROMPT.md to a fresh-context agent (the generator in an eval cannot start subagents).
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
const run = path.resolve(process.argv[2]);
const start = {};
fs.mkdirSync(path.join(run, '_before'), { recursive: true });
for (const c of fs.readdirSync(run).filter((d) => /^\d\d-/.test(d))) {
  const dir = path.join(run, c);
  const html = fs.readFileSync(path.join(dir, 'index.html'));
  fs.writeFileSync(path.join(run, '_before', c + '.html'), html);
  start[c] = crypto.createHash('sha1').update(html).digest('hex');
  const s = fs.readFileSync(path.join(dir, 'PROMPT.md'), 'utf8');
  const skill = s.match(/read `([^`]+)\/SKILL\.md`/)[1];
  const budget = s.match(/\((budget: [^)]+)\)/)[1];
  const tools = s.split('\n').find((l) => l.startsWith('Run the skill\'s lint and render check'));
  const brief = s.slice(s.indexOf('## Brief'));
  if (!skill || !budget || !tools || !brief.startsWith('## Brief')) throw new Error('prompt shape: ' + c);
  const out = [
    `Your whole task is \`${skill}/references/second-look.md\`: read it and carry it out on this folder (${dir}), where \`index.html\`, \`DESIGN.md\` and \`NOTES.md\` already are (${budget}). The skill it refers to is in \`${skill}\`, with its references, scripts, and templates.`,
    `Work only inside this folder. Do not look at other case folders or earlier runs.`,
    `Nobody will answer questions: state your assumptions and proceed.`,
    tools,
    '',
    brief,
  ].join('\n');
  fs.writeFileSync(path.join(dir, 'SECOND_PROMPT.md'), out);
}
fs.writeFileSync(path.join(run, '_start.json'), JSON.stringify({ start }, null, 1));
console.log('second look prepared', run);
