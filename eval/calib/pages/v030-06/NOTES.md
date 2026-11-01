# NOTES: 06-redesign

Budget: standard. Surface: marketing. Mode: redesign (rebuild: content and wiring kept, layout and copy rewritten).

## Assumptions (nobody to ask)

- The product has no name or details in the source. I named it **Slotboard**, a planning board for teams of 3 to 30, and wrote the copy around that. The team, the cards, and "Northside Print" are sample data, labelled as such on the page.
- `go()` was never defined in the source. It now pulls the next card out of the hero rack and announces it in a live region. The element is a real `<button onclick="go()">` now, not a `<div>`.
- `hero.png` was missing (the image was broken). I rendered a week-view screenshot of the sample board into `hero.png` (1600×900). The caption says it is illustrative. Swap in a real screenshot when there is one.
- "Get started" became "Start a board" (scrolls to the form and focuses the email field). "Learn more" became "See a card's week" (scrolls to that section). The email field is now `type="email"`, `name="email"`, has a real label, and shows an error and a success message. The icon-only button submits the form and has `aria-label="Start my board"`. There is no backend, so a submit only shows the confirmation.

## Three directions

- A — "T-card rack": borrows the slotted T-card planning boards from workshops and print shops (painted steel panel, ivory and yellow cardstock, names in marker); a working rack leads the page. Mid-tone slate ground, condensed grotesk, cards with real elevation.
- B — "Handoff slip": borrows carbon-copy work orders and job tickets (light paper, slab serif, a numbered ticket as hero). Rejected: it sits too close to R04a/R04d (paper ground, serif, hairlines).
- C — "Dispatch console": a dark split-flap board showing who holds what, mono-led and loud. Rejected: near-black with one bright accent is R04b, and split-flap boards are a common landing-page trope.

**Chosen: A.** A small team's work really is "one card, one person, one slot", and the T-card board is the physical thing this kind of tool replaces. The page shows the product idea instead of describing it.

## Signature

The hero **T-card rack**: three people's columns of card tops in slot channels. One yellow card is pulled out so its T-shaped body shows the due day, the handoff note in marker, and a checklist. It is in that state on load. Any card can be pulled (each top is a button with `aria-expanded`), and "Open the next card" (`go()`) moves through them in order.

## Verification

- Before snapshot: `before.json` (from SOURCE.html). Compare run: 0 F11, so no field, button, heading, or handler was lost.
- `lint.mjs index.html`: floor 0 · reflex 0 · finish 0 · kept 0.
- `render-check.mjs index.html --out shots --compare before.json`: floor 0 · reflex 0 · finish 0 · kept 0 (320/768/1280/1920).
- `tokens-check.mjs DESIGN.md`: floor 0 · reflex 0 · finish 0.
- Fix rounds: (1) overflow at 320 in the signup row (form grid track and input width). (2) After looking at the screenshots: the pulled card was squeezed into a ~85px column at 320, so the rack now stacks people as rows with cards two-up; the four-day strip was cramped at 768, so it now wraps 2×2; the nav was tightened to two lines at 320.
- Accessory removed: the "Columns: you · cards: none yet" label under the signup card.

## Reflex findings kept

None. Everything the source triggered (R01 Inter, R02 purple gradient, R03 gradient text, R05 emoji, R07 glass, R09 template CTA pair, R10 hype copy and lorem ipsum, R11 01/02/03 markers, R12 `transition: all`) was removed. The day labels in "A card's week" (Mon, Tue, Thu, Fri) are a real sequence, not numbered markers.
