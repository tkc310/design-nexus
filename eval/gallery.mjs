// usage: node eval/gallery.mjs
// Copies the pages that the improvement loop compared (eval/runs is not tracked) into eval/gallery/, one folder per
// run and case, with the local files each page refers to (hero.png), and writes eval/gallery/index.html grouped by
// experiment. The Pages workflow publishes it under /gallery/. Edit EXPERIMENTS below when a new experiment is logged.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RUNS = path.join(ROOT, 'eval/runs');
const OUT = path.join(ROOT, 'eval/gallery');

const CASES = {
  '01-lp-devtool': '開発者向け CLI の LP', '02-lp-ja-craft': '陶芸工房のトップ(日本語)', '03-dash-clinic': '診療所の給与ダッシュボード',
  '04-settings-form': '通知の設定画面', '05-mobile-transit': 'バスの時刻(スマホ)', '06-redesign': 'チームツールの LP の作り直し',
  '07-lp-bakery-ja': 'パンの予約(日本語)',
};
// arms: [label shown, run suffix(es)]. Runs are matched by the end of their folder name.
const EXPERIMENTS = [
  { id: 'EXP-092', title: '優先度の順に並べ、構造で言えることは構造で言う(利用者の指定)', verdict: '採用 v0.17.0', arms: [['新しい版', ['-x092']]] },
  { id: 'EXP-091', title: '依頼にない事実を足さない(測り直し)', verdict: '不採用', arms: [['候補', ['-x091a', '-x091b']], ['対照', ['-x090ca', '-x090cb']]] },
  { id: 'EXP-090', title: '依頼にない事実を足さない', verdict: '不採用', arms: [['候補', ['-x090a', '-x090b']], ['対照', ['-x090ca', '-x090cb']]] },
  { id: 'EXP-088', title: '予約のページは第1画面に次の回を並べる(320 で 640px 以内)', verdict: '採用 v0.16.1', arms: [['候補', ['-x088a', '-x088b']], ['対照', ['-x086ca', '-x086cb']]], note: 'x088a の 07 はスクリプトの構文エラーで商品が出ない。これを機に F14 を足した(EXP-089)。' },
  { id: 'EXP-087', title: '予約のページは第1画面に次の回を並べる', verdict: '不採用', arms: [['候補', ['-x087a', '-x087b']], ['対照', ['-x086ca', '-x086cb']]] },
  { id: 'EXP-086', title: 'まだ無い写真の枠を、狭い幅で節の先頭に置かない', verdict: '不採用', arms: [['候補', ['-x086a', '-x086b']], ['対照', ['-x086ca', '-x086cb']]] },
  { id: 'EXP-085', title: '提案のときにデザイン表現のトレンドを候補に入れる(利用者の指定)', verdict: '採用 v0.16.0', arms: [['新しい版', ['-x085', '-x085b']]] },
  { id: 'EXP-084', title: '構造がもう言っている事実を言い直さない(測り直し)', verdict: '採用 v0.16.0', arms: [['候補', ['-x084a', '-x084b']], ['対照', ['-x081ca', '-x081cb']]] },
  { id: 'EXP-082', title: '作る本人と見直しで、画面の批評を重ねない', verdict: '不採用', arms: [['候補', ['-x082a', '-x082b']], ['対照', ['-x082ca', '-x082cb']]] },
  { id: 'EXP-081', title: '構造がもう言っている事実を言い直さない', verdict: '不採用(EXP-084 で採用)', arms: [['候補', ['-x081a', '-x081b']], ['対照', ['-x081ca', '-x081cb']]] },
  { id: 'EXP-080', title: '見直しを、狭い幅と言葉に絞る', verdict: '不採用', arms: [['腕 B(絞った見直し)', ['-x080Ba', '-x080Bb']], ['腕 A(今の見直し)', ['-x080Aa', '-x080Ab']]] },
  { id: 'EXP-079', title: 'Copy の 1 文(段落の割合)', verdict: '不採用', arms: [['候補', ['-x079ba', '-x079bb']], ['対照', ['-x079ca', '-x079cb']]] },
  { id: 'EXP-078', title: 'AI っぽい型の表で磨き直す', verdict: '不採用', arms: [['候補', ['+tells-x078bA', '+tells-x078bB']], ['対照', ['-x078aA', '-x078aB']]] },
  { id: 'EXP-077', title: '見直しを Sonnet で回す', verdict: '不採用', arms: [['候補(Sonnet の見直し)', ['-exp077a']], ['対照(Opus の見直し)', ['-exp066a']]] },
];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const runDirs = fs.readdirSync(RUNS).filter((d) => !d.startsWith('_'));
const find = (suffix) => runDirs.filter((d) => d.endsWith(suffix) && !d.endsWith(suffix + '0'));

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const copied = new Map();
function copyPage(run, c) {
  const key = `${run}/${c}`;
  if (copied.has(key)) return copied.get(key);
  const src = path.join(RUNS, run, c);
  const file = path.join(src, 'index.html');
  if (!fs.existsSync(file)) return null;
  const dest = path.join(OUT, 'runs', run, c);
  fs.mkdirSync(dest, { recursive: true });
  const html = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(path.join(dest, 'index.html'), html);
  for (const m of html.matchAll(/(?:src|href)=["']([^"'#?:]+\.(?:png|jpe?g|webp|svg|woff2?|css|js))["']/gi)) {
    const rel = m[1];
    if (rel.startsWith('/') || rel.includes('..')) continue;
    const from = path.join(src, rel);
    if (fs.existsSync(from) && fs.statSync(from).isFile()) { fs.mkdirSync(path.dirname(path.join(dest, rel)), { recursive: true }); fs.copyFileSync(from, path.join(dest, rel)); }
  }
  const href = `runs/${run}/${c}/`;
  copied.set(key, href);
  return href;
}

let body = '';
for (const e of EXPERIMENTS) {
  body += `<section><h2><span class="id">${esc(e.id)}</span> ${esc(e.title)}</h2><p class="verdict">${esc(e.verdict)}</p>`;
  if (e.note) body += `<p class="note">${esc(e.note)}</p>`;
  const cases = new Set();
  const armRuns = e.arms.map(([label, sufs]) => [label, sufs.flatMap(find)]);
  for (const [, runs] of armRuns) for (const r of runs) for (const c of fs.readdirSync(path.join(RUNS, r))) if (/^\d\d-/.test(c) && fs.existsSync(path.join(RUNS, r, c, 'index.html'))) cases.add(c);
  body += '<table><thead><tr><th scope="col">ケース</th>' + armRuns.map(([l]) => `<th scope="col">${esc(l)}</th>`).join('') + '</tr></thead><tbody>';
  for (const c of [...cases].sort()) {
    body += `<tr><th scope="row">${esc(CASES[c] || c)}</th>`;
    for (const [, runs] of armRuns) {
      const links = runs.map((r, i) => { const h = copyPage(r, c); return h ? `<a href="${esc(h)}">${String.fromCharCode(97 + i)}</a>` : ''; }).filter(Boolean);
      body += `<td>${links.join(' ') || '–'}</td>`;
    }
    body += '</tr>';
  }
  body += '</tbody></table></section>\n';
}

const index = `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>改善ループのページ</title>
<style>
:root{--bg:#f6f6f3;--ink:#1d1f1c;--muted:#5d625a;--line:#d9dbd4;--accent:#2f5d50}
@media (prefers-color-scheme:dark){:root{--bg:#151715;--ink:#e8eae4;--muted:#a3a89e;--line:#363a35;--accent:#8cc5b1}}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.7 "Hiragino Sans","Noto Sans JP",system-ui,sans-serif;padding:24px 16px 64px}
main{max-width:960px;margin:0 auto}
h1{font-size:1.5rem;margin:0 0 8px}
.lead{color:var(--muted);max-width:68ch;margin:0 0 24px}
section{border-top:1px solid var(--line);padding:16px 0}
h2{font-size:1.05rem;margin:0}
.id{font-family:ui-monospace,monospace;color:var(--muted);font-weight:500}
.verdict{margin:2px 0 8px;font-weight:600}
.note{margin:0 0 8px;color:var(--muted)}
table{border-collapse:collapse;width:100%}
th,td{text-align:left;padding:6px 8px;border-bottom:1px solid var(--line);vertical-align:top}
thead th{color:var(--muted);font-weight:500;font-size:.85rem}
a{color:var(--accent);font-family:ui-monospace,monospace;margin-right:10px}
a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
</style></head>
<body><main>
<h1>改善ループで比べたページ</h1>
<p class="lead">design-nexus の改善ループ(EXP-077〜092、2026-11-27〜28)で作り、比べたページです。各ケースの a・b は同じ腕の別の生成です。対照は同じケースを今の版で作ったページです。判定の詳しい数字は loop/experiments.md にあります。ページの事実や数字は評価のための架空のものです。</p>
${body}</main></body></html>
`;
fs.writeFileSync(path.join(OUT, 'index.html'), index);
console.log(`gallery: ${copied.size} pages under ${path.relative(ROOT, OUT)}`);
