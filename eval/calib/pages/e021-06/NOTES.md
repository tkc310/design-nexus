# NOTES: 06-redesign

Budget: standard. Surface: marketing. Mode: redesign (rebuild: keep the content and wiring, change the layout and copy).

## Grounding (assumptions, since nobody can answer questions)

- Subject: a small team-workflow tool. The source has no name, so I named it **Buckslip** (after the paper "buck slip" routing slip). Its one idea: every piece of work has one holder at a time, and it is passed on with initials and a note.
- Audience: leads and members of teams of 3 to 20 who lose track of who has a task when it changes hands.
- Job: get the visitor to put their work email in the form (sign up).

## Three directions considered

- A, "Interoffice envelope": borrows the kraft inter-office envelope with its printed routing grid, earlier names struck through, the current holder circled in ballpoint, and punched holes. Led by a live routing slip. Mid-tone kraft ground, condensed grotesk, flat printed rules.
- B, "Shift whiteboard": borrows the team whiteboard with magnetic name tiles and dry-erase columns. Led by a board of tiles. Light cool ground, rounded sans with a marker accent, cards with real elevation.
- C, "Dispatch console": borrows a dispatcher's split-flap status board. Led by a dense live table of who holds what. Dark ground, mono-led, dense and precise.

**Chosen: A.** The product's rule, one holder at a time passed on with initials, is exactly what the paper routing slip did, so teams recognize it at once. B drifts towards a generic kanban, and C suits ops tooling more than a small team.

## Signature

The live **routing slip** in the hero: a ruled grid (To / Note when passed / Date / Init.) with punched holes down the edge. Earlier holders are struck through in pen blue, the current holder (Dana) is circled, and the **"Pass it to Priya"** button (the original `onclick="go()"` handler) crosses Dana off, stamps her note, date and initials, and circles the next name. At the end the button reads "Close the slip", then "Route it again" to reset. The unit is the ruled routing row. It is reused in the "How a slip moves" steps, the "Your desk" legend, and the app figure (`hero.png`). The footer carries the envelope's own instruction: "Cross out the last name before passing it on".

## What was kept from SOURCE.html (render `--compare before.json`: 0 findings)

- h1: kept, rewritten from "🚀 Supercharge your workflow" to "Know who has it."
- "Get started" became **Start a slip**: it scrolls to the sign-up and focuses the email field.
- "Learn more" became **See how a slip moves**: it scrolls to the steps.
- The icon-only button is now the form's submit button, **Send my slip**. It keeps its icon (now an arrow, `aria-hidden`) plus a visible label.
- `div onClick="go()"` "Open" became a real `<button onclick="go()">`, labelled "Pass it to …". `go()` is now defined; in the source it was undefined.
- The Email input got a `<label>`, `id`/`name`, `type="email"` and `autocomplete`, plus a hint, error messages through `aria-describedby`/`aria-invalid`, and a success message in `role="status"`.
- `<img src="hero.png">`: kept, with `alt`, `width`/`height` and `loading="lazy"`. The source pointed at a hero.png that did not exist, so I generated `hero.png` (1200×750): a rendered view of the Buckslip "desk" in the same tokens. Replace it with a real product screenshot when one exists.
- The footer © line is kept and reads "© 2026 Buckslip".
- The three "01 Fast / 02 Secure / 03 Scalable" cards became three numbered steps of a real sequence (write the route, initial and pass, close it out).

## Invented content (all of it plausible example content, none of it presented as real proof)

- The product name "Buckslip", the slip number "No. 0412", and the slip "Vendor contract, redlines for Q4" with its notes and dates (Oct 27 to 31).
- People: Mara K., Joel R., Dana P., Priya S., Owen T., Sam W., Lee A., Ines M.
- "For teams of 3 to 20", the "two working days" rule for flagging a slip that sits, the "one tap nudges the holder" feature, and "One email, no newsletter".
- The desk counts in hero.png (3 / 4 / 1 / 11).
- No testimonials, customer logos, metrics or prices.

## States and how to reach them

- Slip: the default shows a mid-route state. Pressing the pass button 3 times passes it to Priya, then Owen, then closes it. A 4th press resets it.
- Form: submit with the field empty for the "enter your email" error, type `name@team` for the incomplete-address error, and enter a valid address for the success message.

## Critique rounds

- Round 1 (render): pen blue measured 4.49:1 on kraft for the 23px handwritten initials, so I darkened it from #1A33A8 to #172E9C. The wordmark link was 23px tall, so I added padding.
- Round 2 (screenshots): the steps repeated a "What you do" micro-label three times and left a hollow middle column. I removed the label (this was the accessory removed in step 8) and rebalanced the columns.

## Tool results (final)

- lint: floor 0 · reflex 0 · finish 0
- render: floor 0 · reflex 0 · finish 0, with `--compare before.json` clean (no lost fields, buttons, headings or handlers)
- tokens-check: 0 findings

## Reflex findings kept

None.
