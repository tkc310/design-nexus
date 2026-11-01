# DESIGN.md

The single source of truth for this project's design. Agents read it before any UI work and update it after.

## Subject

- Subject: Gantry, a project-management web app; this file covers its account settings screens.
- Audience: people on project teams (leads, designers, engineers) who get too many pings and want only the ones that matter, where they want them.
- Job of the main surface: route each kind of update (mentions, assigned tasks, due-date reminders, weekly digest) to the channels the user wants, and keep nights quiet.
- Surface type: product

## Direction

"Routing grid". The notifications page is a switchboard: events are rows, channels (email, push, Slack) are columns, and every crossing is a cell you switch on. The cell is the unit: the same hairline cell builds the routing grid, the "hold during quiet hours" row, the weekly-volume footer, and the 24-cell quiet-hours clock strip. Signature: the routing grid with a live "about N a week" footer under each channel, so turning a cell on shows the cost in pings.

## Tokens

```tokens
color.bg: #F4F4F4
color.surface: #FFFFFF
color.text: #1D1F23
color.muted: #575B62
color.accent: #A3195B
color.border: #7D8189
color.rule: #D6D7DA
color.night: #2E3A59
color.danger: #B3261E
color.success: #1F6F43
font.display: "Archivo", sans-serif
font.body: "IBM Plex Sans", sans-serif
type.base: 16px
type.ratio: 1.25
space.base: 4px
radius.default: 4px
pairs: text/bg, muted/bg, text/surface, muted/surface, surface/accent, accent/surface, danger/surface, success/surface, border/surface, night/surface
```

- `bg` is the app canvas (true neutral; no tint source in the subject). `surface` is the settings panel.
- `accent` is the @mention highlight used in Gantry task comments; here it means "this route is on". Candidates were the mention magenta (chosen), a switchboard-lamp amber (rejected: reads as warning next to due-date reminders), and a link ink-blue (rejected: every settings page has it, and it would collide with links).
- `night` fills quiet hours on the clock strip.
- `danger` / `success` are status only (validation, save result, test result).

## Patterns

- Buttons: primary = accent fill, white label, 4px radius, 40px tall; secondary = surface with 1px `border`; text buttons for Discard. Labels never wrap.
- Inputs and forms: labels above, help below at 14px in body ink, errors below in `danger` with an icon-free sentence that says the fix, tied with `aria-describedby`. Validate on change and blur.
- Cards / panels: one white panel per section, 1px `rule` border, 8px radius, no shadow. Only the sticky save bar has elevation, because it floats over content.
- Tables: the routing grid is a CSS grid of hairline cells; each cell holds one labeled checkbox drawn as a switch cell.
- Navigation: settings sidebar at 960px+, wrapped tab row below.
- Motion: 120ms color/opacity on cells and buttons only; none under `prefers-reduced-motion`.

## Page overrides

None.

## Looks used

- Notifications settings — light neutral ground (#F4F4F4), magenta accent (hue ~330), grotesk display (Archivo semi-condensed) + humanist-leaning sans body (IBM Plex Sans), flat hairline cells, no shadows.

## Learnings

- 2026-10-31: Rejected a dark "night clock" direction for the whole page: quiet hours are one section, not the page's job. Rejected per-channel cards: they hide the comparison across channels that the grid makes obvious.
- 2026-10-31: A sticky save bar overlapped grid text at 768 (R21); moved to a static panel at the end of the flow. Removed a red inset stripe on the Slack notice: "Not connected" in the header already says it.
