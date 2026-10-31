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
import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { printFindings, summarize, tierOf, unmatchedFields } from './lib.mjs';

const args = process.argv.slice(2);
const opt = { out: '.design-nexus/shots', widths: [320, 768, 1280, 1920], json: false, surface: null, snapshot: null, compare: null, target: null, time: null, tz: null };
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
  else opt.target = a;
}
if (!opt.target) {
  console.log('usage: node render-check.mjs <file.html|url> [--out dir] [--widths 320,768,1280] [--surface mobile] [--snapshot f.json] [--compare f.json] [--time ISO] [--tz Zone] [--json]');
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
const textsAt = new Map();

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

  const out = { overflow: null, small: [], fine: [], lowContrast: [], tap: [], brokenImg: [], breaks: [], cjkTight: [], texts: [], look: null };
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
    const rg = document.createRange();
    rg.selectNodeContents(t);
    for (const r of rg.getClientRects()) {
      // The content box of a large face runs well past its glyphs; keep the middle 60% as the inked band.
      const pad = r.height * 0.2;
      let L = r.left, R = r.right, T = r.top + pad, B = r.bottom - pad;
      for (const c of clips) { L = Math.max(L, c.left); R = Math.min(R, c.right); T = Math.max(T, c.top); B = Math.min(B, c.bottom); }
      if (R - L > 2 && B - T > 3) boxes.push({ el, t, L, R, T, B, txt: t.data.trim().slice(0, 30) });
    }
  }
  boxes.sort((a, b) => a.T - b.T);
  const out = [];
  for (let i = 0; i < boxes.length && out.length < 5; i++) {
    const a = boxes[i];
    for (let j = i + 1; j < boxes.length && boxes[j].T < a.B; j++) {
      const c = boxes[j];
      if (a.t === c.t) continue;
      const ix = Math.min(a.R, c.R) - Math.max(a.L, c.L), iy = Math.min(a.B, c.B) - Math.max(a.T, c.T);
      if (ix <= 2 || iy <= 2) continue;
      if ((ix * iy) / Math.min((a.R - a.L) * (a.B - a.T), (c.R - c.L) * (c.B - c.T)) < 0.25) continue;
      out.push(`"${a.txt}" (${sel(a.el)}) overlaps "${c.txt}" (${sel(c.el)})`);
      break;
    }
  }
  return out;
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
    await page.screenshot({ path: file, fullPage: true });
    shots.push(file);
    const m = await page.evaluate(measure, minTap);
    // Before any hover or focus moves the page: measured at the top, as the screenshot shows it.
    for (const o of await page.evaluate(overlaps)) add('R21', `@${width}px`, `${o}; text drawn over text is unreadable: give each its own space at this width`);
    if (m.overflow) add('F08', `@${width}px`, `Horizontal scroll: page is ${m.overflow.scrollWidth}px in a ${m.overflow.vw}px viewport (${m.overflow.culprits.join(', ')})`);
    for (const s of m.small) add('F12', `@${width}px ${s.sel}`, `${s.size}px text "${s.text}"`);
    if (width === 1280 && m.fine.length >= 3) {
      const sizes = [...new Set(m.fine.map((x) => x.size))].sort((a, b) => a - b).join('/');
      add('R20', `@${width}px`, `${m.fine.length} text block(s) carry information at ${sizes}px, e.g. ${m.fine.slice(0, 3).map((x) => `"${x.text}"`).join(', ')}; set hints, metadata, captions, table cells and errors at 14px or more`);
    }
    if (width === opt.widths[opt.widths.length - 1] || width >= 1280) {
      for (const c of m.lowContrast) add('F01', `@${width}px ${c.sel}`, `contrast ${c.ratio}:1 < ${c.need}:1 "${c.text}"`);
    }
    if (width <= 768) for (const t of m.tap) add('F09', `@${width}px ${t.sel}`, `tap target ${t.w}×${t.h}px < ${minTap}px`);
    for (const b of m.breaks) add('R17', `@${width}px`, b);
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
if (opt.json) console.log(JSON.stringify({ tool: 'design-nexus-render', url, widths: opt.widths, shots, counts, findings, look }, null, 2));
else {
  printFindings(findings, `design-nexus render: ${url}\nscreenshots: ${shots.join(', ')}`);
  if (counts.floor) console.log('\nFloor findings remain: the work is not done.');
}
process.exit(counts.floor ? 2 : 0);
