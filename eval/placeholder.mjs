// usage: node eval/placeholder.mjs <run>[,<run>…]
// M-078 (EXP-086): evaluator-side measure of empty photo frames early on a phone. At 320x640, find placeholder frames:
// elements at least 80px tall whose own short text (≤ 60 chars) names a missing photo (写真, 準備中, 差し替え, photo,
// placeholder), with no img, picture, video, or canvas inside, keeping only the innermost such element. Report the
// frame pixels that fall in the first two screens (y < 1280), whether any frame is on the first screen (y < 640), the
// frames' total height, and how many frames lead their section (no text, link, or button of the section above them).
// Writes placeholder.json per case.
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
    const page = await browser.newPage({ viewport: { width: 320, height: 640 } });
    await page.route(/^https?:/, (r) => r.abort());
    try { await page.goto('file://' + file, { waitUntil: 'load', timeout: 15000 }); } catch {}
    await page.waitForTimeout(300);
    const res = await page.evaluate(() => {
      const RE = /写真|準備中|差し替え|photo|placeholder/i;
      const hits = [];
      for (const el of document.body.querySelectorAll('*')) {
        if (el.closest('script, style, noscript, template, [hidden]')) continue;
        const r = el.getBoundingClientRect();
        if (r.height < 80 || r.width < 1) continue;
        const t = (el.innerText || '').trim();
        if (!t || t.length > 60 || !RE.test(t)) continue;
        if (el.querySelector('img, picture, video, canvas')) continue;
        hits.push(el);
      }
      const inner = hits.filter((a) => !hits.some((b) => b !== a && a.contains(b)));
      let px = 0, total = 0, first = false, leading = 0;
      for (const el of inner) {
        const r = el.getBoundingClientRect(); const top = r.top + scrollY, bottom = r.bottom + scrollY;
        px += Math.max(0, Math.min(bottom, 1280) - Math.max(top, 0));
        total += r.height;
        if (top < 640) first = true;
        const sec = el.closest('section, article, main > div') || document.body;
        const before = [...sec.querySelectorAll('p, li, dd, td, button, a')].some((t) => !el.contains(t) && (t.innerText || '').trim().length > 8 && t.getBoundingClientRect().top + scrollY < top);
        if (!before) leading++;
      }
      return { frames: inner.length, px: Math.round(px), total: Math.round(total), leading, firstScreen: first };
    });
    await page.close();
    fs.writeFileSync(path.join(run, c, 'placeholder.json'), JSON.stringify(res));
    console.log(`  ${c}: frames ${res.frames}, leading ${res.leading}, total px ${res.total}, px in first two screens ${res.px}, on first screen ${res.firstScreen}`);
  }
}
await browser.close();
