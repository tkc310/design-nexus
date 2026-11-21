# Surface: marketing (landing, launch, portfolio, campaign)

- **Job first.** Decide the one conversion or impression this page exists for. Everything else supports it.
- **Hero is a thesis**, built and reviewed alone first in deep budget: show the product, the object, or the data itself. Headline says the specific benefit in the audience's words; avoid R09 and R10.
- **Proof is specific.** Real numbers with units and dates, named customers only if real, screenshots over illustrations. If no real proof exists, omit the section rather than invent it.
- **Vary structure section to section.** Plan the page as a sequence of different shapes (full-bleed, split, list, table, quote, single figure). Avoid R15.
- **One signature.** A custom diagram, a typographic gesture, an interactive demo, a striking crop. Spend boldness there.
- **Accents, when the job is impression.** A landing, brand, portfolio, or campaign page is judged in the first seconds, so correct and quiet is not enough. Beside the signature, add one or two accents made from the same material, and keep everything else calm so they read as intended:
  - a typographic moment (one word or figure at poster size, a vertical 縦書き heading, a line that crosses a section edge);
  - a full-bleed band of the subject's own color, texture, or photograph;
  - an element that breaks the grid on purpose: an overlap across two sections, an asymmetric crop, a deliberate offset;
  - a small drawn motif from the subject, repeated two or three times at different scales;
  - one orchestrated motion (an entrance, or one scroll-linked change), complete without it and still under `prefers-reduced-motion` (`motion.md`);
  - a wide, deliberate silence before the key statement.

  An accent never covers, delays, or outshines the primary action; text over it keeps its contrast; decoration is `aria-hidden`. Stock effects are not accents: gradient blobs, glows, glass, particles, parallax for its own sake (see `audit.md` *Machine-made tells*). Name each accent and its source in NOTES.md. Product surfaces (dashboards, forms, settings) get none.
- **Navigation is light**: logo, 3–5 links, one action. Footer carries the rest.
- **Performance**: hero renders without waiting on JS; images sized and lazy below the fold; fonts subset or limited to used weights.
- **Mobile**: the hero still leads with the signature, not a shrunken desktop. Primary action reachable without scrolling far.
