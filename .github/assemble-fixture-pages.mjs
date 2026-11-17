#!/usr/bin/env node
// eval/fixtures の HTML と、それらが相対参照しているファイルだけを一時ディレクトリへコピーし、
// 各 HTML へのリンクを並べた index.html を生成する。
// 参照が fixtures の外へ出る、またはシンボリックリンクの場合は失敗する。
// ソースの隣に無い相対参照は、公開物を増やさず警告だけにする。

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURES = path.join(ROOT, 'eval/fixtures');
const OUT = path.join(ROOT, '_site');
const TEXT_EXT = new Set(['.html', '.htm', '.css', '.svg']);

const ATTR_RE = /\b(?:href|src|poster|cite|action|formaction|background)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi;
const SRCSET_RE = /\b(?:srcset|imagesrcset)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
const URL_RE = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)\s"']+))\s*\)/gi;
const IMPORT_RE = /@import\s+(?:url\(\s*)?(?:"([^"]*)"|'([^']*)')/gi;

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[ch]));
}

function decodeAttr(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function groupValue(match) {
  return match[1] ?? match[2] ?? match[3] ?? '';
}

function extractRefs(text) {
  const stripped = text.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  const refs = [];
  for (const re of [ATTR_RE, URL_RE, IMPORT_RE]) {
    re.lastIndex = 0;
    for (const match of stripped.matchAll(re)) refs.push(groupValue(match));
  }
  SRCSET_RE.lastIndex = 0;
  for (const match of stripped.matchAll(SRCSET_RE)) {
    for (const part of groupValue(match).split(',')) {
      const url = part.trim().split(/\s+/)[0];
      if (url) refs.push(url);
    }
  }
  return refs;
}

function classify(raw) {
  const trimmed = decodeAttr(raw).trim();
  if (!trimmed || trimmed.startsWith('#')) return { kind: 'skip' };
  if (trimmed.startsWith('//')) return { kind: 'external' };
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return { kind: 'external' };
  let end = trimmed.length;
  const hash = trimmed.indexOf('#');
  const query = trimmed.indexOf('?');
  if (hash >= 0) end = Math.min(end, hash);
  if (query >= 0) end = Math.min(end, query);
  const pathPart = trimmed.slice(0, end);
  if (!pathPart) return { kind: 'skip' };
  if (pathPart.startsWith('/')) return { kind: 'root' };
  return { kind: 'relative', path: pathPart };
}

function assertInside(root, abs) {
  const rel = path.relative(root, abs);
  if (rel === '' || rel.startsWith(`..${path.sep}`) || rel === '..' || path.isAbsolute(rel)) {
    throw new Error(`relative reference escapes eval/fixtures: ${abs}`);
  }
  return rel.split(path.sep).join('/');
}

function resolveRelative(fixturesDir, fromFile, urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    throw new Error(`invalid URL encoding in ${path.basename(fromFile)}: ${urlPath}`);
  }
  if (decoded.includes('\0') || decoded.includes('\\')) {
    throw new Error(`unsafe path in ${path.basename(fromFile)}: ${urlPath}`);
  }
  const abs = path.resolve(path.dirname(fromFile), decoded);
  const rel = assertInside(fixturesDir, abs);
  return { abs, rel };
}

function assertSafeOut(outDir, fixturesDir) {
  const out = path.resolve(outDir);
  const fixtures = path.resolve(fixturesDir);
  if (out === path.parse(out).root) throw new Error('refusing to wipe the filesystem root');
  if (out === fixtures) throw new Error('refusing to wipe the fixtures directory');
  const inside = path.relative(fixtures, out);
  const outside = inside.split(path.sep).includes('..');
  if (inside === '' || path.isAbsolute(inside) || !outside) {
    throw new Error('refusing to wipe a directory inside fixtures');
  }
  return out;
}

async function lstatInside(root, abs) {
  const rel = assertInside(root, abs);
  const parts = rel.split('/');
  let current = root;
  for (let i = 0; i < parts.length; i += 1) {
    current = path.join(current, parts[i]);
    const last = i === parts.length - 1;
    let stat;
    try {
      stat = await fs.lstat(current);
    } catch (error) {
      if (error.code === 'ENOENT' && last) return { missing: true, rel };
      throw error;
    }
    if (stat.isSymbolicLink()) throw new Error(`symlink not allowed: ${rel}`);
    if (!last && !stat.isDirectory()) throw new Error(`not a directory: ${rel}`);
    if (last && !stat.isFile()) throw new Error(`not a regular file: ${rel}`);
  }
  return { missing: false, rel };
}

async function listFixtureHtml(fixturesDir) {
  const rootStat = await fs.lstat(fixturesDir);
  if (!rootStat.isDirectory()) throw new Error('fixtures path is not a real directory');
  const entries = await fs.readdir(fixturesDir, { withFileTypes: true });
  const html = [];
  for (const entry of entries) {
    if (!entry.name.toLowerCase().endsWith('.html')) continue;
    if (entry.isSymbolicLink()) throw new Error(`symlink not allowed: ${entry.name}`);
    if (!entry.isFile()) throw new Error(`not a regular file: ${entry.name}`);
    if (entry.name === 'index.html') {
      throw new Error('eval/fixtures/index.html would be overwritten by the generated index');
    }
    html.push(entry.name);
  }
  html.sort((a, b) => a.localeCompare(b, 'en'));
  if (html.length === 0) throw new Error('no HTML files in eval/fixtures');
  return html;
}

function titleOf(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match) return '';
  return decodeAttr(match[1].replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
}

function renderIndex(items) {
  const lis = items.map(({ href, name, title }) => {
    const extra = title && title !== name ? ` — ${escapeHtml(title)}` : '';
    return `    <li><a href="${escapeHtml(href)}"><code>${escapeHtml(name)}</code></a>${extra}</li>`;
  }).join('\n');
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>design-nexus 評価フィクスチャ</title>
<style>
  :root { color-scheme: light; }
  body { margin: 0; padding: 32px 20px; background: #fbfaf7; color: #1a1a1a; font: 16px/1.5 Georgia, "Hiragino Mincho ProN", serif; }
  main { max-width: 40rem; margin: 0 auto; }
  h1 { font-size: 1.5rem; line-height: 1.3; }
  a { color: #08343c; }
  a:focus-visible { outline: 2px solid #08343c; outline-offset: 3px; }
  code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.95em; }
</style>
</head>
<body>
<main>
  <h1>design-nexus 評価フィクスチャ</h1>
  <p><code>eval/fixtures</code> の HTML です。</p>
  <ul>
${lis}
  </ul>
</main>
</body>
</html>
`;
}

async function listTree(dir) {
  const files = [];
  async function walk(current) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const abs = path.join(current, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`symlink in output: ${entry.name}`);
      if (entry.isDirectory()) await walk(abs);
      else if (entry.isFile()) files.push(path.relative(dir, abs).split(path.sep).join('/'));
      else throw new Error(`unexpected output entry: ${entry.name}`);
    }
  }
  await walk(dir);
  files.sort((a, b) => a.localeCompare(b, 'en'));
  return files;
}

async function assemble(fixturesDir, outDir) {
  const fixtures = path.resolve(fixturesDir);
  const out = assertSafeOut(outDir, fixtures);
  const html = await listFixtureHtml(fixtures);
  const queue = [...html];
  const publish = new Set();
  const missing = [];
  const seenMissing = new Set();

  while (queue.length > 0) {
    const rel = queue.pop();
    if (publish.has(rel)) continue;
    const abs = path.resolve(fixtures, rel);
    const looked = await lstatInside(fixtures, abs);
    if (looked.missing) throw new Error(`queued file disappeared: ${rel}`);
    publish.add(rel);

    const ext = path.extname(rel).toLowerCase();
    if (!TEXT_EXT.has(ext)) continue;
    const text = await fs.readFile(abs, 'utf8');
    if ((ext === '.html' || ext === '.htm') && /<base\b/i.test(text)) {
      throw new Error(`<base> is not supported: ${rel}`);
    }
    for (const raw of extractRefs(text)) {
      const classified = classify(raw);
      if (classified.kind !== 'relative') continue;
      const target = resolveRelative(fixtures, abs, classified.path);
      if (publish.has(target.rel) || queue.includes(target.rel)) continue;
      const targetStat = await lstatInside(fixtures, target.abs);
      if (targetStat.missing) {
        const key = `${rel} -> ${classified.path}`;
        if (!seenMissing.has(key)) {
          seenMissing.add(key);
          missing.push({ from: rel, ref: classified.path });
        }
        continue;
      }
      queue.push(target.rel);
    }
  }

  await fs.rm(out, { recursive: true, force: true });
  try {
    await fs.mkdir(out, { recursive: true });
    for (const rel of publish) {
      const dest = path.join(out, rel);
      assertInside(out, dest);
      await fs.mkdir(path.dirname(dest), { recursive: true });
      await fs.copyFile(path.join(fixtures, rel), dest);
      const source = await fs.readFile(path.join(fixtures, rel));
      const copied = await fs.readFile(dest);
      if (!source.equals(copied)) throw new Error(`copy changed bytes: ${rel}`);
    }

    const items = [];
    for (const name of html) {
      const text = await fs.readFile(path.join(fixtures, name), 'utf8');
      items.push({ href: encodeURI(name), name, title: titleOf(text) });
    }
    const index = renderIndex(items);
    await fs.writeFile(path.join(out, 'index.html'), index);

    const files = await listTree(out);
    const expected = [...publish, 'index.html'].sort((a, b) => a.localeCompare(b, 'en'));
    if (files.join('\n') !== expected.join('\n')) {
      throw new Error(`output does not match the reference closure\n${files.join('\n')}`);
    }
    const hrefs = [...index.matchAll(/<a href="([^"]*)">/g)].map((match) => match[1]);
    const want = items.map((item) => item.href);
    if (hrefs.join('\n') !== want.join('\n')) {
      throw new Error('index links do not match the fixture HTML');
    }
    for (const rel of publish) {
      const ext = path.extname(rel).toLowerCase();
      if (!TEXT_EXT.has(ext)) continue;
      const text = await fs.readFile(path.join(out, rel), 'utf8');
      for (const raw of extractRefs(text)) {
        const classified = classify(raw);
        if (classified.kind !== 'relative') continue;
        const target = resolveRelative(out, path.join(out, rel), classified.path);
        const inSource = publish.has(target.rel);
        let inOutput = false;
        try {
          const stat = await fs.lstat(target.abs);
          inOutput = stat.isFile();
        } catch (error) {
          if (error.code !== 'ENOENT') throw error;
        }
        if (inSource !== inOutput) {
          throw new Error(`broken relative reference after copy: ${rel} -> ${classified.path}`);
        }
      }
    }
  } catch (error) {
    await fs.rm(out, { recursive: true, force: true });
    throw error;
  }

  missing.sort((a, b) => `${a.from} ${a.ref}`.localeCompare(`${b.from} ${b.ref}`, 'en'));
  return { files: [...publish, 'index.html'].sort((a, b) => a.localeCompare(b, 'en')), missing };
}

function assert(condition, message) {
  if (!condition) throw new Error(`self-test: ${message}`);
}

async function withTemp(run) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'fixture-pages-'));
  try {
    await run(dir);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

async function selfTest() {
  await withTemp(async (dir) => {
    const fixtures = path.join(dir, 'fixtures');
    const out = path.join(dir, 'out');
    await fs.mkdir(path.join(fixtures, 'nested'), { recursive: true });
    await fs.mkdir(path.join(fixtures, 'fonts'), { recursive: true });
    const page = `<!doctype html><html><head><title>Sample &amp; title</title>
<link rel="stylesheet" href="./style.css?v=1"></head><body>
<img src="nested/icon.svg"><img srcset="pic.svg 1x, nested/icon.svg 2x">
<a href="#here">x</a><a href="/pricing">p</a><a href="https://example.org/a">e</a>
<img src="data:image/gif;base64,AAAA"></body></html>`;
    await fs.writeFile(path.join(fixtures, 'page.html'), page);
    await fs.writeFile(path.join(fixtures, 'style.css'), '@import "nested/extra.css";\n@font-face { src: url("fonts/a.woff2"); }\n');
    await fs.writeFile(path.join(fixtures, 'nested/extra.css'), 'body { background: url("../pic.svg"); }\n');
    await fs.writeFile(path.join(fixtures, 'pic.svg'), '<svg xmlns="http://www.w3.org/2000/svg"></svg>\n');
    await fs.writeFile(path.join(fixtures, 'nested/icon.svg'), '<svg xmlns="http://www.w3.org/2000/svg"></svg>\n');
    await fs.writeFile(path.join(fixtures, 'fonts/a.woff2'), Buffer.from('woff'));
    await fs.writeFile(path.join(fixtures, 'unreferenced.css'), 'body{}\n');
    await fs.writeFile(path.join(fixtures, 'notes.DESIGN.md'), '# no\n');
    const result = await assemble(fixtures, out);
    assert(result.missing.length === 0, `unexpected missing ${JSON.stringify(result.missing)}`);
    assert(result.files.join() === ['fonts/a.woff2', 'index.html', 'nested/extra.css', 'nested/icon.svg', 'page.html', 'pic.svg', 'style.css'].join(), result.files.join());
    const index = await fs.readFile(path.join(out, 'index.html'), 'utf8');
    assert(index.includes('Sample &amp; title'), 'title was not escaped');
    assert(index.includes('href="page.html"'), 'missing page link');
    assert(!index.includes('unreferenced.css'), 'index linked an unreferenced file');
    const copied = await fs.readFile(path.join(out, 'page.html'), 'utf8');
    assert(copied === page, 'html bytes changed');
  });

  await withTemp(async (dir) => {
    const fixtures = path.join(dir, 'fixtures');
    const out = path.join(dir, 'out');
    await fs.mkdir(fixtures);
    await fs.writeFile(path.join(dir, 'secret.txt'), 'nope');
    await fs.writeFile(path.join(fixtures, 'page.html'), '<img src="hero.png"><img src="https://example.org/hero.png">');
    const result = await assemble(fixtures, out);
    assert(result.files.join() === ['index.html', 'page.html'].join(), result.files.join());
    assert(JSON.stringify(result.missing) === JSON.stringify([{ from: 'page.html', ref: 'hero.png' }]), JSON.stringify(result.missing));
    assert(!(await fs.stat(path.join(out, 'hero.png')).then(() => true, () => false)), 'invented hero.png');
    assert(!(await fs.stat(path.join(out, 'secret.txt')).then(() => true, () => false)), 'copied a sibling secret');
  });

  await withTemp(async (dir) => {
    const fixtures = path.join(dir, 'fixtures');
    await fs.mkdir(fixtures);
    await fs.writeFile(path.join(dir, 'secret.txt'), 'nope');
    await fs.writeFile(path.join(fixtures, 'page.html'), '<link rel="stylesheet" href="../secret.txt">');
    await assertRejects(() => assemble(fixtures, path.join(dir, 'out')), 'escapes');
    await fs.writeFile(path.join(fixtures, 'page.html'), '<link href="%2e%2e/secret.txt">');
    await assertRejects(() => assemble(fixtures, path.join(dir, 'out2')), 'escapes');
  });

  await withTemp(async (dir) => {
    const fixtures = path.join(dir, 'fixtures');
    await fs.mkdir(fixtures);
    await fs.writeFile(path.join(dir, 'secret.txt'), 'nope');
    await fs.symlink(path.join(dir, 'secret.txt'), path.join(fixtures, 'link.css'));
    await fs.writeFile(path.join(fixtures, 'page.html'), '<link rel="stylesheet" href="link.css">');
    await assertRejects(() => assemble(fixtures, path.join(dir, 'out')), 'symlink');
    await fs.mkdir(path.join(dir, 'outside'));
    await fs.writeFile(path.join(dir, 'outside/secret.css'), 'body{}\n');
    await fs.symlink(path.join(dir, 'outside'), path.join(fixtures, 'linked'));
    await fs.writeFile(path.join(fixtures, 'page.html'), '<link rel="stylesheet" href="linked/secret.css">');
    await assertRejects(() => assemble(fixtures, path.join(dir, 'out2')), 'symlink');
  });

  await withTemp(async (dir) => {
    const fixtures = path.join(dir, 'fixtures');
    await fs.mkdir(fixtures);
    await fs.writeFile(path.join(fixtures, 'index.html'), '<title>occupied</title>');
    await assertRejects(() => assemble(fixtures, path.join(dir, 'out')), 'index.html');
  });

  await withTemp(async (dir) => {
    const out = path.join(dir, 'out');
    const result = await assemble(FIXTURES, out);
    const sourceHtml = (await fs.readdir(FIXTURES)).filter((name) => name.endsWith('.html')).sort((a, b) => a.localeCompare(b, 'en'));
    for (const name of sourceHtml) {
      const source = await fs.readFile(path.join(FIXTURES, name));
      const copied = await fs.readFile(path.join(out, name));
      assert(source.equals(copied), `${name} bytes changed`);
    }
    const index = await fs.readFile(path.join(out, 'index.html'), 'utf8');
    const hrefs = [...index.matchAll(/<a href="([^"]*)">/g)].map((match) => match[1]);
    assert(hrefs.join() === sourceHtml.map((name) => encodeURI(name)).join(), 'real index links drifted');
    for (const file of result.files) {
      if (file === 'index.html') continue;
      const source = await fs.readFile(path.join(FIXTURES, file));
      const copied = await fs.readFile(path.join(out, file));
      assert(source.equals(copied), `${file} is not from fixtures`);
    }
    const heroExists = await fs.stat(path.join(FIXTURES, 'hero.png')).then(() => true, () => false);
    assert(result.files.includes('hero.png') === heroExists, 'hero.png was copied from outside eval/fixtures');
    for (const item of result.missing) {
      const abs = path.resolve(path.dirname(path.join(FIXTURES, item.from)), item.ref);
      assert(!(await fs.stat(abs).then(() => true, () => false)), `${item.from} -> ${item.ref} exists`);
    }
  });
}

async function assertRejects(run, pattern) {
  try {
    await run();
  } catch (error) {
    assert(String(error.message).includes(pattern), `expected ${pattern} in: ${error.message}`);
    return;
  }
  throw new Error(`self-test: expected failure containing ${pattern}`);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) {
    if (args.length !== 1) throw new Error('usage: node .github/assemble-fixture-pages.mjs [--self-test]');
    await selfTest();
    console.log('self-test ok');
    return;
  }
  if (args.length !== 0) throw new Error('usage: node .github/assemble-fixture-pages.mjs [--self-test]');
  const result = await assemble(FIXTURES, OUT);
  console.log(`published ${result.files.length} files:`);
  for (const file of result.files) console.log(file);
  if (result.missing.length > 0) {
    console.log('unresolved relative references (already missing beside the HTML; not copied from elsewhere):');
    for (const item of result.missing) console.log(`  ${item.from} -> ${item.ref}`);
  }
  console.log('verified: every relative file that exists under eval/fixtures is in the output');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
