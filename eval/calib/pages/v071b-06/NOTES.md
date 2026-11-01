# NOTES: 06-redesign

Budget: standard. Surface: marketing. Mode: redesign (rebuild). I kept the content and wiring and changed the layout, copy and look.

## Assumptions (nobody to ask)

- The product had no name, so I named it **Circulate**. I chose the concrete subject: a workflow tool for teams of 3 to 30 in which every job is a routing slip that sits with one person at a time.
- The one job of the page is to get a visitor to start a slip by leaving a work email.
- `hero.png` was referenced in SOURCE.html but not supplied. I rendered a stand-in product screen (the "Open slips" list view) into `hero.png` in this folder so the image works. Swap in a real screenshot before shipping. Everything else is inline in `index.html`.
- `go()` was called by SOURCE.html but never defined. It now drives the hero slip. "Pass it to …" crosses off the current holder and circles the next name, then "Sign it off", then "Send it round again" resets the slip.

Everything below is invented for the page: the name Circulate, Northfold Studio, the people (Maya Okafor, Theo Brandt, Ines Duarte, Sam Whitlock, Priya Nair), slip numbers, jobs, dates (pinned to Sat 31 Oct 2026), "for teams of 3 to 30", and the feature claims (route edits are logged on the trail, one email per handover). The page has no metrics, testimonials, logos or prices.

## Three directions

- A, "Interoffice envelope": borrows the kraft envelope and its routing slip (printed condensed caps, names in pen, crossed off at each handover). Leads with a live routing slip. The ground is a mid-tone kraft with a material surface.
- B, "Ticket rail": borrows the kitchen pass, with thermal tickets clipped to a steel rail and moving between stations. Dark and loud, with a condensed display face and a board structure. Rejected because it lands on R04b (near-black + one hot accent), and "fire / 86" kitchen urgency is the wrong voice for office handovers.
- C, "Whiteboard week": borrows the dry-erase team board, with marker hand lettering on a white canvas laid out as a diagram. Rejected because marker colors sprawl (R08), and a board shows tasks rather than who is holding them, which is the point of the product.

**Chosen: A.** The routing slip already encodes the product's idea: one holder, a visible route, and a name crossed off at each handover.

Accent candidates: ballpoint blue (the pen that crosses names off), stamp-pad red (RECEIVED / DUE stamps), string-tie grey (the envelope's tie button, near-neutral). I chose ballpoint blue because it is the mark the user makes. Red is kept for status only (due, error). Grey carries no meaning.

Display candidates: Barlow Condensed (condensed gothic, like the envelope's printed "TO / DEPT / DATE"), Courier Prime (typewriter), Caveat (hand). I chose Barlow Condensed for the display face and kept Caveat only for names written on a slip. The body face is Public Sans.

## Signature

The **routing slip** in the hero, live on load. Two names are struck through in ballpoint, the current holder is circled with "Holding since Fri 30 Oct", a red "Due Wed 4 Nov" stamp sits at the bottom, and a "Pass it to Sam" button (the original `onclick="go()"`) moves the slip on. Its unit is the ruled slip row (number, name, date). The same unit is reused in:

- "How a slip travels": three stops whose markers are crossed off, circled and plain.
- "What every slip keeps": ruled rows on slip stock.
- The join form: a fresh slip "No. 1" whose first ruled line is the email field.

## What was kept from SOURCE.html (render-check `--compare before.json`: no F11)

- Button "Get started" became the hero "Start a slip" button, which scrolls to the email field and focuses it.
- Button "Learn more" became the link "See how a slip travels" (#how). It is navigation, so it is now an `<a>`.
- The icon-only SVG button became the form's submit button with `aria-label="Add me to the list"` and an arrow icon.
- `<div onClick="go()">Open</div>` became `<button type="button" onclick="go()">`, labelled "Pass it to …".
- The Email input became a labelled `type="email"` field with `name`/`id`, a hint, and an error message tied with `aria-describedby`.
- The image `hero.png` is now the product list view, with alt text, width/height and async decoding.
- The h1 is kept, rewritten as "Always know who's holding it."
- The Fast / Secure / Scalable cards became the "One holder / A trail that stays / Small-team sized" ledger. The 01/02/03 markers were dropped because those items were not a sequence. The real sequence (write, hold, pass) is numbered instead.

## States and how to reach them

- Slip handover: press "Pass it to Sam", then "Pass it to Priya", then "Sign it off" (the stamp turns to "Signed off Sat 31 Oct"), then "Send it round again" to reset. Each step is announced in a polite live region.
- Form, empty: submit with an empty field to get "Enter your work email…".
- Form, malformed: type `ines` and submit to get "That address is missing an @…".
- Form, success: a valid email gives the status "You're on the list. We'll write to … when your team's space is ready."

## Floor fixes from SOURCE.html

Every source finding is fixed: lang/viewport, focus outline, image alt, reduced motion (the float animation is removed, and the handover motion is off under reduce), the div click handler, the input label, the icon-button name, the 11px text, the 1400px-wide overflow, tap targets (48px controls), and the footer contrast. Reflex fixes: Inter, the purple gradient, gradient text, the rocket emoji, glass blur, the "Get started / Learn more" pair, hype copy and lorem ipsum, the 01/02/03 markers, and `transition: all`.

## Critique rounds

1. At 320 the handwritten names wrapped onto two lines, so the slip was tall and messy. Names are now 21px and nowrap below 480px, with less slip padding. The lazy-loaded `hero.png` showed as a blank box in full-page renders, so `loading="lazy"` was dropped. A bug also turned up: the live-region variable `status` collided with `window.status`, so handovers were never announced. It is renamed `slipStatus`.
2. Accessory removed: the punched holes on the slip's binding edge. They read as list bullets that did not line up with the rows.

## Reflex findings kept

None.

## Final tool results

- lint (`--design DESIGN.md`): floor 0, reflex 0, finish 0, kept 0
- render-check (`--out shots`, `--compare before.json`): floor 0, reflex 0, finish 0, kept 0
- tokens-check DESIGN.md: floor 0, reflex 0, finish 0
