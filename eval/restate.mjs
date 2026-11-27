// usage: node eval/restate.mjs <run>[,<run>…]
// M-077: evaluator-side count of restatements. For each case, the facts the brief gives (with their spelling variants)
// are fixed below, before any generation. At 1280, count how often each fact appears in visible text (excluding nav,
// aria-hidden, and code samples (pre, code, kbd, samp: demos are not restatements); the excess is max(0, count - 2) summed over facts. Primary actions and the
// product name are not counted. Cases without brief facts (06: SOURCE.html has none) report 0. Writes restate.json per case.
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const FACTS = {
  '01-lp-devtool': {
    MIT: /\bMIT\b/g,
    Rust: /\bRust\b/g,
    'one binary': /\b(?:1|one|single)[ -](?:static )?binar(?:y|ies)\b|\bsingle[- ]binary\b/gi,
    'JSON and logfmt': /\blogfmt\b/gi,
  },
  '02-lp-ja-craft': {
    定員: /(?:6|６|六)\s*(?:名|人)/g,
    頻度: /月\s*(?:に)?\s*(?:2|２|二)\s*回|第\s*[2２二]\s*[・、,]\s*第?\s*[4４四]/g,
    職人: /(?:2|２|二)\s*(?:名|人)の(?:職人|作り手)|職人(?:は)?\s*(?:2|２|二)\s*(?:名|人)|ふたり/g,
    五条坂: /五条坂/g,
  },
};
const runs = (process.argv[2] || '').split(',').filter(Boolean).map((r) => path.resolve(r.includes('/') ? r : path.join('eval/runs', r)));
const browser = await chromium.launch();
for (const run of runs) {
  const rows = [];
  for (const c of fs.readdirSync(run).filter((d) => /^\d\d-/.test(d)).sort()) {
    const file = path.join(run, c, 'index.html');
    if (!fs.existsSync(file)) continue;
    const facts = FACTS[c] || {};
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.route(/^https?:/, (r) => r.abort());
    try { await page.goto('file://' + file, { waitUntil: 'load', timeout: 15000 }); } catch {}
    await page.waitForTimeout(200);
    const text = await page.evaluate(() => {
      const out = [];
      const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = walk.nextNode(); n; n = walk.nextNode()) {
        const el = n.parentElement;
        if (!el || el.closest('script, style, noscript, template, nav, pre, code, kbd, samp, [aria-hidden="true"], title')) continue;
        const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
        if (r.width < 1 || r.height < 1 || s.visibility === 'hidden' || s.display === 'none') continue;
        out.push(n.textContent);
      }
      return out.join(' ').replace(/\s+/g, ' ');
    });
    await page.close();
    const counts = Object.fromEntries(Object.entries(facts).map(([k, re]) => [k, (text.match(re) || []).length]));
    const excess = Object.values(counts).reduce((a, n) => a + Math.max(0, n - 2), 0);
    fs.writeFileSync(path.join(run, c, 'restate.json'), JSON.stringify({ counts, excess }, null, 1));
    rows.push({ c, counts, excess });
  }
  console.log(path.basename(run));
  for (const r of rows) console.log(`  ${r.c}: excess ${r.excess} ${JSON.stringify(r.counts)}`);
}
await browser.close();
