#!/usr/bin/env node
// Regression test for the checks: expected IDs must appear on the bad fixture and none on the good one.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const S = path.join(ROOT, 'skills/design-nexus/scripts');
const run = (script, ...args) => {
  const r = spawnSync(process.execPath, [path.join(S, script), ...args, '--json'], { encoding: 'utf8' });
  return { code: r.status, out: JSON.parse(r.stdout) };
};
let failed = 0;
const check = (name, ok, detail = '') => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${ok ? '' : ' ' + detail}`); if (!ok) failed++; };

const bad = run('lint.mjs', path.join(ROOT, 'eval/fixtures/slop.html'));
const badIds = new Set(bad.out.findings.map((f) => f.id));
for (const id of ['F02', 'F03', 'F04', 'F05', 'F06', 'F07', 'F10', 'F12', 'R01', 'R02', 'R03', 'R05', 'R07', 'R09', 'R10', 'R11', 'R12', 'N04', 'N05']) {
  check(`lint flags ${id} on slop.html`, badIds.has(id));
}
check('lint exits 2 on floor findings', bad.code === 2, `got ${bad.code}`);

const good = run('lint.mjs', path.join(ROOT, 'eval/fixtures/good.html'));
check('lint is clean on good.html', good.out.findings.length === 0, JSON.stringify(good.out.findings.map((f) => f.id)));
check('lint exits 0 on good.html', good.code === 0);

const tokens = run('tokens-check.mjs', path.join(ROOT, 'skills/design-nexus/templates/DESIGN.md'));
check('DESIGN.md template passes tokens-check', tokens.code === 0, JSON.stringify(tokens.out.findings));

const lowContrast = run('tokens-check.mjs', path.join(ROOT, 'eval/fixtures/low-contrast.DESIGN.md'));
check('tokens-check flags low contrast', lowContrast.out.findings.some((f) => f.id === 'F01'));

const build = spawnSync(process.execPath, [path.join(ROOT, 'scripts/build.mjs')], { encoding: 'utf8' });
check('build.mjs exits 0', build.status === 0, build.stderr || build.stdout);
for (const rel of [
  'dist/claude/design-nexus/design-trends/latest.md',
  'dist/claude/design-nexus/design-trends/trends/T01-anti-ai-slop.md',
  'dist/codex/.agents/skills/design-nexus/design-trends/latest.md',
  'dist/cursor/.cursor/design-nexus/design-trends/latest.md',
]) {
  check(`build copies ${rel}`, fs.existsSync(path.join(ROOT, rel)));
}
const mdc = fs.readFileSync(path.join(ROOT, 'dist/cursor/.cursor/rules/design-nexus.mdc'), 'utf8');
check('cursor rule points at the installed trends db', mdc.includes('.cursor/design-nexus/design-trends/'));
check('cursor rule still prefers the repo source tree', mdc.includes('docs/design-trends/latest.md'));
check('cursor rule does not inline a trend item', !mdc.includes('アンチ AI スロップ'));
const agents = fs.readFileSync(path.join(ROOT, 'dist/codex/AGENTS.md'), 'utf8');
check('codex AGENTS.md does not load the trend db', !agents.includes('design-trends'));

console.log(failed ? `\n${failed} failed` : '\nall passed');
process.exit(failed ? 1 : 0);
