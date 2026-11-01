#!/usr/bin/env node
// Renders hero-source.html to hero.png (1600×800) for case 06. Needs Playwright (the same one render-check finds).
import path from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
let pw = null;
for (const base of [process.cwd() + '/', import.meta.url]) { try { pw = createRequire(base)('playwright'); break; } catch {} }
if (!pw) { try { pw = createRequire(import.meta.url)(path.join(execSync('npm root -g').toString().trim(), 'playwright')); } catch {} }
if (!pw) { console.error('Playwright not found'); process.exit(1); }
const browser = await pw.chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 800 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.join(here, 'hero-source.html')).href);
await page.screenshot({ path: path.join(here, 'hero.png') });
await browser.close();
console.log('wrote', path.join(here, 'hero.png'));
