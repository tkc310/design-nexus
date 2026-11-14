#!/usr/bin/env node
// design-nexus render check: screenshots at several widths plus rendered Floor checks.
// Needs Playwright (any install it can find). Without it, prints a skip notice and exits 0.
// Usage:
//   node render-check.mjs <file.html|url> [--out dir] [--widths 320,768,1280,1920]   (R29 needs 1280 and 1920)
//        [--surface mobile] [--snapshot before.json] [--compare before.json] [--json]
//        [--first-screen] [--tiles]   (evaluation captures; findings are the same with or without them)
// Exit: 0 clean or skipped, 2 floor findings, 1 usage or load error.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { printFindings, summarize, tierOf, unmatchedFields } from './lib.mjs';

const args = process.argv.slice(2);
const opt = { out: '.design-nexus/shots', widths: [320, 768, 1280, 1920], json: false, surface: null, snapshot: null, compare: null, target: null, time: null, tz: null, first: false, tiles: false };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--out') opt.out = args[++i];
  else if (a === '--widths') opt.widths = args[++i].split(',').map(Number);
  else if (a === '--json') opt.json = true;
  else if (a === '--surface') opt.surface = args[++i];
  else if (a === '--snapshot') opt.snapshot = args[++i];
  else if (a === '--compare') opt.compare = args[++i];
  else if (a === '--time') opt.time = args[++i]; // ISO instant, e.g. 2026-11-04T10:30:00+09:00: pins the page clock
  else if (a === '--tz') opt.tz = args[++i]; // IANA zone for the page, e.g. Asia/Tokyo
  // Evaluation captures (eval/run.mjs score): the first screen as a visitor sees it, and the page in 900px tiles with
  // fixed and sticky bars laid out in flow, so a judge can read every width and no bar covers content in a full-page shot.
  else if (a === '--first-screen') opt.first = true;
  else if (a === '--tiles') opt.tiles = true;
  else opt.target = a;
}
if (!opt.target) {
  console.log('usage: node render-check.mjs <file.html|url> [--out dir] [--widths 320,768,1280] [--surface mobile] [--snapshot f.json] [--compare f.json] [--time ISO] [--tz Zone] [--first-screen] [--tiles] [--json]');
  process.exit(1);
}

function loadPlaywright() {
  const tries = [process.cwd() + '/', import.meta.url];
  for (const base of tries) {
    try { return createRequire(base)('playwright'); } catch {}
  }
  // A global install: $NPM_GLOBAL, then wherever `npm root -g` points, then the usual prefix.
  const globals = [process.env.NPM_GLOBAL];
  try { globals.push(execSync('npm root -g', { stdio: ['ignore', 'pipe', 'ignore'], timeout: 5000 }).toString().trim()); } catch {}
  globals.push('/usr/local/lib/node_modules');
  for (const dir of globals.filter(Boolean)) {
    try { return createRequire(import.meta.url)(path.join(dir, 'playwright')); } catch {}
  }
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
// The same keep comments the lint reads: `design-nexus: keep Rxx because …` in the page source.
const kept = new Map();
if (!/^https?:\/\//.test(opt.target)) {
  try {
    const src = fs.readFileSync(path.resolve(opt.target), 'utf8');
    for (const m of src.matchAll(/design-nexus:\s*keep\s+([FRN]\d{2})\s+because\s+([^\n*>]+)/gi)) kept.set(m[1].toUpperCase(), m[2].trim());
  } catch {}
}
const add = (id, where, message) => {
  const f = { id, tier: tierOf(id), where, message };
  if (kept.has(id)) {
    if (id.startsWith('F')) f.message += ' (floor checks cannot be kept)';
    else f.kept = kept.get(id);
  }
  findings.push(f);
};
const shots = [];
let look = null;
// Evaluation captures: which widths were tiled, how tall the page was, and which bars were laid out in flow.
const TILE = { height: 900, step: 840, max: 30 };
const capture = opt.first || opt.tiles ? { first_screen: opt.first, tiles: opt.tiles, tile_height: TILE.height, tile_step: TILE.step, widths: {} } : null;

// Runs in the page. Fixed and sticky bars are laid out in flow so a full-page capture shows what they would otherwise
// cover. Off-canvas drawers and empty decorative layers are not bars over content and stay as they are.
function flattenBars() {
  const done = [];
  const name = (el) => (el.id ? `#${el.id}` : el.tagName.toLowerCase() + (el.classList[0] ? `.${el.classList[0]}` : ''));
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    if (cs.position === 'fixed') {
      if (r.right <= 0 || r.left >= innerWidth || r.bottom <= 0 || r.top >= innerHeight) continue;
      if (!(el.innerText || '').trim()) continue;
    }
    done.push({ el, v: el.style.getPropertyValue('position'), p: el.style.getPropertyPriority('position'), name: name(el) });
    el.style.setProperty('position', 'static', 'important');
  }
  window.__dnFlat = done;
  return done.map((d) => d.name);
}
function restoreBars() {
  for (const d of window.__dnFlat || []) {
    if (d.v) d.el.style.setProperty('position', d.v, d.p);
    else d.el.style.removeProperty('position');
  }
  window.__dnFlat = [];
}
// The page in 900px tiles, top to bottom, overlapping by 60px so no line is lost at a cut.
async function captureTiles(page, width) {
  for (const f of fs.readdirSync(opt.out)) if (new RegExp(`^w${width}-\\d{2}\\.png$`).test(f)) fs.rmSync(path.join(opt.out, f));
  const height = await page.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body ? document.body.scrollHeight : 0));
  const files = [];
  for (let y = 0, i = 1; y < height && i <= TILE.max; y += TILE.step, i++) {
    if (i > 1 && height - y <= TILE.height - TILE.step) break; // only the overlap is left
    const f = path.join(opt.out, `w${width}-${String(i).padStart(2, '0')}.png`);
    await page.screenshot({ path: f, fullPage: true, clip: { x: 0, y, width, height: Math.min(TILE.height, height - y) } });
    files.push(f);
  }
  const covered = files.length ? (files.length - 1) * TILE.step + TILE.height : 0;
  return { files, height, truncated: covered < height };
}
const textsAt = new Map();
const wideAt = new Map(); // R29: the arrangement at 1280 and 1920

// Runs in the page. Returns raw measurements; judgement stays in Node.
function measure(minTap) {
  const sel = (el) => {
    if (el.id) return `#${el.id}`;
    const cls = [...el.classList].slice(0, 2).join('.');
    return el.tagName.toLowerCase() + (cls ? '.' + cls : '');
  };
  // Any CSS color (rgb, color(srgb …) from color-mix, oklch …) resolved through a 1×1 canvas.
  const cv = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  const parse = (c) => {
    if (!c || c === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
    const m = c.match(/^rgba?\(([^)]+)\)$/);
    if (m) {
      const p = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat);
      return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] };
    }
    cv.clearRect(0, 0, 1, 1);
    cv.fillStyle = '#000'; cv.fillStyle = c;
    cv.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = cv.getImageData(0, 0, 1, 1).data;
    return { r, g, b, a: a / 255 };
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

  const out = { overflow: null, small: [], fine: [], lowContrast: [], boundary: [], nameMismatch: [], tap: [], brokenImg: [], breaks: [], sidescroll: [], fold: null, filled: [], cjkTight: [], texts: [], look: null };
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
    // R20: informative text set below 14px (a word or two of metadata is fine; sentences and data are not).
    else if (size < 14) {
      const txt = t.textContent.trim();
      const cjk = (txt.match(/[\u3040-\u30ff\u3400-\u9fff]/g) || []).length;
      if ((cjk >= 6 || txt.split(/\s+/).length >= 3 || /\d[\d,.:]*\s*\S/.test(txt) && txt.length >= 5) && !el.closest('[aria-hidden="true"], .visually-hidden, .sr-only')) out.fine.push({ sel: sel(el), size, text: txt.slice(0, 40) });
    }
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

  const ratioOf = (a, b) => { const L1 = lum(a), L2 = lum(b); return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05); };
  // F01 (non-text): a text field, select, or textarea needs a boundary of 3:1 against what surrounds it,
  // from its border or its own fill, or from a tight wrapper that draws the field (a prompt line, a search pill).
  // Shadows and background images are not measured.
  const edge = (node) => {
    const cs = getComputedStyle(node);
    if (cs.boxShadow !== 'none' || cs.backgroundImage !== 'none') return Infinity;
    const outer = node.parentElement && bgOf(node.parentElement);
    if (!outer) return Infinity;
    const fill = blend(parse(cs.backgroundColor), outer);
    let best = ratioOf(fill, outer);
    for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
      if (parseFloat(cs[`border${side}Width`]) < 1 || cs[`border${side}Style`] === 'none') continue;
      const bc = parse(cs[`border${side}Color`]);
      best = Math.max(best, ratioOf(blend(bc, outer), outer), ratioOf(blend(bc, fill), fill));
    }
    return best;
  };
  const FIELDS = 'input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=range]):not([type=color]):not([type=file]):not([type=submit]):not([type=button]):not([type=reset]):not([type=image]), select, textarea';
  for (const el of document.querySelectorAll(FIELDS)) {
    if (!visible(el) || out.boundary.length >= 10) continue;
    let best = edge(el);
    // Climb through wrappers that hold only this field (a prompt line, a ruled form cell with its label and hint).
    for (let a = el.parentElement, k = 0; a && a !== document.body && k < 3 && best < 3; a = a.parentElement, k++) {
      if ([...a.querySelectorAll(FIELDS)].filter(visible).length > 1) break;
      best = Math.max(best, edge(a));
    }
    if (best < 3) out.boundary.push({ sel: sel(el), ratio: +best.toFixed(2), name: (el.labels && el.labels[0] ? el.labels[0].innerText : el.getAttribute('aria-label') || el.name || '').trim().slice(0, 30) });
  }
  // F13: a control whose aria-label leaves out a word it shows (WCAG 2.5.3 Label in Name).
  // Only painted text counts: visually hidden spans (clipped to a pixel) are not what a voice user sees.
  const norm = (x) => x.toLowerCase().normalize('NFKC').replace(/[\s.,:;!?、。・…「」『』()\-–—'"’“”→←↗›»|/]+/g, '');
  const shown = (root) => {
    const words = [];
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (tw.nextNode()) {
      const t = tw.currentNode, p = t.parentElement;
      if (!t.data.trim() || !p || p.closest('[aria-hidden="true"]')) continue;
      const r = p.getBoundingClientRect();
      if (r.width <= 2 || r.height <= 2 || (p.checkVisibility && !p.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }))) continue;
      words.push(...t.data.trim().split(/\s+/));
    }
    return words.map(norm).filter((w) => w.length > 0);
  };
  for (const el of document.querySelectorAll('a[href][aria-label], button[aria-label], [role=button][aria-label], [role=link][aria-label], summary[aria-label], [role=tab][aria-label], [role=menuitem][aria-label]')) {
    if (!visible(el) || out.nameMismatch.length >= 10) continue;
    // A toggle's on/off text is its state, not its label.
    if (el.hasAttribute('aria-pressed') || el.hasAttribute('aria-checked')) continue;
    const words = shown(el);
    if (words.join('').length < 2) continue;
    const label = el.getAttribute('aria-label') || '', nl = norm(label);
    const missing = words.filter((w) => !nl.includes(w));
    if (missing.length) out.nameMismatch.push({ sel: sel(el), visible: words.join(' ').slice(0, 40), missing: missing.join(' ').slice(0, 30), label: label.slice(0, 60) });
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
      if (!visible(d)) continue;
      // Skip content that is positioned out of flow or sits in its own scroll or clip container (the intended fix for wide tables and code).
      let contained = false;
      for (let e = d; e && e !== box; e = e.parentElement) {
        const cs = getComputedStyle(e);
        if (cs.position === 'absolute' || cs.position === 'fixed' || (e !== d && cs.overflowX !== 'visible')) { contained = true; break; }
      }
      if (contained) continue;
      const r = d.getBoundingClientRect();
      if (r.right > br.right + 4 || r.left < br.left - 4) { out.breaks.push(`${sel(d)} escapes ${sel(box)} by ${Math.round(Math.max(r.right - br.right, br.left - r.left))}px`); break; }
    }
  }
  for (const el of document.querySelectorAll('body *')) {
    if (out.breaks.length >= 15) break;
    const cs = getComputedStyle(el);
    if (!/hidden|clip/.test(cs.overflowX) || cs.textOverflow === 'ellipsis' || !visible(el)) continue;
    if (el.clientWidth <= 2 || el.clientHeight <= 2) continue; // visually-hidden text
    if (el.scrollWidth <= el.clientWidth + 2 || ['SELECT', 'INPUT', 'TEXTAREA'].includes(el.tagName)) continue;
    // Only text that is cut off counts; decoration bleeding out of an overflow:hidden hero is intended.
    const er = el.getBoundingClientRect();
    const tx = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let cut = null;
    for (let n = 0; tx.nextNode() && n < 200 && !cut; n++) {
      const t = tx.currentNode;
      if (!t.textContent.trim() || !t.parentElement || !visible(t.parentElement)) continue;
      let inner = false;
      for (let e = t.parentElement; e && e !== el; e = e.parentElement) if (getComputedStyle(e).overflowX !== 'visible') { inner = true; break; }
      if (inner) continue;
      const r = document.createRange();
      r.selectNodeContents(t);
      if ([...r.getClientRects()].some((x) => x.width > 0 && (x.right > er.right + 2 || x.left < er.left - 2))) cut = t.textContent.trim().slice(0, 30);
    }
    if (cut) out.breaks.push(`${sel(el)} clips its text "${cut}" (${el.scrollWidth}px in ${el.clientWidth}px)`);
  }
  // R24: content parked in a sideways scroll. A scroll box is the fallback for wide tables and code, but a reader at a
  // narrow width who has to swipe to see a command's end or a table's deciding column often never finds it.
  if (vw <= 768) {
    for (const el of document.querySelectorAll('body *')) {
      if (out.sidescroll.length >= 3) break;
      const cs = getComputedStyle(el);
      if (!/auto|scroll/.test(cs.overflowX) || !visible(el) || el.clientWidth < 40) continue;
      if (el.closest('nav, [role="tablist"], [role="toolbar"], [aria-hidden="true"]')) continue; // swipeable tab and chip strips are a known pattern
      if (el.scrollWidth < el.clientWidth * 1.25) continue;
      const er = el.getBoundingClientRect();
      const tx = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let hidden = null;
      for (let n = 0; tx.nextNode() && n < 400 && !hidden; n++) {
        const t = tx.currentNode;
        if (!t.textContent.trim() || !t.parentElement || !visible(t.parentElement)) continue;
        const r = document.createRange();
        r.selectNodeContents(t);
        if ([...r.getClientRects()].some((x) => x.width > 0 && x.right > er.right + 8)) hidden = t.textContent.trim().slice(-30);
      }
      if (!hidden) continue;
      if ([...out.sidescroll].some((x) => el.contains(x.el) || x.el.contains(el))) continue;
      out.sidescroll.push({ el, sel: sel(el), pct: Math.round((1 - el.clientWidth / el.scrollWidth) * 100), kind: el.querySelector('table') || el.tagName === 'TABLE' ? 'table' : el.matches('pre, code') || el.querySelector('pre, code') ? 'code' : 'content', text: hidden });
    }
    out.sidescroll = out.sidescroll.map(({ el, ...x }) => x);
  }
  // R25: the strongest-looking action should be on the first screen. Find the first enabled control with a solid fill
  // that stands out (2:1) from what is behind it; skip links and other off-screen helpers are ignored.
  // The same finder hands R30 the solid fills top to bottom, with what is behind each, so that R30 can also take a fill
  // that stands out by hue rather than by lightness (a yellow button on white paper).
  if (vw >= 768) {
    const fill = (el) => { const c = parse(getComputedStyle(el).backgroundColor); return c && c.a >= 0.6 ? c : null; };
    const behind = (el) => { for (let e = el.parentElement; e; e = e.parentElement) { const c = fill(e); if (c) return c; } return { r: 255, g: 255, b: 255, a: 1 }; };
    let first = null;
    const filled = [];
    for (const el of document.querySelectorAll('a[href], button, [role="button"], input[type="submit"]')) {
      if (!visible(el) || el.disabled || el.getAttribute('aria-disabled') === 'true') continue;
      const r = el.getBoundingClientRect();
      const top = r.top + scrollY;
      if (r.width < 40 || r.height < 24 || top < 0 || r.right <= 0 || r.left >= vw) continue;
      const c = fill(el);
      if (!c) continue;
      const b = behind(el);
      const strong = ratioOf(c, b) >= 2;
      const text = (el.innerText || el.value || '').trim().replace(/\s+/g, ' ').slice(0, 30);
      if (strong && (!first || top < first.top)) first = { top: Math.round(top), text, sel: sel(el) };
      // A toggle, tab or current item shows its state or the selection with its fill; R30 looks past it to an action.
      const toggle = el.matches('[aria-pressed], [aria-checked], [aria-selected], [aria-current]:not([aria-current="false"]), [role=switch], [role=tab], [role=checkbox], [role=radio], [role=option]');
      filled.push({ top, text, sel: sel(el), rgb: [c.r, c.g, c.b].map(Math.round), behind: [b.r, b.g, b.b].map(Math.round), strong, toggle });
    }
    if (first && first.top > innerHeight) out.fold = first;
    out.filled = filled.sort((a, b) => a.top - b.top).slice(0, 40).map((f) => ({ ...f, top: Math.round(f.top) }));
  }
  // A table whose columns no longer line up: a breakpoint hid a column in the head but not in the body or foot.
  for (const table of document.querySelectorAll('table')) {
    if (!visible(table) || out.breaks.length >= 15) continue;
    const head = table.tHead?.rows[table.tHead.rows.length - 1];
    if (!head) continue;
    if ([...head.cells].some((c) => getComputedStyle(c).display !== 'table-cell' && getComputedStyle(c).display !== 'none')) continue; // restyled as cards
    if (head.getBoundingClientRect().height < 4) continue; // a visually hidden head
    const edges = [...head.cells].filter(visible).map((c) => c.getBoundingClientRect()).filter((r) => r.width > 0);
    if (edges.length < 2) continue;
    const rows = [...(table.tBodies[0]?.rows || [])].slice(0, 1).concat([...(table.tFoot?.rows || [])]);
    for (const row of rows) {
      const cells = [...row.cells].filter(visible).map((c) => ({ c, r: c.getBoundingClientRect() })).filter((x) => x.r.width > 0);
      if (cells.length < 2 || cells.some((x) => x.c.colSpan > 1 || getComputedStyle(x.c).display !== 'table-cell')) continue;
      const off = cells.find((x) => !edges.some((e) => Math.abs(e.left - x.r.left) < 4) && x.r.left > edges[0].left + 4);
      if (off || cells.length > edges.length) {
        out.breaks.push(`${sel(table)}: a ${row.parentElement.tagName.toLowerCase()} row has ${cells.length} visible cells under ${edges.length} column headings, so its figures sit under the wrong headings`);
        break;
      }
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

  // Visible running text, to find content that a narrow width hides instead of reflowing (R18).
  // Navigation and aria-hidden decoration are left out: a collapsed menu is not lost content.
  const texts = [];
  const tt = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (tt.nextNode() && texts.length < 3000) {
    const t = tt.currentNode;
    const v = t.textContent.replace(/\s+/g, ' ').trim();
    const p = t.parentElement;
    if (v.length < 2 || !p || p.closest('nav, script, style, noscript, template, [aria-hidden="true"]') || !visible(p)) continue;
    texts.push(v);
  }
  out.texts = texts;

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
    // `tag[type] name-or-id | label`: the label lets a field that gained a name or a better type still match.
    fields: [...document.querySelectorAll('input, select, textarea')].map((f) => {
      const label = (f.labels?.[0]?.textContent || f.getAttribute('aria-label') || f.getAttribute('placeholder') || '').trim().replace(/\s+/g, ' ').slice(0, 60);
      return `${f.tagName.toLowerCase()}[${f.type || ''}] ${f.name || f.id || ''}${label ? ' | ' + label : ''}`;
    }),
    buttons: [...document.querySelectorAll('button, [role=button], input[type=submit]')].map((b) => txt(b) || b.value || ''),
    handlers: [...document.querySelectorAll('[onclick], [onsubmit], [onchange], form[action]')].map((e) => `${e.tagName.toLowerCase()} ${e.getAttribute('action') || ''}`.trim()),
    headings: [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => `${h.tagName.toLowerCase()} ${txt(h)}`),
  };
}

// F02: each focusable element is focused in turn and compared before and after. The indication may also be drawn on a
// part around it: a wrapper or label (`:focus-within`, `label:has(input:focus-visible)`) or a following sibling (the
// visible box of a visually hidden input, `input:focus-visible + .box` or `~ .box`). A part counts only if it holds no
// other control (a ring on a whole form or nav does not show which field or link has focus) and, after focus, is shown
// and draws something new: an outline or border where one is drawn, a box-shadow, a fill, an underline.
async function focusCheck(page) {
  return page.evaluate(async () => {
    const SEL = 'a[href], button, input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"])';
    const els = [...document.querySelectorAll(SEL)].slice(0, 20);
    // Right after focus a transition still reads its start value; read the end values instead.
    const still = document.createElement('style');
    still.textContent = '*,*::before,*::after{transition:none!important}';
    document.head.appendChild(still);
    const line = (w, s, rest) => (parseFloat(w) > 0 && !/none|hidden/.test(s) ? `${w} ${s} ${rest}` : '');
    const drawn = (e) => {
      const c = getComputedStyle(e);
      return [line(c.outlineWidth, c.outlineStyle, `${c.outlineColor} ${c.outlineOffset}`), ...['Top', 'Right', 'Bottom', 'Left'].map((d) => line(c[`border${d}Width`], c[`border${d}Style`], c[`border${d}Color`])),
        c.boxShadow, c.backgroundColor, c.backgroundImage, c.textDecorationLine].join('|');
    };
    const shown = (e) => {
      const r = e.getBoundingClientRect();
      if (r.width < 2 || r.height < 2 || getComputedStyle(e).visibility === 'hidden') return false;
      for (let a = e; a; a = a.parentElement) if (+getComputedStyle(a).opacity < 0.05) return false;
      return true;
    };
    const bad = [];
    for (const el of els) {
      const other = (x) => x !== el && x.matches(SEL) && !x.disabled && x.getClientRects().length > 0;
      const alone = (p) => !other(p) && ![...p.querySelectorAll(SEL)].some(other);
      const parts = [];
      for (const l of el.labels || []) if (alone(l)) parts.push(l, ...l.children);
      for (let a = el.parentElement, k = 0; a && a !== document.body && k < 3 && alone(a); a = a.parentElement, k++) parts.push(a);
      for (let s = el.nextElementSibling, k = 0; s && k < 3; s = s.nextElementSibling, k++) if (alone(s)) parts.push(s);
      const watch = [...new Set(parts)].filter((p) => p !== el);
      const look = () => { const c = getComputedStyle(el); return [c.outlineStyle, c.outlineWidth, c.outlineColor, c.boxShadow, c.borderColor, c.backgroundColor, c.textDecorationLine].join('|'); };
      el.blur();
      const before = look(), was = watch.map(drawn);
      el.focus({ focusVisible: true });
      if (document.activeElement !== el) continue;
      const after = look();
      const c = getComputedStyle(el);
      const outlined = c.outlineStyle !== 'none' && parseFloat(c.outlineWidth) > 0;
      const around = watch.some((p, i) => drawn(p) !== was[i] && shown(p));
      if (before === after && !outlined && !around) bad.push((el.id ? '#' + el.id : el.tagName.toLowerCase()) + ' ' + (el.textContent || '').trim().slice(0, 30));
      el.blur();
    }
    still.remove();
    return bad;
  });
}

// F01 in interactive states: text inside a control must keep its contrast on hover and on keyboard focus.
// Transitions are switched off so the state is measured at its end value.
function stateTexts(i) {
  // Any CSS color (rgb, color(srgb …) from color-mix, oklch …) resolved through a 1×1 canvas.
  const cv = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  const parse = (c) => {
    if (!c || c === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
    const m = c.match(/^rgba?\(([^)]+)\)$/);
    if (m) {
      const p = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat);
      return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] };
    }
    cv.clearRect(0, 0, 1, 1);
    cv.fillStyle = '#000'; cv.fillStyle = c;
    cv.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = cv.getImageData(0, 0, 1, 1).data;
    return { r, g, b, a: a / 255 };
  };
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const blend = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
  const bgOf = (el) => {
    const layers = [];
    for (let e = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.backgroundImage !== 'none') return null;
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; }
    }
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (const c of layers.reverse()) base = blend(c, base);
    return base;
  };
  const root = document.querySelector(`[data-dn-i="${i}"]`);
  if (!root) return [];
  const out = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode() && out.length < 4) {
    const t = walker.currentNode;
    if (!t.textContent.trim()) continue;
    const el = t.parentElement;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    const fg = parse(cs.color), bg = bgOf(el);
    if (!fg || !bg) continue;
    const L1 = lum(blend(fg, bg)), L2 = lum(bg);
    const size = parseFloat(cs.fontSize);
    const large = size >= 24 || (size >= 18.66 && +cs.fontWeight >= 700);
    out.push({ text: t.textContent.trim().slice(0, 30), ratio: +((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)).toFixed(2), need: large ? 3 : 4.5 });
  }
  return out;
}

async function stateContrast(page) {
  await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}' }).catch(() => {});
  const n = await page.evaluate(() => {
    const els = [...document.querySelectorAll('a[href], button, [role=button], [role=tab], summary, input[type=submit], input[type=button], label:has(> input[type=radio]), label:has(> input[type=checkbox])')]
      .filter((e) => !e.matches('[disabled], [aria-disabled="true"]'))
      .filter((e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden'; })
      .slice(0, 40);
    els.forEach((e, i) => e.setAttribute('data-dn-i', i));
    return els.length;
  });
  const bad = [];
  const seen = new Set();
  for (let i = 0; i < n && bad.length < 10; i++) {
    const rest = await page.evaluate(stateTexts, i);
    const okAtRest = (t) => { const r = rest.find((x) => x.text === t.text); return !r || r.ratio >= r.need; };
    const loc = page.locator(`[data-dn-i="${i}"]`);
    const hovered = await loc.hover({ timeout: 1000 }).then(() => true).catch(() => false);
    if (hovered) {
      for (const t of await page.evaluate(stateTexts, i)) {
        if (t.ratio < t.need && okAtRest(t) && !seen.has('h' + t.text)) { seen.add('h' + t.text); bad.push({ state: 'hover', ...t }); }
      }
      await page.mouse.move(0, 0);
    }
    const focused = await page.evaluate((k) => { const e = document.querySelector(`[data-dn-i="${k}"]`); e.focus({ focusVisible: true }); return document.activeElement === e; }, i);
    if (focused) {
      for (const t of await page.evaluate(stateTexts, i)) {
        if (t.ratio < t.need && okAtRest(t) && !seen.has('f' + t.text)) { seen.add('f' + t.text); bad.push({ state: 'focus', ...t }); }
      }
      await page.evaluate(() => document.activeElement?.blur());
    }
  }
  return bad;
}

// R21: text drawn on top of other text (a totals row that collapses, a label under a button).
// Each line box is clipped by its clipping ancestors first, so visually hidden and scrolled-away text don't count.
function overlaps() {
  const sel = (el) => (el.id ? `#${el.id}` : el.tagName.toLowerCase() + [...el.classList].slice(0, 2).map((c) => '.' + c).join(''));
  const boxes = [];
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (tw.nextNode()) {
    const t = tw.currentNode;
    if (!t.data.trim()) continue;
    const el = t.parentElement;
    if (!el || el.closest('[aria-hidden="true"], script, style, noscript, svg')) continue;
    if (el.checkVisibility && !el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true, contentVisibilityAuto: true })) continue;
    const clips = [];
    for (let a = el; a && a !== document.body; a = a.parentElement) {
      const c = getComputedStyle(a);
      if (c.overflowX !== 'visible' || c.overflowY !== 'visible' || c.clip !== 'auto' || c.clipPath !== 'none') {
        if (/inset\(50%|circle\(0|rect\(0/.test(c.clipPath)) { clips.push({ left: 0, right: 0, top: 0, bottom: 0 }); break; }
        clips.push(a.getBoundingClientRect());
      }
    }
    // Content scrolls under fixed and sticky bars by design; only text in the same layer can collide.
    let layer = null;
    for (let a = el; a && a !== document.body; a = a.parentElement) {
      if (/fixed|sticky/.test(getComputedStyle(a).position)) { layer = a; break; }
    }
    const rg = document.createRange();
    rg.selectNodeContents(t);
    for (const r of rg.getClientRects()) {
      // The content box of a large face runs well past its glyphs; keep the middle 60% as the inked band.
      const pad = r.height * 0.2;
      let L = r.left, R = r.right, T = r.top + pad, B = r.bottom - pad;
      for (const c of clips) { L = Math.max(L, c.left); R = Math.min(R, c.right); T = Math.max(T, c.top); B = Math.min(B, c.bottom); }
      if (R - L > 2 && B - T > 3) boxes.push({ el, t, layer, L, R, T, B, txt: t.data.trim().slice(0, 30) });
    }
  }
  boxes.sort((a, b) => a.T - b.T);
  const out = [];
  for (let i = 0; i < boxes.length && out.length < 5; i++) {
    const a = boxes[i];
    for (let j = i + 1; j < boxes.length && boxes[j].T < a.B; j++) {
      const c = boxes[j];
      if (a.t === c.t || a.layer !== c.layer) continue;
      const ix = Math.min(a.R, c.R) - Math.max(a.L, c.L), iy = Math.min(a.B, c.B) - Math.max(a.T, c.T);
      if (ix <= 2 || iy <= 2) continue;
      if ((ix * iy) / Math.min((a.R - a.L) * (a.B - a.T), (c.R - c.L) * (c.B - c.T)) < 0.25) continue;
      out.push(`"${a.txt}" (${sel(a.el)}) overlaps "${c.txt}" (${sel(c.el)})`);
      break;
    }
  }
  return out;
}

// R31: Japanese text that breaks inside a phrase. Runs in the page at rest. A block's inline text is read as runs (the
// text under its inline elements; a <br>, a nested block or an atomic inline ends a run), and the characters' boxes show
// where its lines start. Only short text counts: a block of one or two lines, or a heading, button, label, nav item,
// table cell, dt/dd, caption or legend; running text of three or more lines may break between any characters (JLReq).
// A break counts where the browser's own auto-phrase segmentation would not make it: a probe sets the run after a 1px
// spacer, exactly as wide as the text before the break, and a phrase that straddles the break moves down whole (the
// spacer keeps a first phrase from being split as too wide for its line). Also counted: a particle after a closing
// bracket (（土）|の回), which auto-phrase splits, and a wrap of a Japanese label of up to 14 characters that is not a
// heading when it leaves two characters or fewer on the label's last line (予約を|確認, 茶の|色). A break at a space or
// a <wbr>, after 、。・ and the like, or before an opening bracket is between phrases. Text whose language is not Japanese is not read, and nothing is measured where the browser has no
// auto-phrase.
function jaBreaks() {
  const found = [];
  if (!(window.CSS && CSS.supports('word-break', 'auto-phrase'))) return found;
  const JA = /[\u3000-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff01-\uff9f]/; // kana, kanji, CJK and full-width forms
  const WORD = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/; // kana and kanji
  const KANA = /[\u3040-\u30ff]/;
  const AFTER = /[、。，．！？：；・…‥!?]/; // a break after these is between phrases
  const BEFORE = /[（「『【〔〈《［｛]/; // and so is a break before these
  const CLOSE = /[）」』】〕〉》］｝)\]]/;
  const HIRA = /[\u3041-\u309f]/;
  // Text shown on screen is read even when aria-hidden (a legend drawn for the eye breaks like any other text).
  const SKIP = 'script, style, noscript, template, textarea, select, option, pre, code, kbd, samp, svg, math';
  const ATOMIC = /^(IMG|INPUT|SELECT|TEXTAREA|BUTTON|VIDEO|AUDIO|CANVAS|IFRAME|OBJECT|EMBED|METER|PROGRESS|svg|math)$/;
  const SHORT = 'h1, h2, h3, h4, h5, h6, button, label, legend, caption, figcaption, th, td, dt, dd, summary, nav, [role=button], [role=tab], [role=link], [role=menuitem], [role=heading], [role=cell], [role=gridcell], [role=columnheader], [role=rowheader]';
  const sel = (el) => {
    if (el.id) return `#${el.id}`;
    const cls = [...el.classList].slice(0, 2).join('.');
    return el.tagName.toLowerCase() + (cls ? '.' + cls : '');
  };
  const vw = document.documentElement.clientWidth;
  const memo = new Map();
  const style = (el) => { let c = memo.get(el); if (!c) memo.set(el, (c = getComputedStyle(el))); return c; };
  const flows = (el) => !ATOMIC.test(el.tagName) && /^(inline|contents|ruby|ruby-base|ruby-base-container)$/.test(style(el).display);
  const blockOf = (el) => { let e = el; while (e !== document.body && e.parentElement && flows(e)) e = e.parentElement; return e; };
  const blocks = new Set();
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (tw.nextNode()) {
    const t = tw.currentNode, p = t.parentElement;
    if (p && WORD.test(t.data) && !p.closest(SKIP)) blocks.add(blockOf(p));
  }
  if (!blocks.size) return found;
  // The probe: a run set after a 1px spacer in a box exactly as wide as the text before the break (inline !important,
  // so page rules on every element do not reach it).
  const probe = document.createElement('dn-probe');
  probe.setAttribute('lang', 'ja');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText = ['display:block', 'position:absolute', 'left:-30000px', 'top:0', 'visibility:hidden', 'contain:layout style', 'width:max-content', 'margin:0', 'padding:0', 'border:0',
    'font:16px/2 sans-serif', 'letter-spacing:0', 'word-spacing:0', 'font-kerning:none', 'font-feature-settings:normal', 'text-transform:none', 'text-indent:0', 'white-space:normal', 'word-break:auto-phrase',
    'line-break:strict', 'overflow-wrap:normal', 'hyphens:manual', 'text-wrap:wrap', 'text-spacing-trim:space-all', 'text-autospace:no-autospace', 'writing-mode:horizontal-tb', 'direction:ltr'].map((d) => d + ' !important').join(';');
  const gap = document.createElement('dn-gap');
  gap.style.cssText = 'display:inline-block !important;width:1px !important;height:1em !important;margin:0 !important;padding:0 !important';
  const ptext = document.createTextNode('');
  probe.append(gap, ptext);
  const pr = document.createRange();
  const at = (i) => { pr.setStart(ptext, i); pr.setEnd(ptext, i + ((ptext.data.charCodeAt(i) & 0xfc00) === 0xd800 ? 2 : 1)); return [...pr.getClientRects()].find((x) => x.width > 0); };
  const cy = (r) => (r.top + r.bottom) / 2;
  const cache = new Map();
  // Whether auto-phrase would break the run before index k (p is the last visible character before it).
  const phraseBreak = (s, p, k) => {
    const key = `${k}\u0001${s}`;
    if (cache.has(key)) return cache.get(key);
    if (!probe.isConnected) document.documentElement.appendChild(probe);
    ptext.data = s;
    probe.style.setProperty('width', 'max-content', 'important');
    const left = probe.getBoundingClientRect().left;
    const rk = at(k);
    let ok = true;
    if (rk) {
      probe.style.setProperty('width', `${rk.left - left + 0.5}px`, 'important');
      const first = s.search(/\S/);
      const g = gap.getBoundingClientRect(), r0 = at(first), rp = at(p), rn = at(k);
      ok = !!(r0 && rp && rn) && Math.abs(cy(r0) - cy(g)) < 16 && Math.abs(cy(rp) - cy(r0)) < 16 && cy(rn) - cy(rp) > 16;
    }
    cache.set(key, ok);
    return ok;
  };
  const rg = document.createRange();
  try {
    for (const B of blocks) {
      const br = B.getBoundingClientRect();
      if (br.width <= 2 || br.height <= 2 || br.right <= 0 || br.left >= vw) continue;
      if (B.checkVisibility && !B.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) continue;
      const lang = (B.closest('[lang]')?.getAttribute('lang') || '').toLowerCase();
      if (lang ? !/^ja\b/.test(lang) : !KANA.test(B.textContent)) continue;
      const cs = style(B);
      if (!/^horizontal/.test(cs.writingMode) || cs.direction === 'rtl') continue;
      let clipped = false;
      for (let a = B; a && a !== document.body && !clipped; a = a.parentElement) clipped = /rect\(0/.test(style(a).clip) || /inset\(50%|circle\(0/.test(style(a).clipPath);
      if (clipped) continue;
      // Runs of inline text, with the <wbr> opportunities in them.
      const runs = [];
      let cur = null;
      const end = () => { if (cur && cur.chars.some((ch) => /\S/.test(ch))) runs.push(cur); cur = null; };
      const walk = (n) => {
        for (let c = n.firstChild; c; c = c.nextSibling) {
          if (c.nodeType === 3) {
            const nl = /^(pre|pre-wrap|pre-line|break-spaces)$/.test(style(c.parentElement).whiteSpace);
            for (let i = 0; i < c.data.length; i++) {
              if (nl && c.data[i] === '\n') { end(); continue; }
              if (!cur) cur = { chars: [], node: [], off: [], wbr: new Set() };
              cur.chars.push(c.data[i]); cur.node.push(c); cur.off.push(i);
            }
          } else if (c.nodeType === 1) {
            if (c.tagName === 'BR') end();
            else if (c.tagName === 'WBR') { if (cur) cur.wbr.add(cur.chars.length); }
            else if (c.tagName === 'RT' || c.tagName === 'RP' || style(c).display === 'none') continue;
            else if (c.matches(SKIP) || !flows(c)) end();
            else walk(c);
          }
        }
      };
      walk(B);
      end();
      if (!runs.length) continue;
      // Lines of the block, from its text boxes (boxes that overlap by half their height share a line).
      const rects = [];
      for (const t of new Set(runs.flatMap((r) => r.node))) {
        rg.selectNodeContents(t);
        for (const r of rg.getClientRects()) if (r.width > 0.5 && r.height > 0.5) rects.push(r);
      }
      rects.sort((a, b) => a.top - b.top);
      let lines = 0, band = null;
      for (const r of rects) if (!band || Math.min(r.bottom, band.bottom) - Math.max(r.top, band.top) < 0.5 * Math.min(r.height, band.height)) { lines++; band = r; }
      if (lines < 2) continue;
      const bare = runs.map((r) => r.chars.join('')).join('').replace(/\s+/g, '');
      // A label, not a heading: a short heading may wrap between phrases (text-wrap: balance does just that).
      const heading = !!B.closest('h1, h2, h3, h4, h5, h6, [role=heading]');
      const label = !heading && bare.length <= 14 && [...bare].filter((ch) => WORD.test(ch)).length >= 2;
      if (!(lines <= 2 || label || B.matches('a[href]') || B.closest(SHORT))) continue;
      const quotes = [];
      let phrase = false;
      // A label's wrap between phrases counts only when it leaves two characters or fewer on the block's last line, so the
      // lines are followed across the runs: line is the line of the latest character and onLast the characters on it.
      const orphans = [];
      let line = 0, onLast = 0, last = null;
      const newLine = (r, q) => cy(r) > q.bottom - 1 || (r.left < q.left - 1 && r.top > q.top + 1);
      for (const run of runs) {
        const T = run.chars;
        const jp = T.some((ch) => WORD.test(ch));
        if (!jp && !label) continue;
        const s = T.join('');
        let prev = null, p = -1;
        for (let i = 0; i < T.length; i++) {
          if (/\s/.test(T[i])) continue;
          const pair = (T[i].charCodeAt(0) & 0xfc00) === 0xd800 && i + 1 < T.length && run.node[i + 1] === run.node[i];
          rg.setStart(run.node[i], run.off[i]);
          rg.setEnd(run.node[i], run.off[i] + (pair ? 2 : 1));
          const r = [...rg.getClientRects()].find((x) => x.width > 0);
          if (r && last && newLine(r, last)) { line++; onLast = 0; }
          if (r) { onLast++; last = r; }
          if (jp && r && prev && newLine(r, prev)) {
            // A new line starts at i. Breaks at a space, at a <wbr>, in Latin text, and after or before punctuation are fine.
            let why = '';
            const a = T[p], b = T[i];
            const spaced = T.slice(p + 1, i).some((ch) => /\s/.test(ch));
            const wbr = [...run.wbr].some((w) => w > p && w <= i);
            if (!spaced && !wbr && (JA.test(a) || JA.test(b)) && !AFTER.test(a) && !BEFORE.test(b)) {
              if (CLOSE.test(a)) why = HIRA.test(b) ? 'phrase' : '';
              else if (!phraseBreak(s, p, i)) why = 'phrase';
              else if (label) why = 'label';
            }
            if (why) {
              // About eight characters before the break and six after, never cutting a surrogate pair.
              const low = (j) => (s.charCodeAt(j) & 0xfc00) === 0xdc00;
              let from = Math.max(0, i - 8), to = Math.min(s.length, i + 6);
              if (low(from)) from--;
              if (low(to)) to++;
              const before = s.slice(from, i).replace(/\s+/g, ' ').trimStart(), after = s.slice(i, to).replace(/\s+/g, ' ').trimEnd();
              const quote = `${from > 0 ? '…' : ''}${before}|${after}${to < s.length ? '…' : ''}`;
              if (why === 'label') orphans.push({ line, quote });
              else { phrase = true; quotes.push(quote); }
            }
          }
          if (r) { prev = r; p = i; }
          if (pair) i++;
        }
      }
      // The label's wrap into its last line, when that line holds two characters or fewer.
      if (onLast <= 2) for (const o of orphans) if (o.line === line) quotes.push(o.quote);
      if (!quotes.length) continue;
      const what = heading ? 'a heading' : B.closest('button, [role=button]') || B.closest('a[href]') ? 'a button or link'
        : B.closest('label') ? 'a label' : B.closest('nav') ? 'a nav item' : B.closest('th, td, [role=cell], [role=gridcell], [role=columnheader], [role=rowheader]') ? 'a table cell'
          : B.closest('dt, dd') ? `a ${B.closest('dt, dd').tagName.toLowerCase()}` : B.closest('caption, figcaption, legend, summary') ? `a ${B.closest('caption, figcaption, legend, summary').tagName.toLowerCase()}` : 'text';
      found.push({ sel: sel(B), kind: phrase ? 'phrase' : 'label', what, lines, chars: bare.length, orphan: onLast, quotes });
    }
  } finally {
    probe.remove();
  }
  return found;
}

// R30: the action color on things nobody presses. Runs in the page at rest, before any hover or focus. The action color
// is the fill of the first filled action R25 finds that has a hue; a neutral fill (ink, white, grey) is shared with text
// by design and is not checked. A mark is an element outside every control whose text, fill, border, ring, underline,
// ::before/::after or SVG paint is that color: a state, a data mark, or decoration. Not counted: controls and what they
// hold (links among them), the brand mark, focus rings, the current selection (aria-current other than a date or time,
// aria-selected, the box a checked input draws, nav, tab, radio and listbox groups), and fills of 40,000px² or more
// (a band, a surface, the signature's ground; counted marks are dots, badges, seals and markers of a few thousand px²).
// Returns the marks with the component each sits in; Node fires at two marks.
function actionMarks(filled) {
  const cv = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  const parse = (c) => {
    if (!c || c === 'transparent' || c === 'none') return { r: 0, g: 0, b: 0, a: 0 };
    const m = c.match(/^rgba?\(([^)]+)\)$/);
    if (m) {
      const p = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat);
      return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] };
    }
    cv.clearRect(0, 0, 1, 1);
    cv.fillStyle = '#000'; cv.fillStyle = c;
    cv.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = cv.getImageData(0, 0, 1, 1).data;
    return { r, g, b, a: a / 255 };
  };
  const blend = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
  const seen = new Map();
  const bgOf = (el) => {
    if (seen.has(el)) return seen.get(el);
    const layers = [];
    for (let e = el; e; e = e.parentElement) {
      const c = parse(getComputedStyle(e).backgroundColor);
      if (c.a > 0) { layers.push(c); if (c.a >= 1) break; }
    }
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (const c of layers.reverse()) base = blend(c, base);
    seen.set(el, base);
    return base;
  };
  // A paint as it shows over what is behind it; a transparent one shows nothing of its own.
  const over = (c, bg) => (c.a > 0 ? blend(c, bg) : null);
  // OKLab, so that distance and hue follow what the eye sees.
  const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const lab = (c) => {
    const R = lin(c.r), G = lin(c.g), B = lin(c.b);
    const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
    const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
    const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
    const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, b = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
    return { L, a, b, C: Math.hypot(a, b), h: (Math.atan2(b, a) * 180) / Math.PI };
  };
  const hueGap = (x, y) => { const d = Math.abs(x.h - y.h) % 360; return d > 180 ? 360 - d : d; };
  const rgbOf = (v) => ({ r: v[0], g: v[1], b: v[2], a: 1 });
  const dist = (x, y) => Math.hypot(x.L - y.L, x.a - y.a, x.b - y.b);
  // The first filled action (not a toggle, tab or current item) with a hue (chroma 0.05 or more) that stands out from what
  // is behind it: 2:1 in lightness, as R25 asks, or by color alone (ΔE 0.15 or more in OKLab).
  const action = filled.find((f) => { const c = lab(rgbOf(f.rgb)); return !f.toggle && c.C >= 0.05 && (f.strong || dist(c, lab(rgbOf(f.behind))) >= 0.15); });
  if (!action) return null;
  const A = lab(rgbOf(action.rgb));
  // Near the action color: the same color (ΔE ≤ 0.04: rounding, a slight alpha); a shade of it (hue within 12°, at least
  // 60% of its chroma, ΔE ≤ 0.12: a pressed or text variant); or, for a fill, a tint that still reads as it (lighter, hue
  // within 15°, at least 30% of its chroma and 0.04: a badge or chip). A paler wash reads as a tinted surface, and a status
  // red 20° away is another color.
  const near = (c, tint) => {
    if (!c || c.a <= 0) return false;
    const P = lab(c);
    const d = dist(P, A);
    if (d <= 0.04) return true;
    if (P.C >= 0.6 * A.C && hueGap(P, A) <= 12 && d <= 0.12) return true;
    return !!tint && P.L > A.L && P.C >= Math.max(0.04, 0.3 * A.C) && hueGap(P, A) <= 15;
  };
  const LARGE = 40000;
  const CONTROL = 'a[href], button, input, select, textarea, label, summary, [contenteditable]:not([contenteditable="false"]), [role=button], [role=link], [role=tab], [role=switch], [role=checkbox], [role=radio], [role=menuitem], [role=menuitemcheckbox], [role=menuitemradio], [role=option], [role=slider], [role=spinbutton], [role=combobox], [role=treeitem]';
  // A focusable element is a control unless it is a scroll box or a region that holds content.
  const holder = /^(main|section|article|aside|nav|header|footer|table|figure|pre|dialog|form|ul|ol|dl)$/i;
  const region = /^(region|group|tabpanel|dialog|alertdialog|document|article|list|table|grid|feed|log|status|img|figure|main|complementary)$/;
  const control = (el) => {
    if (el.closest(CONTROL)) return true;
    for (let e = el.closest('[tabindex]'); e; e = e.parentElement && e.parentElement.closest('[tabindex]')) {
      if (e.tabIndex < 0 || holder.test(e.tagName) || region.test(e.getAttribute('role') || '')) continue;
      const cs = getComputedStyle(e);
      if (!/auto|scroll/.test(cs.overflowX + cs.overflowY)) return true;
    }
    return false;
  };
  const SELECTED = '[aria-current]:not([aria-current="false"]):not([aria-current="date"]):not([aria-current="time"]), [aria-selected="true"], nav, [role=tablist], [role=radiogroup], [role=listbox], [role=menubar], [role=menu], [role=toolbar], [role=tree]';
  const BRAND = '[class*="logo" i], [class*="brand" i], [class*="wordmark" i], [id*="logo" i], [id*="brand" i], [aria-label*="logo" i]';
  // The box a checked input draws beside it, or a card that wraps one checked input.
  const checkedBox = (el) => {
    for (let e = el, k = 0; e && e !== document.body && k < 3; e = e.parentElement, k++) {
      for (let s = e.previousElementSibling; s; s = s.previousElementSibling) if (s.matches('input:checked')) return true;
      const fields = e.querySelectorAll('input, select, textarea');
      if (fields.length === 1 && fields[0].matches(':checked')) return true;
    }
    return false;
  };
  // A color as computed styles write it (rgb() for most, oklch() or color() when the author used them).
  const COLOR = /((?:rgba?|hsla?|color|oklch|oklab|lab|lch)\([^)]*\)|#[0-9a-f]{3,8}\b)/i;
  // Hard rings and bars (blur of 2px or less, with a spread or an offset); soft elevation shadows are not marks.
  const rings = (shadow, back) => {
    if (!shadow || shadow === 'none') return [];
    const out = [];
    for (const s of shadow.split(/,(?![^(]*\))/)) {
      const col = s.match(COLOR);
      if (!col) continue;
      const [x = 0, y = 0, blur = 0, spread = 0] = (s.replace(col[0], '').match(/-?[\d.]+px/g) || []).map(parseFloat);
      if (blur <= 2 && (spread >= 1 || Math.abs(x) >= 1 || Math.abs(y) >= 1)) out.push(over(parse(col[0]), back));
    }
    return out;
  };
  const gradient = (img) => (img && img !== 'none' ? [...img.matchAll(new RegExp(COLOR.source, 'gi'))].map((m) => parse(m[1])) : []);
  const box = (cs, back, size, ring) => {
    const k = [];
    const fill = parse(cs.backgroundColor);
    if (size < LARGE && (near(over(fill, back), true) || gradient(cs.backgroundImage).some((c) => c.a > 0.5 && near(c, true)))) k.push('fill');
    for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
      if (parseFloat(cs[`border${side}Width`]) >= 1 && !/none|hidden/.test(cs[`border${side}Style`]) && near(over(parse(cs[`border${side}Color`]), back))) { k.push('border'); break; }
    }
    if (ring && cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 1 && near(over(parse(cs.outlineColor), back))) k.push('outline');
    if (ring && rings(cs.boxShadow, back).some((c) => near(c))) k.push('ring');
    return k;
  };
  const sel = (el) => {
    if (el.id) return `#${el.id}`;
    const cls = [...el.classList].slice(0, 2).join('.');
    return el.tagName.toLowerCase() + (cls ? '.' + cls : '');
  };
  const ownText = (el) => [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.data).join('').replace(/\s+/g, ' ').trim();
  const vw = document.documentElement.clientWidth;
  const shown = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width + r.height < 2 || r.right <= 0 || r.left >= vw) return null;
    if (el.checkVisibility && !el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) return null;
    return r;
  };
  const COMP = 'section, article, aside, header, footer, nav, form, fieldset, dialog, figure, table, ul, ol, dl, details, [role=region], [role=group], [role=list], [role=table], [role=grid], [role=dialog], [role=status], [role=complementary]';
  const compOf = (el) => {
    const c = el.parentElement && el.parentElement.closest(COMP);
    if (c) return c;
    let e = el;
    while (e.parentElement && e.parentElement !== document.body && e.parentElement.tagName !== 'MAIN') e = e.parentElement;
    return e;
  };
  const found = new Map(); // element (an SVG counts as one) -> paints that matched
  const viaText = new Set();
  let chars = 0, inked = 0;
  for (const el of document.body.querySelectorAll('*')) {
    if (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|BR|WBR)$/i.test(el.tagName)) continue;
    let svg = el instanceof SVGElement ? (el.tagName.toLowerCase() === 'svg' && !el.ownerSVGElement ? null : el.ownerSVGElement) : null;
    while (svg && svg.ownerSVGElement) svg = svg.ownerSVGElement;
    if (el instanceof SVGElement && el.tagName.toLowerCase() === 'svg' && !el.ownerSVGElement) continue; // the root is judged by its shapes
    const r = shown(el);
    if (!r) continue;
    const cs = getComputedStyle(el);
    const text = svg ? '' : ownText(el);
    const isControl = control(el);
    if (text && !isControl) {
      chars += text.length;
      if (near(over(parse(cs.color), bgOf(el)))) inked += text.length;
    }
    if (isControl) continue;
    let k = [];
    if (svg) {
      const sr = svg.getBoundingClientRect();
      if (sr.width * sr.height >= LARGE) continue;
      for (const p of ['fill', 'stroke']) if (!/none|url\(/.test(cs[p]) && near(over(parse(cs[p]), bgOf(svg)), p === 'fill')) k.push(p);
    } else {
      const back = el.parentElement ? bgOf(el.parentElement) : { r: 255, g: 255, b: 255, a: 1 };
      const focused = el.matches(':focus-within');
      if (text && near(over(parse(cs.color), bgOf(el)))) k.push('text');
      if (text && cs.textDecorationLine !== 'none' && near(over(parse(cs.textDecorationColor), bgOf(el)))) k.push('underline');
      k.push(...box(cs, back, r.width * r.height, !focused));
      for (const pe of ['::before', '::after']) {
        const ps = getComputedStyle(el, pe);
        if (!ps.content || /^(none|normal)$/.test(ps.content) || ps.display === 'none' || ps.visibility === 'hidden' || +ps.opacity === 0) continue;
        const size = (parseFloat(ps.width) || 0) * (parseFloat(ps.height) || 0);
        const pk = box(ps, bgOf(el), size, !focused);
        if (/^(["']).+\1$|^(counters?|attr)\(/.test(ps.content) && near(over(parse(ps.color), bgOf(el)))) pk.push('text');
        if (pk.length) k.push(pe);
      }
    }
    if (!k.length) continue;
    const at = svg || el;
    if (at.closest(SELECTED) || at.closest(BRAND) || checkedBox(at)) continue;
    // Text that only inherits the color of a marked parent is the same mark.
    if (!svg && k.every((x) => x === 'text') && el.parentElement && viaText.has(el.parentElement)) { viaText.add(el); continue; }
    if (k.includes('text')) viaText.add(el);
    found.set(at, [...new Set([...(found.get(at) || []), ...k])]);
  }
  const comps = new Map();
  const marks = [...found].map(([el, paints]) => {
    const c = compOf(el);
    if (!comps.has(c)) comps.set(c, comps.size);
    const label = (ownText(el) || el.getAttribute('aria-label') || (el.parentElement ? el.parentElement.innerText || '' : '')).replace(/\s+/g, ' ').trim().slice(0, 24);
    return { sel: sel(el), text: label, paints, comp: comps.get(c), in: sel(c) };
  });
  const hex = '#' + action.rgb.map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();
  return { action: { sel: action.sel, text: action.text, hex }, marks, chars, inked };
}

// R29: the page's arrangement at 1280 and 1920, compared in Node. Runs in the page; returns raw geometry.
// The content box is the outermost 8px columns that hold at least a tenth of the typical depth of content (text lines,
// media, controls, filled or ruled boxes; overlapping boxes count once), so a thin full-width bar, a lone logo at the
// edge, a full-bleed band, fixed overlays and aria-hidden decoration do not set the frame.
function wideLayout() {
  const vw = document.documentElement.clientWidth;
  const sy = scrollY;
  const all = [...document.querySelectorAll('body *')];
  const fixed = all.filter((e) => getComputedStyle(e).position === 'fixed');
  const away = (el) => el.closest('script, style, noscript, template, [aria-hidden="true"]') || fixed.some((f) => f.contains(el));
  const shown = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0; };
  // Elements are matched across the two widths by their place in the tree.
  const key = (el) => { const p = []; for (let e = el; e && e !== document.body && e.parentElement; e = e.parentElement) p.push([...e.parentElement.children].indexOf(e)); return p.reverse().join('.'); };
  const B = 8, cols = Array.from({ length: Math.ceil(vw / B) + 1 }, () => []);
  const paint = (r) => {
    const l = Math.max(0, r.left), rr = Math.min(vw, r.right);
    if (rr - l < 1 || r.height < 1) return;
    for (let i = Math.floor(l / B); i * B < rr; i++) cols[i].push([r.top + sy, r.bottom + sy]);
  };
  const sizes = [];
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (tw.nextNode()) {
    const t = tw.currentNode, p = t.parentElement;
    if (!t.data.trim() || !p || away(p) || !shown(p)) continue;
    const rg = document.createRange();
    rg.selectNodeContents(t);
    for (const r of rg.getClientRects()) if (r.width > 0) paint(r);
    sizes.push([parseFloat(getComputedStyle(p).fontSize), t.data.trim().length]);
  }
  const figs = [], rows = [];
  for (const el of all) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'svg' ? el.parentElement && el.parentElement.closest('svg') : el.closest('svg')) continue;
    if (away(el) || !shown(el)) continue;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const media = /^(img|svg|canvas|video|iframe|object|embed)$/.test(tag) || el.getAttribute('role') === 'img' || /url\(/.test(cs.backgroundImage);
    const ruled = ['Left', 'Right', 'Top', 'Bottom'].some((s) => parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== 'none');
    const filled = !/^(rgba\(0, 0, 0, 0\)|transparent)$/.test(cs.backgroundColor) || cs.backgroundImage !== 'none' || cs.boxShadow !== 'none';
    if ((media || ruled || filled || /^(input|select|textarea|button)$/.test(tag)) && r.width < vw * 0.95) paint(r);
    // A figure that fills the viewport grows with it at every width; only one inside the page's frame can be planned larger.
    if (media && r.width * r.height >= 160 * 120 && r.width < vw * 0.95) figs.push({ key: key(el), w: Math.round(r.width), h: Math.round(r.height) });
    // Tracks: the in-flow children of each box at least 200px wide, as [index, left, top, right, bottom]. Node decides
    // which children are blocks from their size at 1920 and counts how many of them sit side by side at each width.
    if (rows.length < 2000 && r.width >= 200 && !/^(inline|contents)$/.test(cs.display) && el.children.length) {
      const kids = [];
      [...el.children].forEach((k, i) => {
        const c = getComputedStyle(k);
        if (kids.length >= 60 || c.position === 'absolute' || c.position === 'fixed' || !shown(k)) return;
        const b = k.getBoundingClientRect();
        kids.push([i, Math.round(b.left), Math.round(b.top + sy), Math.round(b.right), Math.round(b.bottom + sy)]);
      });
      if (kids.length) rows.push({ key: key(el), w: Math.round(r.width), cell: cs.display === 'table-row', kids });
    }
  }
  const depth = cols.map((iv) => {
    iv.sort((x, y) => x[0] - y[0]);
    let d = 0, end = -Infinity;
    for (const [t, b] of iv) if (b > end) { d += b - Math.max(t, end); end = b; }
    return d;
  });
  const on = depth.filter((v) => v > 0).sort((x, y) => x - y);
  const peak = on.length ? on[Math.floor(on.length * 0.8)] : 0;
  const lo = depth.findIndex((v) => v > 0 && v >= peak * 0.1);
  let left = 0, right = 0; // no content, no box
  if (lo >= 0) { left = lo * B; for (let i = depth.length - 1; i >= 0; i--) if (depth[i] >= peak * 0.1) { right = Math.min(vw, (i + 1) * B); break; } }
  // Body type: the size that half of the visible characters are set at or below.
  sizes.sort((x, y) => x[0] - y[0]);
  const chars = sizes.reduce((a, s) => a + s[1], 0);
  let n = 0, body = 0;
  for (const [s, c] of sizes) { n += c; if (n >= chars / 2) { body = s; break; } }
  return { vw, left, right, body, figs, rows };
}

const browser = await pw.chromium.launch();
try {
  for (const width of opt.widths) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, ...(opt.tz ? { timezoneId: opt.tz } : {}) });
    const page = await ctx.newPage();
    if (opt.time) await page.clock.setFixedTime(new Date(opt.time)).catch(() => {});
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    } catch (e) {
      await page.goto(url, { waitUntil: 'load', timeout: 30000 }).catch(() => {});
    }
    // Wait for images (decoding="async" data URIs too) and web fonts, so the screenshot shows what a visitor sees.
    await page.evaluate(() => Promise.race([
      Promise.all([...document.images].map((i) => (i.complete ? i.decode() : new Promise((r) => { i.onload = i.onerror = r; })).catch(() => {})).concat(document.fonts ? [document.fonts.ready] : [])),
      new Promise((r) => setTimeout(r, 5000)),
    ])).catch(() => {});
    await page.waitForTimeout(400);
    const file = path.join(opt.out, `w${width}.png`);
    if (opt.first) {
      const first = path.join(opt.out, `w${width}-first.png`);
      await page.screenshot({ path: first });
      shots.push(first);
    }
    // With --tiles the bars go back in place before any check below, so every check measures the page as it is.
    const flattened = opt.tiles ? await page.evaluate(flattenBars) : null;
    await page.screenshot({ path: file, fullPage: true });
    shots.push(file);
    if (opt.tiles) {
      const t = await captureTiles(page, width);
      shots.push(...t.files);
      await page.evaluate(restoreBars);
      await page.waitForTimeout(50);
      capture.widths[width] = { tiles: t.files.length, page_height: t.height, truncated: t.truncated, flattened };
    }
    const m = await page.evaluate(measure, minTap);
    if ((width === 1280 || width === 1920) && opt.widths.includes(1280) && opt.widths.includes(1920)) wideAt.set(width, await page.evaluate(wideLayout));
    // Before any hover or focus moves the page: measured at the top, as the screenshot shows it.
    for (const o of await page.evaluate(overlaps)) add('R21', `@${width}px`, `${o}; text drawn over text is unreadable: give each its own space at this width`);
    // R31: short Japanese text that breaks inside a phrase, one finding per block (at most 20 per width).
    const ja = await page.evaluate(jaBreaks).catch(() => []);
    ja.slice(0, 20).forEach((j, n) => {
      const list = j.quotes.slice(0, 4).map((q) => `"${q}"`).join(', ') + (j.quotes.length > 4 ? ` and ${j.quotes.length - 4} more` : '');
      const rest = n === 19 && ja.length > 20 ? `; ${ja.length - 20} more blocks break at ${width}px` : '';
      if (j.kind === 'label') add('R31', `@${width}px ${j.sel}`, `at ${width}px the ${j.chars}-character Japanese label ${list} wraps and leaves ${j.orphan} character${j.orphan === 1 ? '' : 's'} on its last line; keep a label of up to 14 characters on one line: white-space: nowrap with room for it, or shorter copy${rest}`);
      else add('R31', `@${width}px ${j.sel}`, `at ${width}px Japanese text breaks inside a phrase: ${list} (${j.what}, ${j.lines} line${j.lines === 1 ? '' : 's'}); set word-break: auto-phrase on html:lang(ja) and never reset it to normal, and keep a compound, a name, or a figure with its unit whole with a white-space: nowrap span or a <wbr> at its real boundary, or give it room${rest}`);
    });
    // R30: the action color also marks two or more things nobody presses (one stray mark is not enough; a state repeated
    // down one table is). Skipped when the action color is the page's ink: a quarter or more of the text outside controls.
    if (width === 1280 || (!opt.widths.includes(1280) && width === opt.widths[opt.widths.length - 1])) {
      const ac = await page.evaluate(actionMarks, m.filled || []);
      const comps = ac ? new Set(ac.marks.map((x) => x.comp)).size : 0;
      if (ac && ac.inked < ac.chars * 0.25 && ac.marks.length >= 2) {
        const groups = new Map();
        for (const x of ac.marks) { const g = groups.get(x.sel) || { ...x, n: 0 }; g.n++; groups.set(x.sel, g); }
        const list = [...groups.values()].slice(0, 8).map((g) => `${g.sel}${g.text ? ` "${g.text}"` : ''}${g.n > 1 ? ` ×${g.n}` : ''}`).join(', ');
        add('R30', `@${width}px ${ac.action.sel}`, `the action color ${ac.action.hex} of "${ac.action.text}" also marks ${ac.marks.length} things nobody presses, in ${comps} component${comps === 1 ? '' : 's'}: ${list}${groups.size > 8 ? ', …' : ''}; the action color marks what is pressed and the current selection: give states a status color or a neutral mark (a current item marked with aria-current or aria-selected is not counted)`);
      }
    }
    if (m.overflow) add('F08', `@${width}px`, `Horizontal scroll: page is ${m.overflow.scrollWidth}px in a ${m.overflow.vw}px viewport (${m.overflow.culprits.join(', ')})`);
    for (const s of m.small) add('F12', `@${width}px ${s.sel}`, `${s.size}px text "${s.text}"`);
    if (width === 1280 && m.fine.length >= 3) {
      const sizes = [...new Set(m.fine.map((x) => x.size))].sort((a, b) => a - b).join('/');
      add('R20', `@${width}px`, `${m.fine.length} text block(s) carry information at ${sizes}px, e.g. ${m.fine.slice(0, 3).map((x) => `"${x.text}"`).join(', ')}; set hints, metadata, captions, table cells and errors at 14px or more`);
    }
    if (width === opt.widths[opt.widths.length - 1] || width >= 1280) {
      for (const c of m.lowContrast) add('F01', `@${width}px ${c.sel}`, `contrast ${c.ratio}:1 < ${c.need}:1 "${c.text}"`);
    }
    if (width === 1280 || (!opt.widths.includes(1280) && width === opt.widths[opt.widths.length - 1])) {
      for (const b of m.boundary) add('F01', `@${width}px ${b.sel}`, `field boundary ${b.ratio}:1 < 3:1${b.name ? ` "${b.name}"` : ''}; give the border or fill 3:1 against the surface so the field can be found`);
      for (const n of m.nameMismatch) add('F13', `@${width}px ${n.sel}`, `aria-label "${n.label}" leaves out the visible "${n.missing}"; put the visible words in the label, first (voice users say what they see)`);
    }
    if (width <= 768) for (const t of m.tap) add('F09', `@${width}px ${t.sel}`, `tap target ${t.w}×${t.h}px < ${minTap}px`);
    for (const b of m.breaks) add('R17', `@${width}px`, b);
    if (m.fold && (width === 1280 || width === 768)) add('R25', `@${width}px ${m.fold.sel}`, `the first filled action "${m.fold.text}" starts at ${m.fold.top}px, below the first screen; put the brief's primary action on the first screen (or in a sticky bar) and keep it the only filled control there`);
    for (const x of m.sidescroll) add('R24', `@${width}px ${x.sel}`, `${x.kind} hides ${x.pct}% of its width in a sideways scroll, e.g. "${x.text}"; ${x.kind === 'table' ? 'reflow rows into labelled blocks below about 640px, or keep the deciding column next to the first' : x.kind === 'code' ? 'wrap commands (white-space: pre-wrap; overflow-wrap: anywhere) or break them at flags' : 'reflow it to the width'}`);
    if (width === 1280) for (const c of m.cjkTight) add('R14', `@${width}px ${c.sel}`, `Japanese running text at line-height ${c.ratio}; body copy needs 1.7–1.9 "${c.text}"`);
    if (width === 1280 || (!look && width === opt.widths[opt.widths.length - 1])) look = m.look;
    if (width === 1280 || (!opt.widths.includes(1280) && width === opt.widths[opt.widths.length - 1])) {
      for (const b of await stateContrast(page)) add('F01', `@${width}px :${b.state}`, `contrast ${b.ratio}:1 < ${b.need}:1 on ${b.state} "${b.text}"`);
    }
    textsAt.set(width, m.texts);
    if (width === opt.widths[0]) {
      for (const src of m.brokenImg) add('N06', src, 'Broken image');
      const unfocused = await focusCheck(page);
      for (const u of unfocused.slice(0, 10)) add('F02', u, 'No visible focus change on keyboard focus');
    }
    await ctx.close();
  }

  // R18: text readable at desktop width that the narrowest width removes (display:none, zero size) instead of reflowing.
  const narrow = Math.min(...opt.widths);
  const wide = opt.widths.includes(1280) ? 1280 : Math.max(...opt.widths);
  if (narrow <= 480 && wide > narrow) {
    // Digits are ignored when matching, so a live clock or countdown that ticked between captures still counts as the same text.
    const key = (t) => t.replace(/\d/g, '0');
    const left = new Map();
    for (const t of textsAt.get(narrow) || []) left.set(key(t), (left.get(key(t)) || 0) + 1);
    const gone = [];
    for (const t of textsAt.get(wide) || []) {
      if (left.get(key(t))) left.set(key(t), left.get(key(t)) - 1);
      else gone.push(t);
    }
    // Japanese characters carry about twice the content of Latin ones.
    const weight = (t) => t.length + (t.match(/[\u3040-\u30ff\u3400-\u9fff]/g) || []).length;
    const total = gone.reduce((a, t) => a + weight(t), 0);
    if (total >= 60) {
      const sample = gone.sort((a, b) => weight(b) - weight(a)).slice(0, 2).map((t) => `"${t.slice(0, 40)}"`).join(', ');
      add('R18', `@${narrow}px`, `${gone.length} text block(s) shown at ${wide}px are hidden at ${narrow}px (${total} chars), e.g. ${sample}; reflow or collapse them behind a labeled control instead of removing them`);
    }
  }

  // R29: 1920 shows the 1280 arrangement unchanged, either centred between wide empty margins or with the same tracks
  // merely stretched. Not counted when 1920 gains something: a block that now sits beside another (a side column, one
  // more column of cards, a table column), text that 1280 does not show, a larger main figure, or larger body type.
  if (wideAt.has(1280) && wideAt.has(1920)) {
    const a = wideAt.get(1280), b = wideAt.get(1920);
    const wa = a.right - a.left, wb = b.right - b.left, ratio = wb / wa;
    const L = b.left, R = b.vw - b.right;
    const side = (kids) => { let n = 0; for (const k of kids) { const y = (k[2] + k[4]) / 2; n = Math.max(n, kids.filter((j) => j[2] <= y && j[4] >= y).length); } return n; };
    const was = new Map(a.rows.map((r) => [r.key, r]));
    const added = b.rows.some((r) => {
      const old = was.get(r.key);
      if (!old || r.w < wb * 0.3) return false;
      const big = r.kids.filter((k) => r.cell || (k[3] - k[1] >= Math.max(96, r.w * 0.08) && k[4] - k[2] >= 56));
      if (big.length < 2) return false;
      const ids = new Set(big.map((k) => k[0]));
      return side(big) > side(old.kids.filter((k) => ids.has(k[0])));
    });
    const key = (t) => t.replace(/\d/g, '0');
    const left = new Map();
    for (const t of textsAt.get(1280) || []) left.set(key(t), (left.get(key(t)) || 0) + 1);
    let gained = 0;
    for (const t of textsAt.get(1920) || []) {
      if (left.get(key(t))) left.set(key(t), left.get(key(t)) - 1);
      else gained += t.length + (t.match(/[\u3040-\u30ff\u3400-\u9fff]/g) || []).length;
    }
    // The main figure: the largest at 1280, or any at least half its area; the one that grew most counts.
    const most = Math.max(0, ...a.figs.map((f) => f.w * f.h));
    const at1920 = new Map(b.figs.map((f) => [f.key, f]));
    const figure = Math.max(1, ...a.figs.filter((f) => f.w * f.h >= most / 2 && at1920.has(f.key)).map((f) => at1920.get(f.key).w / f.w));
    const type = a.body ? b.body / a.body : 1;
    if (wa > 0 && !added && gained < 40 && figure < 1.15 && type < 1.08) {
      const box = `content ${wb}px wide (${wa}px at 1280, ×${ratio.toFixed(2)}), ${L}px and ${R}px from the edges`;
      const fix = 'from 1600px add what a reader at 1280 scrolls to find: a side column with the next step, details or the legend, one more column of cards or rows, or a larger main figure or table, inside a min-width: 1600px query';
      if (ratio <= 1.2 && Math.min(L, R) >= 200) add('R29', '@1920px', `the 1280 arrangement sits centred between empty margins: ${box}, with the same columns, figures and ${b.body}px body type; ${fix}`);
      else if (ratio >= 1.3 && Math.min(L, R) < 200) add('R29', '@1920px', `the 1280 tracks merely stretch: ${box}, with the same columns, figures and ${b.body}px body type; ${fix}`);
    }
  }

  // Reduced motion: anything still moving with the preference set?
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce', ...(opt.tz ? { timezoneId: opt.tz } : {}) });
  const page = await ctx.newPage();
  if (opt.time) await page.clock.setFixedTime(new Date(opt.time)).catch(() => {});
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
      // Links must survive by href. Fields must survive, but a field may improve: gain a name or id,
      // move from type=text to a more specific text type, or get a real label. Buttons, headings, and handlers
      // may change form but not be dropped.
      const nowLinks = (snap.links || []).map((x) => x.split(' | ')[0]);
      for (const item of before.links || []) {
        const i = nowLinks.indexOf(item.split(' | ')[0]);
        if (i === -1) add('F11', 'links', `Lost after redesign: ${item}`);
        else nowLinks.splice(i, 1);
      }
      for (const item of unmatchedFields(before.fields || [], snap.fields || [])) add('F11', 'fields', `Lost after redesign: ${item}`);
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
if (opt.json) console.log(JSON.stringify({ tool: 'design-nexus-render', url, widths: opt.widths, shots, counts, findings, look, ...(capture ? { capture } : {}) }, null, 2));
else {
  printFindings(findings, `design-nexus render: ${url}\nscreenshots: ${shots.join(', ')}`);
  if (counts.floor) console.log('\nFloor findings remain: the work is not done.');
}
process.exit(counts.floor ? 2 : 0);
