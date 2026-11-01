# NOTES: 06-redesign

Budget: standard. Surface: marketing. Mode: redesign (rebuild: content and wiring kept, layout and copy rewritten).

## Ground (assumptions, since nobody could answer questions)

- Subject: a workflow tool for small teams. The source had no name, so I named it **Traveler**, after the job traveler card that goes along with work through a shop. The product is built around that idea: each task carries a ticket, and each handoff is signed for.
- Audience: leads of 3 to 30 person teams (studios, shops, small ops teams) who lose track of who has what.
- Job: get them to start a board (the email field).

## Three directions considered

- A, "Traveler ticket": borrows the job traveler card and the steel rail that tickets hang from. A buff card-stock ticket with red stamp marks leads the page, on a mid-dark steel ground. Condensed grotesk display, physical cards with real shadows.
- B, "Standup wall": borrows the team's whiteboard with magnets and marker. A full-bleed board of columns leads the page, on a light mid-tone ground, with a rounded sans and a hand-drawn marker accent. Illustrated surface.
- C, "Night shift log": borrows the shift handover logbook. A dark, dense, mono-led stream of timestamped handover entries leads the page. Flat hairlines.

**Chosen: A.** "Signed for" is the act the product is built on, and the traveler ticket shows it literally. B looks like every kanban tool's marketing page. C reads as a developer tool and sits close to R04b.

Accent candidates: stamp-pad red (rubber stamp ink), hold-tag yellow (shop tag stock), graphite (pencil initials). I chose stamp red because it marks a signed handoff, which is the product's core action. Yellow would read as a warning, so it became the "waiting on" status color. Graphite can't mark a state.
Display face candidates: Barlow Condensed (condensed industrial gothic), Zilla Slab (slab), Courier Prime (typewriter). I chose Barlow Condensed because travelers and shop tags are printed in condensed gothic, and typewriter felt nostalgic. Body is IBM Plex Sans; utility (ticket numbers, times) is IBM Plex Mono.

## Signature

The hanging ticket **No. 0418 "Spring catalog photos"** in the hero. It hangs from a steel rail that spans the full width, and its route rows show station, person, note, and either a red stamp or a yellow hold tag. It works: "Sign for it as Sam" presses a stamp onto the current row and passes the ticket to the next station. After the last station a FILED stamp lands, and "Put it back on the rail" resets the ticket. "Open full history" (the original `go()` handler) unfolds the two earlier handoffs. On load the ticket shows a typical state: 2 of 4 visible stations signed, one waiting on crop sizes.

Unit reused: the route row and its stamp/tag. It also builds the "A handoff, start to finish" table, the rail legend, the rail screenshot (hero.png), the "small print on the back of every ticket" panel, and the sign-up stub (perforated edge; errors carry a "Not sent" hold tag, success a "Started" stamp).

## Kept from SOURCE.html (verified with `render-check --compare before.json`: 0 F11)

- "Get started" became "Start a board" (scrolls to the form and focuses the email field).
- "Learn more" became "See how a handoff works" (scrolls to the how-it-works table).
- The icon-only button became "Sign for it as Sam": a stamp icon plus a visible label.
- `<div onClick="go()">Open</div>` became `<button onclick="go()">Open full history</button>`. `go()` was undefined in the source, so I defined it as the history toggle.
- `<input placeholder="Email">` became a labelled `type=email` field (`id/name=email`, a hint, inline errors).
- `<img src="hero.png">` stays as the rail screenshot with alt text, width and height, and lazy loading.
- The h1 was rewritten. The © line now says "© 2026 Traveler", in place of lorem ipsum.

## Invented content (not real, replace if needed)

- The product name "Traveler", all copy, and the product behaviours described: invite-only visibility, guests who see one ticket, adding stations.
- Ticket No. 0418 and its people (Lee, Mara, Dev, Ines, Sam), times, and notes; the six tickets on the rail.
- **hero.png was missing from the case folder.** I rendered a stand-in product screenshot of the rail at 1200×470 (@2x) so the image isn't broken. The layout accepts any 1200×470 screenshot in its place.
- There are no metrics, testimonials, logos, or prices.

## States and how to reach them

- Ticket: press "Sign for it as Sam" twice to reach the filed state; press again to reset. "Open full history" / "Hide earlier handoffs" toggles the earlier rows.
- Form: submit empty, or without an @, or with an incomplete domain, to get errors. These set `aria-invalid` and a message tied by `aria-describedby`. Submit a valid address to get the success message.

## Tool results (final)

- lint (`--design DESIGN.md`): floor 0, reflex 0, finish 0.
- render-check (320/768/1280/1920, `--compare before.json`): floor 0, reflex 0, finish 0.
- tokens-check DESIGN.md: floor 0, reflex 0, finish 0.

## Reflex findings kept

None. The source's R01, R02, R03, R05, R07, R09, R10, R11, and R12 were all removed, not kept. The numbered markers 1–4 in the handoff table encode a real sequence.

## Critique rounds

1. At 320, the ticket rows squeezed the notes into one word per line, so rows now stack with the stamp below. At 768, the ticket left a void on the right, so it is now full width. The hanging wire floated with no rail above it in stacked layouts, so it is now removed there. The rail screenshot was too small beside the copy, so it is now full width below the copy, and scrolls sideways at a fixed 760px under 560px.
2. The hero heading orphaned "KNOWS" / "IT", so "who has it" is kept together and the heading no longer uses balance. "Filed, nobody" was awkward copy and became "nobody, it is filed".

Accessory removed: the footer tagline ("For small teams that pass work along."), which repeated the hero.
