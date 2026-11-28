# Surface: marketing (landing, launch, portfolio, campaign)

- **Job first.** Decide the one conversion or impression this page exists for. Everything else supports it.
- **Hero is a thesis**, built and reviewed alone first in deep budget: show the product, the object, or the data itself. Headline says the specific benefit in the audience's words; avoid R09 and R10.
- **Proof is specific.** Real numbers with units and dates, named customers only if real, screenshots over illustrations. If no real proof exists, omit the section rather than invent it.
- **Vary structure section to section.** Plan the page as a sequence of different shapes (full-bleed, split, list, table, quote, single figure). Avoid R15.
- **One signature.** A custom diagram, a typographic gesture, an interactive demo, a striking crop. Spend boldness there.
- **Navigation is light**: logo, 3–5 links, one action. Footer carries the rest.
- **Performance**: hero renders without waiting on JS; images sized and lazy below the fold; fonts subset or limited to used weights.
- **Mobile**: the hero still leads with the signature, not a shrunken desktop. Primary action reachable without scrolling far.

## Say it once

Builder only, at step 8, before removing one accessory. The second look skips this section.

1. Run the render check with `--repeats` and take a snapshot (`--snapshot once.json --hold`). *repeats* lists figures and phrases that the visible text outside controls states three or more times.
2. Delete restatements: a sentence, caption, or row that says again a fact the page already shows in a stronger place (a figure, a table row, a label–value pair, the signature), and a line that tells the reader what the figure or list beside it shows ("six cups, six seats").
3. Keep a fact at most twice: once on the first screen and once in its own section. The primary action may also close the page. Keep labels that name an option or a control, and any sentence that adds a reason or a consequence the structure cannot show.
4. Compare (`--compare once.json`). R36 must be empty. R35 may list only what you deleted in 2; put back anything else.
5. In NOTES.md, add `## Said once`: each deletion and where the fact still is.
