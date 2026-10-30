// Shared helpers for design-nexus scripts. Node 18+, no dependencies.
import fs from 'node:fs';

export const TIERS = { F: 'floor', R: 'reflex', N: 'finish' };
export const tierOf = (id) => TIERS[id[0]];

// ---------- color ----------

export function parseColor(str) {
  if (!str) return null;
  const s = str.trim().toLowerCase();
  let m = s.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
    const n = parseInt(h.slice(0, 6), 16);
    const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a };
  }
  m = s.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/);
  if (m) {
    let a = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
    return { r: +m[1], g: +m[2], b: +m[3], a };
  }
  return null;
}

const lin = (c) => {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
export const luminance = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);

export function contrast(a, b) {
  const la = luminance(a), lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export function hsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return { h: h * 60, s, l };
}

export const normHex = (hex) => {
  const c = parseColor(hex);
  if (!c) return null;
  return '#' + [c.r, c.g, c.b].map((v) => v.toString(16).padStart(2, '0')).join('');
};

// ---------- DESIGN.md tokens ----------

// Reads the ```tokens block of a DESIGN.md: one `key: value` per line.
export function readTokens(file) {
  const text = fs.readFileSync(file, 'utf8');
  const block = text.match(/```tokens\s*\n([\s\S]*?)```/);
  if (!block) return null;
  const tokens = {};
  for (const line of block[1].split('\n')) {
    const m = line.match(/^\s*([\w.-]+)\s*:\s*(.+?)\s*$/);
    if (m) tokens[m[1]] = m[2];
  }
  return tokens;
}

export function tokenColors(tokens) {
  const out = {};
  for (const [k, v] of Object.entries(tokens || {})) {
    if (/(^|\.)color\./.test(k) && parseColor(v)) out[k] = v;
  }
  return out;
}

// ---------- fonts ----------

export const OVERUSED_FONTS = [
  'inter', 'roboto', 'arial', 'helvetica', 'helvetica neue', 'open sans', 'poppins',
  'montserrat', 'lato', 'system-ui', '-apple-system', 'segoe ui',
];

export const primaryFamily = (decl) =>
  decl.split(',')[0].trim().replace(/^['"]|['"]$/g, '').toLowerCase();

// ---------- output ----------

export function summarize(findings) {
  const count = { floor: 0, reflex: 0, finish: 0, kept: 0 };
  for (const f of findings) {
    if (f.kept) count.kept++;
    else count[tierOf(f.id)]++;
  }
  return count;
}

export function printFindings(findings, header) {
  const c = summarize(findings);
  console.log(`${header}\nfloor ${c.floor} · reflex ${c.reflex} · finish ${c.finish} · kept ${c.kept}`);
  const order = { F: 0, R: 1, N: 2 };
  const sorted = [...findings].sort((a, b) => order[a.id[0]] - order[b.id[0]] || a.id.localeCompare(b.id));
  for (const f of sorted) {
    const where = f.file ? `${f.file}${f.line ? ':' + f.line : ''}` : f.where || '';
    const tag = f.kept ? `kept: ${f.kept}` : tierOf(f.id);
    console.log(`  ${f.id} [${tag}] ${where}  ${f.message}${f.snippet ? `\n      ${f.snippet}` : ''}`);
  }
  return c;
}
