#!/usr/bin/env node
// Regression test for the checks: expected IDs must appear on the bad fixture and none on the good one.
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

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
const r16 = unloaded.out.findings.filter((f) => f.id === 'R16');
check('R16 ignores non-family custom properties and reads legacy Google Fonts URLs', r16.length === 1, JSON.stringify(r16.map((f) => f.message)));
const drift = run('lint.mjs', path.join(S2, 'token-drift.css'), '--design', path.join(S2, 'token-drift.DESIGN.md'));
const n09 = drift.out.findings.filter((f) => f.id === 'N09');
check('lint flags N09 when DESIGN.md and the CSS disagree on a color', n09.length === 1 && /color\.border\b/.test(n09[0].message), JSON.stringify(n09));
const lone = run('lint.mjs', path.join(S2, 'token-drift-component.css'), '--design', path.join(S2, 'token-drift.DESIGN.md'));
check('lint skips N09 when the scan does not include the theme', !lone.out.findings.some((f) => f.id === 'N09'));
const hexText = run('lint.mjs', path.join(S2, 'hex-in-text.html'), '--design', path.join(S2, 'hex-in-text.DESIGN.md'));
check('lint ignores #-numbers in body text when counting colors (R08)', !hexText.out.findings.some((f) => f.id === 'R08'), JSON.stringify(hexText.out.findings.filter((f) => f.id === 'R08')));
const meta = run('lint.mjs', path.join(S2, 'meta-copy.html'));
const r19 = meta.out.findings.filter((f) => f.id === 'R19').map((f) => f.message);
check('lint flags R19 for notes to the reviewer in visible copy and alt text', ['Sample data', 'Placeholder photo', '表示見本', '実際の画面ではありません'].every((w) => r19.some((m) => m.includes(w))), JSON.stringify(r19));
check('R19 ignores comments, scripts, styles, and placeholder attributes', !r19.some((m) => /TODO|Search stops/.test(m)), JSON.stringify(r19));
const keptAgg = run('lint.mjs', path.join(S2, 'kept-aggregate.css'));
check('a keep comment suppresses an aggregate R08', keptAgg.out.findings.filter((f) => f.id === 'R08').every((f) => f.kept));

const tokens = run('tokens-check.mjs', path.join(ROOT, 'skills/design-nexus/templates/DESIGN.md'));
check('DESIGN.md template passes tokens-check', tokens.code === 0, JSON.stringify(tokens.out.findings));

const lowContrast = run('tokens-check.mjs', path.join(ROOT, 'eval/fixtures/low-contrast.DESIGN.md'));
check('tokens-check flags low contrast', lowContrast.out.findings.some((f) => f.id === 'F01'));

const google = run('tokens-check.mjs', path.join(ROOT, 'eval/fixtures/google-spec.DESIGN.md'));
check('tokens-check reads Google DESIGN.md front matter', google.out.findings.some((f) => f.id === 'F01' && /caption/.test(f.where)), JSON.stringify(google.out.findings));
check('tokens-check passes the Google-format primary button', !google.out.findings.some((f) => /button-primary/.test(f.where || '')));

// Redesign field matching: improvements still match, removals do not.
const { unmatchedFields } = await import(pathToFileURL(path.join(S, 'lib.mjs')).href);
const beforeFields = ['input[text]  | Email', 'input[text] fullname | Full name', 'input[text] company | Company', 'select[select-one] size'];
check('F11 accepts a field that gained a name and an email type', unmatchedFields(['input[text] '], ['input[email] email | Work email']).length === 0);
check('F11 accepts a renamed field with the same label', unmatchedFields(['input[text] fullname | Full name'], ['input[text] name | Full name']).length === 0);
check('F11 flags a dropped field', JSON.stringify(unmatchedFields(beforeFields, ['input[email] email | Work email', 'input[text] name | Full name', 'select[select-one] size'])) === JSON.stringify(['input[text] company | Company']));
check('F11 flags a field that lost its name', unmatchedFields(['input[text] company'], ['input[text] ']).length === 1);
check('F11 does not pair a text field with a checkbox', unmatchedFields(['input[text] '], ['input[checkbox] agree']).length === 1);

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
  check('render flags R17 when text is cut off by overflow: hidden', lb.out.findings.some((f) => f.id === 'R17' && /clips its text/.test(f.message)));
  check('render ignores visually-hidden text', !lb.out.findings.some((f) => f.id === 'R17' && /visually hidden/.test(f.message)));
  const ok = run('render-check.mjs', path.join(S2, 'layout-ok.html'), '--out', path.join(ROOT, '.design-nexus/test-shots'), '--widths', '1280');
  check('R17 ignores scroll containers, dropdowns, and decoration clipped by a hero', !ok.out.findings.some((f) => f.id === 'R17'), JSON.stringify(ok.out.findings.filter((f) => f.id === 'R17').map((f) => f.message)));
  const hn = run('render-check.mjs', path.join(S2, 'hidden-narrow.html'), '--out', path.join(ROOT, '.design-nexus/test-shots'), '--widths', '320,1280');
  const r18 = hn.out.findings.filter((f) => f.id === 'R18');
  check('render flags R18 when a paragraph is display:none at 320px', r18.length === 1 && /Classes run twice/.test(r18[0].message), JSON.stringify(r18));
  check('R18 ignores a collapsed nav and text swapped for a narrow copy', r18.every((f) => !/Workshops|Saturday/.test(f.message)));
  const hk = run('render-check.mjs', path.join(S2, 'hidden-narrow-kept.html'), '--out', path.join(ROOT, '.design-nexus/test-shots'), '--widths', '320,1280');
  check('render honors a keep comment for R18', hk.out.findings.some((f) => f.id === 'R18' && f.kept) && hk.out.counts.kept >= 1, JSON.stringify(hk.out.findings.filter((f) => f.id === 'R18')));
  const sc = run('render-check.mjs', path.join(S2, 'state-contrast.html'), '--out', path.join(ROOT, '.design-nexus/test-shots'), '--widths', '1280');
  const scF = sc.out.findings.filter((f) => f.id === 'F01');
  check('render flags F01 when a link loses contrast on hover', scF.some((f) => /hover/.test(f.where) && /Book a fitting/.test(f.message)), JSON.stringify(scF));
  check('render flags F01 when a button loses contrast on focus', scF.some((f) => /focus/.test(f.where) && /Reserve a slot/.test(f.message)), JSON.stringify(scF));
  check('state contrast ignores states that keep contrast, including color-mix() and oklch() backgrounds', !scF.some((f) => /care guide|Join the list|Send the request|Open the map/.test(f.message)), JSON.stringify(scF));
  const clock = run('render-check.mjs', path.join(S2, 'live-clock.html'), '--out', path.join(ROOT, '.design-nexus/test-shots'), '--widths', '320,1280');
  check('R18 ignores a live clock whose digits changed between captures', !clock.out.findings.some((f) => f.id === 'R18'), JSON.stringify(clock.out.findings.filter((f) => f.id === 'R18')));
  const goodR = run('render-check.mjs', path.join(S2, 'good.html'), '--out', path.join(ROOT, '.design-nexus/test-shots'), '--widths', '320,1280');
  check('render finds nothing on good.html', goodR.out.findings.length === 0, JSON.stringify(goodR.out.findings.map((f) => f.id)));
  const snap = path.join(ROOT, '.design-nexus/test-before.json');
  run('render-check.mjs', path.join(S2, 'redesign-before.html'), '--out', path.join(ROOT, '.design-nexus/test-shots'), '--widths', '1280', '--snapshot', snap);
  const improved = run('render-check.mjs', path.join(S2, 'redesign-improved.html'), '--out', path.join(ROOT, '.design-nexus/test-shots'), '--widths', '1280', '--compare', snap);
  check('render --compare accepts improved fields', !improved.out.findings.some((f) => f.id === 'F11'), JSON.stringify(improved.out.findings));
  const lost = run('render-check.mjs', path.join(S2, 'redesign-lost.html'), '--out', path.join(ROOT, '.design-nexus/test-shots'), '--widths', '1280', '--compare', snap);
  check('render --compare flags a removed field', lost.out.findings.some((f) => f.id === 'F11' && /company/.test(f.message)) && lost.code === 2);
}

console.log(failed ? `\n${failed} failed` : '\nall passed');
process.exit(failed ? 1 : 0);
