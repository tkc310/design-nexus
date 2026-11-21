// M-072: measure what a page pays for fonts and whether its Japanese web fonts actually draw.
//   node eval/fontprobe.cjs <index.html>...            one JSON line per page
// fontKB / fontReqs: bytes and requests of resource type "font" at 1280 wide (network must reach the font host).
// leak: glyphs in elements whose first font-family is a Japanese web font but that were drawn by a system font
//       (a `text=` subset that misses characters, or a family that never loaded).
// usage: glyphs per drawn font, `web:` or `sys:`.
const path = require('path');
const { chromium } = require('playwright');

const JP_WEB = /^(noto (sans|serif) jp|ibm plex sans jp|m plus (1p?|2|rounded 1c|1 code)|murecho|line seed jp|zen (kaku gothic (new|antique)|maru gothic|old mincho|antique( soft)?|kurenaido)|biz udp?(gothic|mincho)|kiwi maru|shippori (mincho( b1)?|antique( b1)?)|kaisei (tokumin|opti|decol|harunoumi)|hina mincho|klee one|yuji (syuku|boku|mai)|dela gothic one|rocknroll one|reggae one|stick|dotgothic16|rampart one|mochiy pop (one|p one)|sawarabi (gothic|mincho)|kosugi( maru)?|potta one|yusei magic|hachi maru pop|yomogi|new tegomin)$/i;

(async () => {
  const files = process.argv.slice(2).map((f) => path.resolve(f));
  const browser = await chromium.launch();
  for (const f of files) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    let fontBytes = 0, fontReqs = 0;
    const pending = [];
    page.on('response', (r) => {
      if (r.request().resourceType() !== 'font') return;
      fontReqs++;
      pending.push(r.body().then((b) => { fontBytes += b.length; }).catch(() => {}));
    });
    await page.goto('file://' + f, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
    await page.evaluate(() => document.fonts.ready).catch(() => {});
    await page.waitForTimeout(500);
    await Promise.all(pending);
    // Tag every element that owns visible text with the first family of its computed stack.
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('body *')) {
        const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (!own) continue;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        const first = cs.fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '');
        el.setAttribute('data-fp', first);
      }
    });
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
    const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
    const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: '[data-fp]' });
    const usage = {};
    let leak = 0, jpWebGlyphs = 0;
    for (const id of nodeIds.slice(0, 1500)) {
      try {
        const { attributes } = await cdp.send('DOM.getAttributes', { nodeId: id });
        const first = attributes[attributes.indexOf('data-fp') + 1];
        const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId: id });
        for (const ft of fonts) {
          const k = (ft.isCustomFont ? 'web:' : 'sys:') + ft.familyName;
          usage[k] = (usage[k] || 0) + ft.glyphCount;
          if (JP_WEB.test(first)) { jpWebGlyphs += ft.glyphCount; if (!ft.isCustomFont) leak += ft.glyphCount; }
        }
      } catch {}
    }
    const name = f.includes('/runs/') ? f.split('/runs/')[1] : f;
    console.log(JSON.stringify({ page: name, fontReqs, fontKB: Math.round(fontBytes / 1024), jpWebGlyphs, leak, usage }));
    await ctx.close();
  }
  await browser.close();
})();
