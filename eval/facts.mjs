// Fact check (M-058): which product facts does a page state that the brief does not give?
//
//   node eval/facts.mjs prepare --out <dir> [--no-assets] <runDir>/<case> [...]
//       one folder per page (p01, p02, ... in shuffled order) with BRIEF.md, SOURCE.txt (redesign cases),
//       ASSETS.txt (visible text of the material the brief hands over, e.g. the hero screenshot's source),
//       PAGE.txt (visible text of the built page) and FACT_PROMPT.md. map.json stays outside the page folders.
//   node eval/facts.mjs collect --out <dir> [--model opus]
//       copies each pNN/facts.json to <runDir>/<case>/facts.<model>.json and prints the counts.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const cmd = args.shift();
const opt = (name) => { const i = args.indexOf(name); if (i < 0) return null; const v = args[i + 1]; args.splice(i, 2); return v; };
const flag = (name) => { const i = args.indexOf(name); if (i < 0) return false; args.splice(i, 1); return true; };

const PROMPT = (hasAssets) => `# Fact check

This folder holds one web page as text:

- \`BRIEF.md\`: the request the page was built for.
- \`SOURCE.txt\` (only for a redesign): the visible text of the page being redesigned. Facts in it count as given by the brief.
${hasAssets ? '- `ASSETS.txt` (only when the brief hands over material): the text visible in the images and files the brief supplies. Facts in it count as given by the brief.\n' : ''}- \`PAGE.txt\`: every piece of text a visitor can see on the built page.

List the **product facts the page states as true that the brief does not give**. A product fact is a claim about what the product, service or business is or does: features, commands, syntax, operators, flags, configuration, supported formats or platforms, plans, prices, fees, limits, capacities other than those in the brief, opening hours, addresses, guarantees, policies, integrations, performance numbers, user counts, ratings, testimonials, customer logos, awards, history.

Do NOT list:

- Sample content that fills what the brief leaves open: people's names, dates, times, rows of data and their figures, current settings, example log lines, example values inside a demo.
- Restatements or obvious rewordings of facts the brief gives${hasAssets ? ', including what ASSETS.txt or SOURCE.txt shows' : ''}.
- Text explicitly marked on the page as a placeholder, sample or example.
- Navigation labels, button labels, headings and generic marketing phrases that make no checkable claim.
- Ordinary UI behaviour of the page itself (e.g. "changes are saved when you press Save").

Write \`facts.json\` in this folder:

\`\`\`json
{ "invented": [ { "text": "short quote from PAGE.txt", "kind": "price" } ], "count": 1 }
\`\`\`

\`count\` is the length of \`invented\`. Quote at most 12 words per item. If nothing qualifies, \`invented\` is \`[]\` and \`count\` is 0. Make sure the file is valid JSON. Do not read anything outside this folder.
`;

function frontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const meta = {};
  if (m) for (const l of m[1].split('\n')) { const i = l.indexOf(':'); if (i > 0) meta[l.slice(0, i).trim()] = l.slice(i + 1).trim(); }
  return { meta, body: m ? m[2].trim() : md.trim() };
}

async function visibleText(browser, file) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('file://' + file);
  const text = await page.evaluate(() => {
    const alts = [...document.querySelectorAll('img[alt], [aria-label]')]
      .map((e) => e.getAttribute('alt') || e.getAttribute('aria-label')).filter(Boolean);
    return document.body.innerText + (alts.length ? '\n\n[alt and aria-label text]\n' + alts.join('\n') : '');
  });
  await page.close();
  return text.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

if (cmd === 'prepare') {
  const out = path.resolve(opt('--out'));
  const noAssets = flag('--no-assets');
  const pages = args.map((a) => path.resolve(a));
  for (let i = pages.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pages[i], pages[j]] = [pages[j], pages[i]]; }
  let pw = null;
  const dirs = [process.env.NPM_GLOBAL, '/usr/local/lib/node_modules'];
  try { dirs.push(execSync('npm root -g', { stdio: ['ignore', 'pipe', 'ignore'], timeout: 5000 }).toString().trim()); } catch {}
  try { pw = createRequire(process.cwd() + '/')('playwright'); } catch {}
  for (const d of dirs.filter(Boolean)) { if (pw) break; try { pw = createRequire(import.meta.url)(path.join(d, 'playwright')); } catch {} }
  if (!pw) { console.error('Playwright not found.'); process.exit(1); }
  const { chromium } = pw;
  const browser = await chromium.launch();
  fs.mkdirSync(out, { recursive: true });
  const map = {};
  let n = 0;
  for (const dir of pages) {
    const id = 'p' + String(++n).padStart(2, '0');
    const caseId = path.basename(dir);
    const { meta, body } = frontmatter(fs.readFileSync(path.join(ROOT, 'eval/cases', caseId + '.md'), 'utf8'));
    const pd = path.join(out, id);
    fs.mkdirSync(pd, { recursive: true });
    fs.writeFileSync(path.join(pd, 'BRIEF.md'), body + '\n');
    if (meta.source) fs.writeFileSync(path.join(pd, 'SOURCE.txt'), await visibleText(browser, path.join(ROOT, meta.source)));
    let hasAssets = false;
    if (!noAssets) {
      // An asset's visible text comes from a sibling `<name>-source.html` (the page the image was rendered from).
      const parts = [];
      for (const a of (meta.assets || '').split(',').map((s) => s.trim()).filter(Boolean)) {
        const src = path.join(ROOT, a.replace(/\.[a-z0-9]+$/i, '-source.html'));
        if (fs.existsSync(src)) parts.push(`## ${path.basename(a)}\n\n` + await visibleText(browser, src));
      }
      if (parts.length) { fs.writeFileSync(path.join(pd, 'ASSETS.txt'), parts.join('\n')); hasAssets = true; }
    }
    fs.writeFileSync(path.join(pd, 'PAGE.txt'), await visibleText(browser, path.join(dir, 'index.html')));
    fs.writeFileSync(path.join(pd, 'FACT_PROMPT.md'), PROMPT(hasAssets));
    map[id] = { dir, assets: hasAssets };
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'map.json'), JSON.stringify(map, null, 1));
  console.log(`prepared ${n} page(s) in ${out}`);
} else if (cmd === 'collect') {
  const out = path.resolve(opt('--out'));
  const model = opt('--model') || 'opus';
  const map = JSON.parse(fs.readFileSync(path.join(out, 'map.json'), 'utf8'));
  for (const [id, m] of Object.entries(map)) {
    const f = path.join(out, id, 'facts.json');
    if (!fs.existsSync(f)) { console.log(`${id} missing`); continue; }
    const v = JSON.parse(fs.readFileSync(f, 'utf8'));
    const res = { assets_given: m.assets, count: v.invented.length, invented: v.invented };
    fs.writeFileSync(path.join(m.dir, `facts.${model}${m.assets ? '' : '.noassets'}.json`), JSON.stringify(res, null, 1) + '\n');
    console.log(`${path.basename(path.dirname(m.dir))}/${path.basename(m.dir)}\t${res.count}`);
  }
} else {
  console.error('usage: node eval/facts.mjs prepare --out <dir> [--no-assets] <runDir>/<case> ... | collect --out <dir> [--model opus]');
  process.exit(1);
}
