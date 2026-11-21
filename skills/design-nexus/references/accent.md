# Accent

Read only when the owner asks for an accent (steer `accent`), on a marketing surface: a landing page or a brand site.
An accent changes how one thing already on the page looks. It never changes what the page says, how big the main things are, or where they sit.

1. Snapshot: `node scripts/render-check.mjs index.html --snapshot accent-before.json --keep "<the signature's selector>"`.
2. Pick one thing the page already has and the subject already owns: the signature's unit, the brand mark, or the real image. Change one property of it, taken from the subject's world: its ground (a material, a paper, the product's own color), its edge or a mark on it, the setting of one heading in a face the type plan already loads, or a closer crop of the real image.
3. These are not accents: a word or headline at poster size; vertical text that fills a screen; a full-bleed band; a block of empty space; an overlap across sections or past the grid; a new motif, font, or effect; new words, names, times, or figures.
4. Compare: `node scripts/render-check.mjs index.html --compare accent-before.json`. R35 and R36 must be empty and the prose line must read 0 changed, 0 added. If not, undo and pick a smaller change. Then run the lint and the render check as usual; the accent adds no finding.
5. Touch nothing else: no other fix rides along. In NOTES.md add `## Accent`: its name, where in the subject's world it comes from, and the compare result.
