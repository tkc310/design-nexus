#!/usr/bin/env node
// Regression test for the checks: expected IDs must appear on the bad fixture and none on the good one.
import { spawnSync } from 'node:child_process';
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

const S2 = path.join(ROOT, 'eval/fixtures');
const unloaded = run('lint.mjs', path.join(S2, 'unloaded-font.css'));
check('lint flags R16 for a font that is never loaded', unloaded.out.findings.some((f) => f.id === 'R16' && /fraunces/i.test(f.message)));
check('lint does not flag system fonts as unloaded', !unloaded.out.findings.some((f) => f.id === 'R16' && /Hiragino/i.test(f.message)));
const keptAgg = run('lint.mjs', path.join(S2, 'kept-aggregate.css'));
check('a keep comment suppresses an aggregate R08', keptAgg.out.findings.filter((f) => f.id === 'R08').every((f) => f.kept));

const tokens = run('tokens-check.mjs', path.join(ROOT, 'skills/design-nexus/templates/DESIGN.md'));
check('DESIGN.md template passes tokens-check', tokens.code === 0, JSON.stringify(tokens.out.findings));

const lowContrast = run('tokens-check.mjs', path.join(ROOT, 'eval/fixtures/low-contrast.DESIGN.md'));
check('tokens-check flags low contrast', lowContrast.out.findings.some((f) => f.id === 'F01'));

const google = run('tokens-check.mjs', path.join(ROOT, 'eval/fixtures/google-spec.DESIGN.md'));
check('tokens-check reads Google DESIGN.md front matter', google.out.findings.some((f) => f.id === 'F01' && /caption/.test(f.where)), JSON.stringify(google.out.findings));
check('tokens-check passes the Google-format primary button', !google.out.findings.some((f) => /button-primary/.test(f.where || '')));

// Render checks run only where Playwright is available.
const probe = run('render-check.mjs', path.join(S2, 'ja-tight.html'), '--out', path.join(ROOT, '.design-nexus/test-shots'), '--widths', '1280');
if (probe.out.skipped) console.log('skip render tests (no Playwright)');
else {
  check('render flags R14 on tight multi-line Japanese text', probe.out.findings.some((f) => f.id === 'R14'));
  check('render does not flag R14 on a single-line numeral', !probe.out.findings.some((f) => f.id === 'R14' && /14:22/.test(f.message)));
  check('render does not flag R14 on a multi-line heading', !probe.out.findings.some((f) => f.id === 'R14' && /見出し/.test(f.message)));
  const lb = run('render-check.mjs', path.join(S2, 'layout-breaks.html'), '--out', path.join(ROOT, '.design-nexus/test-shots'), '--widths', '1280');
  check('render flags R17 when a table escapes its panel', lb.out.findings.some((f) => f.id === 'R17' && /escapes/.test(f.message)));
  check('render flags R17 when a figure wraps mid-number', lb.out.findings.some((f) => f.id === 'R17' && /wraps/.test(f.message)));
  check('render ignores visually-hidden text', !lb.out.findings.some((f) => f.id === 'R17' && /clips/.test(f.message)));
}

console.log(failed ? `\n${failed} failed` : '\nall passed');
process.exit(failed ? 1 : 0);
