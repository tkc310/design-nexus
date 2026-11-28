// usage: node eval/units.mjs <run>[,<run>…]
// M-079 (EXP-087): evaluator-side count of bookable units on the first screen. At 320x640 and 1280x800, count the
// innermost visible elements that hold a date or time (11月14日, 11/14, 14日(土), 8:00, 土曜) and their own link or
// button, whose top is on the first screen. Writes units.json per case.
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const runs = (process.argv[2] || '').split(',').filter(Boolean).map((r) => path.resolve(r.includes('/') ? r : path.join('eval/runs', r)));
const browser = await chromium.launch();
for (const run of runs) {
  console.log(path.basename(run));
  for (const c of fs.readdirSync(run).filter((d) => /^\d\d-/.test(d)).sort()) {
    const file = path.join(run, c, 'index.html');
    if (!fs.existsSync(file)) continue;
    const out = {};
    for (const [w, h] of [[320, 640], [1280, 800]]) {
      const page = await browser.newPage({ viewport: { width: w, height: h } });
      await page.route(/^https?:/, (r) => r.abort());
      try { await page.goto('file://' + file, { waitUntil: 'load', timeout: 15000 }); } catch {}
      await page.waitForTimeout(300);
      out[w] = await page.evaluate((h) => {
        const DATE = /\d{1,2}\s*月\s*\d{1,2}\s*日|\d{1,2}\/\d{1,2}|\d{1,2}\s*日\s*[(（][月火水木金土日][)）]|\d{1,2}:\d{2}|[月火水木金土日]曜/;
        const hits = [];
        for (const el of document.body.querySelectorAll('li, tr, article, div, label, a, button')) {
          if (el.closest('nav, header, footer, script, style, [hidden], [aria-hidden="true"]')) continue;
          const r = el.getBoundingClientRect();
          if (r.width < 1 || r.height < 1 || r.top >= h || r.bottom <= 0) continue;
          const t = el.innerText || '';
          if (!DATE.test(t) || t.length > 160) continue;
          const act = el.matches('a[href], button, label') ? el : el.querySelector('a[href], button, input[type=radio]');
          if (!act) continue;
          hits.push(el);
        }
        return hits.filter((a) => !hits.some((b) => b !== a && a.contains(b))).length;
      }, h);
      await page.close();
    }
    fs.writeFileSync(path.join(run, c, 'units.json'), JSON.stringify(out));
    console.log(`  ${c}: first-screen units at 320 ${out[320]}, at 1280 ${out[1280]}`);
  }
}
await browser.close();
