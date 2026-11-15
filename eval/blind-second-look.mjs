// usage: node eval/blind-second-look.mjs <runDir>   (run after every `pair` call, before judging)
// Blind the judge folders: remove SECOND_PROMPT.md, the `## Second look` section, and any line that mentions the second look.
import fs from 'node:fs'; import path from 'node:path';
const run = path.resolve(process.argv[2]);
let removed = 0, sections = 0, lines = 0;
for (const kind of ['_pairs', '_neutral']) {
  const base = path.join(run, kind);
  if (!fs.existsSync(base)) continue;
  for (const p of fs.readdirSync(base)) for (const side of ['A', 'B']) {
    const dir = path.join(base, p, side);
    if (!fs.existsSync(dir)) continue;
    const sp = path.join(dir, 'SECOND_PROMPT.md');
    if (fs.existsSync(sp)) { fs.unlinkSync(sp); removed++; }
    for (const f of ['NOTES.md', 'DESIGN.md']) {
      const fp = path.join(dir, f);
      if (!fs.existsSync(fp)) continue;
      const src = fs.readFileSync(fp, 'utf8').split('\n');
      const out = []; let skip = false;
      for (const l of src) {
        if (/^##\s+Second look/i.test(l)) { skip = true; sections++; continue; }
        if (skip && /^##\s/.test(l)) skip = false;
        if (skip) continue;
        if (/second[ -]look/i.test(l)) { lines++; continue; }
        out.push(l);
      }
      fs.writeFileSync(fp, out.join('\n').replace(/\n+$/, '\n'));
    }
  }
}
console.log({ removed, sections, lines });
