#!/usr/bin/env node
// design-nexus render check: screenshots at several widths plus rendered Floor checks.
// Needs Playwright (any install it can find). Without it, prints a skip notice and exits 0.
// Usage:
//   node render-check.mjs <file.html|url> [--out dir] [--widths 320,768,1280,1920]
//        [--surface mobile] [--snapshot before.json] [--compare before.json] [--json]
// Exit: 0 clean or skipped, 2 floor findings, 1 usage or load error.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { printFindings, summarize, tierOf } from './lib.mjs';

const args = process.argv.slice(2);
const opt = { out: '.design-nexus/shots', widths: [320, 768, 1280, 1920], json: false, surface: null, snapshot: null, compare: null, target: null };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--out') opt.out = args[++i];
  else if (a === '--widths') opt.widths = args[++i].split(',').map(Number);
  else if (a === '--json') opt.json = true;
  else if (a === '--surface') opt.surface = args[++i];
  else if (a === '--snapshot') opt.snapshot = args[++i];
  else if (a === '--compare') opt.compare = args[++i];
  else opt.target = a;
}
if (!opt.target) {
  console.log('usage: node render-check.mjs <file.html|url> [--out dir] [--widths 320,768,1280] [--surface mobile] [--snapshot f.json] [--compare f.json] [--json]');
  process.exit(1);
}

function loadPlaywright() {
  const tries = [process.cwd() + '/', import.meta.url];
  for (const base of tries) {
    try { return createRequire(base)('playwright'); } catch {}
  }
  try { return createRequire(import.meta.url)(path.join(process.env.NPM_GLOBAL || '/usr/local/lib/node_modules', 'playwright')); } catch {}
  return null;
}

const pw = loadPlaywright();
if (!pw) {
  const msg = 'Playwright not found: render checks skipped. Install with `npm i -D playwright && npx playwright install chromium`, or review F01/F08/F09 by hand.';
  if (opt.json) console.log(JSON.stringify({ tool: 'design-nexus-render', skipped: true, reason: msg }));
  else console.log(msg);
  process.exit(0);
}

const url = /^https?:\/\//.test(opt.target) ? opt.target : pathToFileURL(path.resolve(opt.target)).href;
const minTap = opt.surface === 'mobile' ? 44 : 24;
fs.mkdirSync(opt.out, { recursive: true });

const findings = [];
const add = (id, where, message) => findings.push({ id, tier: tierOf(id), where, message });
const shots = [];
let look = null;

// Runs in the page. Returns raw measurements; judgement stays in Node.
function measure(minTap) {
  const sel = (el) => {
    if (el.id) return `#${el.id}`;
    const cls = [...el.classList].slice(0, 2).join('.');
    return el.tagName.toLowerCase() + (cls ? '.' + cls : '');
  };
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat);
    return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] };
  };
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const blend = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
  const bgOf = (el) => {
    const layers = [];
    for (let e = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.backgroundImage !== 'none') return null; // gradient or image: unknown
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; }
    }
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (const c of layers.reverse()) base = blend(c, base);
    return base;
  };
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0;
  };

  const out = { overflow: null, small: [], lowContrast: [], tap: [], brokenImg: [], breaks: [], cjkTight: [], look: null };
  const vw = document.documentElement.clientWidth;
  if (document.documentElement.scrollWidth > vw + 1) {
    const culprits = [...document.querySelectorAll('body *')]
      .filter((e) => { const r = e.getBoundingClientRect(); return r.right > vw + 1 && r.width > 0; })
      .slice(0, 5).map(sel);
    out.overflow = { scrollWidth: document.documentElement.scrollWidth, vw, culprits };
  }

  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const t = walker.currentNode;
    if (!t.textContent.trim()) continue;
    const el = t.parentElement;
    if (!el || seen.has(el) || !visible(el)) continue;
    seen.add(el);
    const cs = getComputedStyle(el);
    const size = parseFloat(cs.fontSize);
    // R14: multi-line Japanese running text set tighter than 1.6.
    if (/[\u3040-\u30ff\u3400-\u9fff]{8,}/.test(t.textContent) && size < 22 && !el.closest('h1,h2,h3,h4,h5,h6') && out.cjkTight.length < 10) {
      const lh = cs.lineHeight === 'normal' ? size * 1.2 : parseFloat(cs.lineHeight);
      const r = document.createRange();
      r.selectNodeContents(t);
      const lines = new Set([...r.getClientRects()].filter((x) => x.width > 0).map((x) => Math.round(x.top))).size;
      if (lines >= 2 && lh / size < 1.6) out.cjkTight.push({ sel: sel(el), ratio: +(lh / size).toFixed(2), text: t.textContent.trim().slice(0, 30) });
    }
    if (size < 12 && out.small.length < 10) out.small.push({ sel: sel(el), size, text: t.textContent.trim().slice(0, 40) });
    const fg = parse(cs.color), bg = bgOf(el);
    if (fg && bg) {
      const f = blend(fg, bg);
      const L1 = lum(f), L2 = lum(bg);
      const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      const large = size >= 24 || (size >= 18.66 && +cs.fontWeight >= 700);
      const need = large ? 3 : 4.5;
      if (ratio < need && out.lowContrast.length < 15) out.lowContrast.push({ sel: sel(el), ratio: +ratio.toFixed(2), need, text: t.textContent.trim().slice(0, 40) });
    }
  }

  for (const el of document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=link], [tabindex]:not([tabindex="-1"])')) {
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);
    // Inline links inside running text are exempt (WCAG 2.5.8).
    if (el.tagName === 'A' && cs.display === 'inline' && el.parentElement && /^(P|LI|SPAN|TD|DD|BLOCKQUOTE)$/.test(el.parentElement.tagName)) continue;
    let r = el.getBoundingClientRect();
    // A label extends the target of its control (checkboxes, radios, small inputs).
    for (const label of el.labels || []) {
      const lr = label.getBoundingClientRect();
      if (lr.width * lr.height > r.width * r.height) r = lr;
    }
    if ((r.width < minTap || r.height < minTap) && out.tap.length < 15) out.tap.push({ sel: sel(el), w: Math.round(r.width), h: Math.round(r.height) });
  }

  for (const img of document.images) if (img.complete && img.naturalWidth === 0) out.brokenImg.push(img.getAttribute('src'));

  // Layout breaks inside containers: content escaping a boxed panel, clipped text, figures wrapping mid-number.
  const boxed = [...document.querySelectorAll('body *')].filter((el) => {
    if (!visible(el)) return false;
    const cs = getComputedStyle(el);
    if (cs.overflowX !== 'visible') return false;
    const bg = parse(cs.backgroundColor);
    return parseFloat(cs.borderLeftWidth) > 0 || parseFloat(cs.borderRightWidth) > 0 || (bg && bg.a > 0);
  }).slice(0, 300);
  for (const box of boxed) {
    if (out.breaks.length >= 10) break;
    const br = box.getBoundingClientRect();
    if (br.width >= vw - 1) continue;
    for (const d of box.querySelectorAll('*')) {
      const cs = getComputedStyle(d);
      if (cs.position === 'absolute' || cs.position === 'fixed' || !visible(d)) continue;
      const r = d.getBoundingClientRect();
      if (r.right > br.right + 4 || r.left < br.left - 4) { out.breaks.push(`${sel(d)} escapes ${sel(box)} by ${Math.round(Math.max(r.right - br.right, br.left - r.left))}px`); break; }
    }
  }
  for (const el of document.querySelectorAll('body *')) {
    if (out.breaks.length >= 15) break;
    const cs = getComputedStyle(el);
    if (!/hidden|clip/.test(cs.overflowX) || cs.textOverflow === 'ellipsis' || !visible(el)) continue;
    if (el.clientWidth <= 2 || el.clientHeight <= 2) continue; // visually-hidden text
    if (el.scrollWidth > el.clientWidth + 2 && el.textContent.trim() && ['SELECT', 'INPUT', 'TEXTAREA'].indexOf(el.tagName) === -1 && el.children.length < 20) {
      out.breaks.push(`${sel(el)} clips its content (${el.scrollWidth}px in ${el.clientWidth}px)`);
    }
  }
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (tw.nextNode() && out.breaks.length < 15) {
    const t = tw.currentNode;
    const v = t.textContent.trim();
    if (v.length < 4 || !/^[-−+]?[¥$€£]?\s?[-−]?\d[\d,.\s]*(円|%|件|名|日)?$/.test(v)) continue;
    if (!t.parentElement || !visible(t.parentElement)) continue;
    const range = document.createRange();
    range.selectNodeContents(t);
    const tops = new Set([...range.getClientRects()].filter((r) => r.width > 0).map((r) => Math.round(r.top)));
    if (tops.size > 1) out.breaks.push(`figure "${v}" wraps across lines in ${sel(t.parentElement)}`);
  }

  // A coarse description of the look, for spotting runs that all converge on one style.
  const bodyBg = bgOf(document.body) || { r: 255, g: 255, b: 255 };
  const fam = (el) => (el ? getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '').trim() : null);
  const all = [...document.querySelectorAll('body *')].filter(visible);
  const shadows = all.filter((e) => getComputedStyle(e).boxShadow !== 'none').length;
  const radii = all.map((e) => parseFloat(getComputedStyle(e).borderTopLeftRadius) || 0).filter((r) => r > 0 && r < 100);
  const textEls = all.filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()));
  const mono = textEls.filter((e) => /mono|code|courier|consolas|menlo/i.test(getComputedStyle(e).fontFamily)).length;
  const L = lum(bodyBg);
  out.look = {
    ground: L > 0.75 ? 'light' : L < 0.1 ? 'dark' : 'mid',
    ground_rgb: [bodyBg.r, bodyBg.g, bodyBg.b].map(Math.round),
    body_font: fam(document.querySelector('main p, article p, p') || document.body),
    heading_font: fam(document.querySelector('h1') || document.querySelector('h2')),
    shadows: shadows > 2,
    radius_median: radii.length ? radii.sort((a, b) => a - b)[Math.floor(radii.length / 2)] : 0,
    mono_share: textEls.length ? +(mono / textEls.length).toFixed(2) : 0,
  };
  return out;
}

function snapshot() {
  const txt = (e) => (e.getAttribute('aria-label') || e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
  return {
    links: [...document.querySelectorAll('a[href]')].map((a) => `${a.getAttribute('href')} | ${txt(a)}`),
    fields: [...document.querySelectorAll('input, select, textarea')].map((f) => `${f.tagName.toLowerCase()}[${f.type || ''}] ${f.name || f.id || ''}`),
    buttons: [...document.querySelectorAll('button, [role=button], input[type=submit]')].map((b) => txt(b) || b.value || ''),
    handlers: [...document.querySelectorAll('[onclick], [onsubmit], [onchange], form[action]')].map((e) => `${e.tagName.toLowerCase()} ${e.getAttribute('action') || ''}`.trim()),
    headings: [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => `${h.tagName.toLowerCase()} ${txt(h)}`),
  };
}

async function focusCheck(page) {
  return page.evaluate(async () => {
    const els = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"])')].slice(0, 20);
    const bad = [];
    for (const el of els) {
      const look = () => { const c = getComputedStyle(el); return [c.outlineStyle, c.outlineWidth, c.outlineColor, c.boxShadow, c.borderColor, c.backgroundColor, c.textDecorationLine].join('|'); };
      el.blur();
      const before = look();
      el.focus({ focusVisible: true });
      if (document.activeElement !== el) continue;
      const after = look();
      const c = getComputedStyle(el);
      const outlined = c.outlineStyle !== 'none' && parseFloat(c.outlineWidth) > 0;
      if (before === after && !outlined) bad.push((el.id ? '#' + el.id : el.tagName.toLowerCase()) + ' ' + (el.textContent || '').trim().slice(0, 30));
      el.blur();
    }
    return bad;
  });
}

const browser = await pw.chromium.launch();
try {
  for (const width of opt.widths) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    } catch (e) {
      await page.goto(url, { waitUntil: 'load', timeout: 30000 }).catch(() => {});
    }
    await page.waitForTimeout(400);
    const file = path.join(opt.out, `w${width}.png`);
    await page.screenshot({ path: file, fullPage: true });
    shots.push(file);
    const m = await page.evaluate(measure, minTap);
    if (m.overflow) add('F08', `@${width}px`, `Horizontal scroll: page is ${m.overflow.scrollWidth}px in a ${m.overflow.vw}px viewport (${m.overflow.culprits.join(', ')})`);
    for (const s of m.small) add('F12', `@${width}px ${s.sel}`, `${s.size}px text "${s.text}"`);
    if (width === opt.widths[opt.widths.length - 1] || width >= 1280) {
      for (const c of m.lowContrast) add('F01', `@${width}px ${c.sel}`, `contrast ${c.ratio}:1 < ${c.need}:1 "${c.text}"`);
    }
    if (width <= 768) for (const t of m.tap) add('F09', `@${width}px ${t.sel}`, `tap target ${t.w}×${t.h}px < ${minTap}px`);
    for (const b of m.breaks) add('R17', `@${width}px`, b);
    if (width === 1280) for (const c of m.cjkTight) add('R14', `@${width}px ${c.sel}`, `Japanese running text at line-height ${c.ratio}; body copy needs 1.7–1.9 "${c.text}"`);
    if (width === 1280 || (!look && width === opt.widths[opt.widths.length - 1])) look = m.look;
    if (width === opt.widths[0]) {
      for (const src of m.brokenImg) add('N06', src, 'Broken image');
      const unfocused = await focusCheck(page);
      for (const u of unfocused.slice(0, 10)) add('F02', u, 'No visible focus change on keyboard focus');
    }
    await ctx.close();
  }

  // Reduced motion: anything still moving with the preference set?
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(200);
  const moving = await page.evaluate(() => document.getAnimations()
    .filter((a) => a.playState === 'running')
    .filter((a) => {
      const kf = a.effect?.getKeyframes?.() || [];
      return kf.some((k) => 'transform' in k || 'translate' in k || 'scale' in k || 'rotate' in k || 'left' in k || 'top' in k);
    }).length);
  if (moving) add('F05', '@1280px reduced-motion', `${moving} movement animation(s) still run with prefers-reduced-motion: reduce`);

  if (opt.snapshot || opt.compare) {
    const snap = await page.evaluate(snapshot);
    if (opt.snapshot) fs.writeFileSync(opt.snapshot, JSON.stringify(snap, null, 2));
    if (opt.compare) {
      const before = JSON.parse(fs.readFileSync(opt.compare, 'utf8'));
      // Links and fields must survive exactly; buttons, headings, and handlers may change form but not be dropped.
      for (const key of ['links', 'fields']) {
        const now = (snap[key] || []).map((x) => x.split(' | ')[0]);
        for (const item of before[key] || []) {
          const k = item.split(' | ')[0];
          const i = now.indexOf(k);
          if (i === -1) add('F11', key, `Lost after redesign: ${item}`);
          else now.splice(i, 1);
        }
      }
      for (const key of ['buttons', 'headings', 'handlers']) {
        const was = (before[key] || []).length, is = (snap[key] || []).length;
        if (is < was) add('F11', key, `${was - is} fewer ${key} than before (${was} → ${is}); confirm none was lost`);
      }
    }
  }
  await ctx.close();
} finally {
  await browser.close();
}

const counts = summarize(findings);
if (opt.json) console.log(JSON.stringify({ tool: 'design-nexus-render', url, widths: opt.widths, shots, counts, findings, look }, null, 2));
else {
  printFindings(findings, `design-nexus render: ${url}\nscreenshots: ${shots.join(', ')}`);
  if (counts.floor) console.log('\nFloor findings remain: the work is not done.');
}
process.exit(counts.floor ? 2 : 0);
