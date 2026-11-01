# NOTES: 06-redesign

Budget: standard. Surface: marketing. Mode: redesign (rebuild: content and wiring kept, layout and copy rewritten).

## Assumptions (nobody to ask)

- The product had no name or real copy, so I named it **Next Desk** and defined it as a routing-slip workflow tool for small teams (3 to 30 people).
- Primary action = sign up with a work email ("Start a slip"). No backend: the form validates on the client and shows a confirmation message.
- `go()` was called by the source but never defined. It is now the slip's "Pass it on" action.
- `hero.png` was missing (the source image was broken). I made it: a product screenshot of the team view, drawn from an HTML mock in the same tokens and captured with Playwright at 2x (2400×1320, shown at 1200×660).

## Three directions

- A — "Ticket rail": borrows the kitchen pass, where order tickets clip to a steel rail and slide from station to station; the hero would be a live rail of jobs. Light, steel-grey ground, condensed grotesk, dense.
- B — "Routing slip": borrows the interoffice envelope and its printed routing slip, where names are crossed out and initialled as the envelope goes from desk to desk; the hero is that slip. Mid-tone kraft ground, condensed form lettering + typewriter entries + ballpoint initials, one elevated card.
- C — "Signal box": borrows a railway signal box, with an illuminated track diagram where each job occupies a block and levers hand it on. Dark ground, saturated lever colours, loud.

**Chosen: B.** A small team's real question is "who has it?", and the routing slip names people while a rail or a track names stations. It is also the clearest picture of a handoff that people already know.

## Token decisions

- Accent candidates: ballpoint blue (#1D3B9A, the pen people initial with), rubber-stamp red (#A3241A, the "received" stamp), pencil graphite (near-neutral). I chose ballpoint because initialling is the action the user takes. Red went to status only ("On desk", "Late", "Filed"). Graphite would have made the one action too quiet on kraft.
- Display candidates: Archivo condensed 75 (the heavy gothic printed on envelope and form headers), Courier Prime (typed entries), Zilla Slab (slab). I chose Archivo condensed because a printed form's lettering looks like that. Courier Prime is kept as the utility face for typed entries, and Caveat is used only for the handwritten initials.

## Signature

The live **routing slip** in the hero. It is circled on Jonas (Legal) by default. "Pass it on" (`onclick="go()"`) crosses out the current holder, writes their initials in ballpoint, stamps the received date, and circles the next desk. On the last desk the slip is stamped "Filed" and the button is disabled, with the reason given in the status line. The arrow icon button sends the slip back to Jonas.
Unit: the ruled slip row (No. / To / Dept / Received / Initials). It is reused by the "How a slip moves" ledger (same ruled-row grid, printed on the envelope), by the team-view legend (circled, crossed out, stamped samples), by the team-view screenshot itself, and by the double rule over the footer.

## Before → after (nothing dropped)

- h1 → kept, rewritten ("Every job knows whose desk it’s on.")
- Button "Get started" → submit button "Start a slip" (the one filled control)
- Button "Learn more" → "See how a slip moves" (scrolls to and focuses the How section)
- Icon-only button → reset button with `aria-label="Send back to Jonas"`
- `<div onClick="go()">Open</div>` → `<button onclick="go()">Pass it on</button>`, with `go()` now defined
- `<input placeholder="Email">` → `<input type="email" id="email" name="email">` with a real label, a hint, and an error message tied by aria-describedby
- `<img src="hero.png">` → same src, with alt, width/height and lazy loading; the file now exists
- `render-check --compare before.json`: no F11.

## States and how to reach them

- Slip: in progress (default), passed (press "Pass it on"), filed (press it three times; the button is disabled with a reason), reset (arrow button).
- Form: empty submit gives the error "Enter your work email…". A malformed address gives an error that quotes it. A valid address gives the confirmation. The field is marked aria-invalid until edited.

## Invented content (not real)

Product name "Next Desk"; team "Studio Halden"; people Maya Okafor, Ren Tanaka, Jonas Weber, Priya Nair, Sam Ortiz, Ida, Theo, Lena, Omar; slip no. 0417 "Spring catalogue, page 14 copy", due 6 Nov; other slip titles and waiting times in hero.png; the claims that sign-in uses an emailed link with no password, and that the first desk is told by email. No metrics, testimonials, logos, or prices.

## Results

- lint: floor 0 · reflex 0 · finish 0 · kept 0
- render (320/768/1280/1920): floor 0 · reflex 0 · finish 0 · kept 0
- Reflex findings kept: none.

## Accessory removed

The footer tagline ("Routing slips for small teams"), because it repeated the title.
