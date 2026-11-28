// usage: node eval/facts.mjs <run>[,<run>…]
// M-080 (EXP-090): an evaluator-side audit of facts the page adds to the brief. For each case, writes FACTS_PROMPT.md
// holding the brief and the page's visible text at 1280 (with its controls and alt text), for a fresh-context judge
// that writes facts.json. Then `node eval/facts.mjs --score <run>[,<run>…]` prints the counts.
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const score = process.argv.includes('--score');
const runs = process.argv.slice(2).filter((a) => !a.startsWith('--')).join(',').split(',').filter(Boolean).map((r) => path.resolve(r.includes('/') ? r : path.join(ROOT, 'eval/runs', r)));
if (score) {
  for (const run of runs) {
    console.log(path.basename(run));
    for (const c of fs.readdirSync(run).filter((d) => /^\d\d-/.test(d)).sort()) {
      const f = path.join(run, c, 'facts.json');
      if (!fs.existsSync(f)) { console.log(`  ${c}: no facts.json`); continue; }
      const j = JSON.parse(fs.readFileSync(f, 'utf8'));
      const op = (j.added || []).filter((x) => x.kind !== 'sample-data');
      console.log(`  ${c}: added ${op.length} ${JSON.stringify(op.map((x) => x.kind))}`);
    }
  }
  process.exit(0);
}
const { chromium } = require('playwright');
const browser = await chromium.launch();
for (const run of runs) {
  for (const c of fs.readdirSync(run).filter((d) => /^\d\d-/.test(d)).sort()) {
    const file = path.join(run, c, 'index.html');
    if (!fs.existsSync(file)) continue;
    const brief = fs.readFileSync(path.join(ROOT, 'eval/cases', c + '.md'), 'utf8').replace(/^---[\s\S]*?---\s*/, '').trim();
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.route(/^https?:/, (r) => r.abort());
    try { await page.goto('file://' + file, { waitUntil: 'load', timeout: 15000 }); } catch {}
    await page.waitForTimeout(300);
    const text = await page.evaluate(() => {
      const alts = [...document.querySelectorAll('img[alt], [aria-label]')].map((e) => e.getAttribute('alt') || e.getAttribute('aria-label')).filter(Boolean);
      return document.body.innerText + '\n\n[alt and aria-label text]\n' + alts.join('\n');
    });
    await page.close();
    const prompt = `# Fact audit

You check one web page against the brief it was built from. Do not judge the design.

## The brief

${brief}

## The page's visible text (1280px wide), then its alt and aria-label text

\`\`\`
${text.slice(0, 30000)}
\`\`\`

## Your task

List every statement on the page that adds a fact about the product, the business, or how it works that the brief does not give and a visitor might rely on. Count each distinct fact once, even if repeated.

Kinds:
- \`time\`: start times, opening hours, schedules or recurring days the brief doesn't state.
- \`place\`: addresses, districts, stations, bus stops, directions, landmarks.
- \`money\`: prices, fares, fees, payment methods.
- \`contact\`: phone numbers, emails, social handles.
- \`policy\`: rules and conditions (first-come, refunds, limits, what's allowed, language support).
- \`process\`: what happens after an action (an email is sent, a digest on Mondays, a reminder a day before).
- \`product\`: features, platforms, integrations, specs, guarantees, metrics.
- \`sample-data\`: plausible rows the page needs to show its function (names of people or items, specific dates of upcoming sessions, seat or stock counts in a list, log lines, table rows). List these too, but they are allowed.

Do not list the brief's own facts restated, the page's labels and instructions, or placeholder notes.

Write \`facts.json\` in this folder: {"added": [{"text": "<the page's words, short>", "kind": "<kind>"}]}.
`;
    fs.writeFileSync(path.join(run, c, 'FACTS_PROMPT.md'), prompt);
  }
  console.log(`wrote FACTS_PROMPT.md under ${path.relative(ROOT, run)}`);
}
await browser.close();
