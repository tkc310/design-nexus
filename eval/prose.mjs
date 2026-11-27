// usage: node eval/prose.mjs <runDir>[,<runDir>…]
// Evaluator-side text measure (H3 / EXP-079): how much of a page is running prose and how much is said by structure.
// Read once at 1280. Prose = text of p, blockquote, figcaption, and li/dd items longer than one short line, outside forms,
// tables, navs and controls. Structure = text in table cells, dt/dd pairs, short list items, labels, and headings.
// Long blocks = prose blocks over 140 characters (70 for Japanese). Writes prose.json per case and prints a table.
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const runs = (process.argv[2] || '').split(',').filter(Boolean).map((r) => path.resolve(r.includes('/') ? r : path.join('eval/runs', r)));
if (!runs.length) { console.error('usage: node eval/prose.mjs <runDir>[,<runDir>…]'); process.exit(1); }
const browser = await chromium.launch();
for (const run of runs) {
  const rows = [];
  for (const c of fs.readdirSync(run).filter((d) => /^\d\d-/.test(d)).sort()) {
    const file = path.join(run, c, 'index.html');
    if (!fs.existsSync(file)) continue;
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.route(/^https?:/, (r) => r.abort());
    try { await page.goto('file://' + file, { waitUntil: 'load', timeout: 15000 }); } catch {}
    await page.waitForTimeout(200);
    const m = await page.evaluate(() => {
      const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();
      const len = (s) => [...norm(s)].length;
      const shown = (el) => { const r = el.getBoundingClientRect(); const c = getComputedStyle(el); return r.width >= 1 && r.height >= 1 && c.visibility !== 'hidden' && c.display !== 'none'; };
      const ja = /[぀-ヿ一-鿿]/.test(document.body.innerText.slice(0, 4000));
      const shortLine = ja ? 40 : 80, longBlock = ja ? 70 : 140;
      const HOLDER = 'form, table, nav, label, button, legend, select, summary, [role=alert], [role=status], [aria-live]';
      let prose = 0, structure = 0, long = 0, blocks = 0;
      const seen = new Set();
      for (const el of document.querySelectorAll('p, blockquote, figcaption, li, dd')) {
        if (!shown(el) || el.closest(HOLDER) || el.closest('script, style, template, svg')) continue;
        if ([...seen].some((s) => s.contains(el))) continue;
        const n = len(el.innerText);
        if (!n) continue;
        if ((el.tagName === 'LI' || el.tagName === 'DD') && n <= shortLine) { structure += n; continue; }
        seen.add(el); prose += n; blocks++; if (n > longBlock) long++;
      }
      for (const el of document.querySelectorAll('td, th, dt, label, h1, h2, h3, h4, h5, h6, button, legend, caption')) if (shown(el)) structure += len(el.innerText);
      const total = len(document.body.innerText);
      return { ja, total, prose, structure, blocks, long, proseShare: total ? +(prose / total).toFixed(3) : 0 };
    });
    await page.close();
    fs.writeFileSync(path.join(run, c, 'prose.json'), JSON.stringify(m, null, 1));
    rows.push({ c, ...m });
  }
  console.log(`\n${path.basename(run)}\n| case | total | prose | share | blocks | long |\n|---|---|---|---|---|---|`);
  for (const r of rows) console.log(`| ${r.c} | ${r.total} | ${r.prose} | ${r.proseShare} | ${r.blocks} | ${r.long} |`);
}
await browser.close();
