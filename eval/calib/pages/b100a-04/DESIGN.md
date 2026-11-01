# DESIGN.md

## Subject

- Subject: Ridgeline, a project-management web app (tasks, boards, docs); this file covers its account settings screens.
- Audience: people on a project team who get pinged too much or miss the one ping that mattered; they know the app well and want control without reading a manual.
- Job of the main surface: route each kind of update to the channels the person wants, and save it.
- Surface type: product

## Direction

"Routing pegboard": the notifications screen is a switchboard. Events are rows, channels are columns, and every crossing is a square peg cell that is either filled (this update reaches you here) or empty. The same 36px peg cell builds the quiet-hours day strip (24 hour cells, running noon to noon so the night is one block) and the test-notification delivery row. Graphite pegs on white cards, one magenta accent taken from the app's @mention chip, used only for the primary action and focus. Signature: the peg matrix.

## Tokens

```tokens
color.bg: #F4F4F4
color.surface: #FFFFFF
color.text: #1C1E22
color.muted: #565B64
color.accent: #B0175F
color.border: #868B94
color.hair: #D9DADC
color.night: #3E4270
color.danger: #B42318
color.success: #1E7B47
font.display: "Archivo", sans-serif
font.body: "Instrument Sans", sans-serif
type.base: 16px
type.ratio: 1.25
space.base: 4px
radius.default: 6px
pairs: text/bg, muted/bg, text/surface, muted/surface, surface/accent, accent/bg, border/surface, night/surface, danger/surface, success/surface
```

## Patterns

- Buttons: one filled magenta "Save changes" per screen, in the page head beside the title, with the save status under it. Secondary actions are outlined (1px border token, ink text). Press: scale(0.97).
- Inputs and forms: labels above, helper below at 14px ink, 1px border token (3.3:1 on white), 6px radius. Errors in danger red under the field, tied with aria-describedby, validated on change and blur.
- Peg cell: 36px square, 6px radius. Off = white with border token; on = graphite fill with white check; unavailable = dashed border, no fill. Night cells (quiet hours) use the night token. Test-delivery pegs: ink dot = ready, success fill = sent, danger border = failed, dashed = skipped.
- Cards / panels: white, 10px radius, one soft shadow plus a hairline. Only the routing matrix and the side panels are cards.
- Tables: the routing matrix is a real table; below 640px each row becomes a block with captioned pegs.
- Navigation: app bar on top, settings list on the left at 1024px and up, a scrolling tab strip below that.
- Motion: peg fill and toast fade only, 120–200ms ease-out; removed under reduced motion except opacity.

## Page overrides

None yet.

## Looks used

- Notifications settings: light, true-neutral gray ground with magenta accent (hue ~330), wide grotesk display (Archivo) + humanist-grotesk body (Instrument Sans), white cards with soft elevation and graphite peg cells.

## Learnings

- 2026-11-01: Rejected a 24-hour clock dial for quiet hours (hero-sized, pushes the matrix below the fold, hard to read at 320px); a linear noon-to-noon strip built from peg cells keeps the night contiguous and reuses the signature unit.
- 2026-11-01: Rejected magenta-filled "on" pegs: twelve filled accent squares would compete with Save. Pegs are graphite; magenta stays rare.
- 2026-11-01: Rejected a sticky bottom save bar: in full-page captures and at 320px it sat over the matrix rows. Save lives in the page head instead (product convention: the primary action sits next to the title).
