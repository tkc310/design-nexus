# DESIGN.md

## Subject

- Subject: Notification settings for Fieldwork, a project-management web app (boards, tasks, due dates, @mentions).
- Audience: Team members who already use the app daily and are tired of being pinged at the wrong time or in the wrong place.
- Job of the main surface: Route each kind of event to the right channel, and set the hours when nothing should reach them.
- Surface type: product

## Direction

"Reach ruler". The page answers "who can reach me, through what, and when". Events × channels sit in a routing table; time is drawn as a 24-hour ruler built from hour cells, with quiet hours as a night band and a live "now" marker. The same hour-cell strip, shrunk, sits in each channel's column header to show when that channel actually delivers. Signature: the 24-hour reach ruler.

## Tokens

```tokens
color.bg: #EFEFF0
color.surface: #FFFFFF
color.text: #1B1C20
color.muted: #55585F
color.accent: #C2410C
color.on-accent: #FFFFFF
color.border: #CFD1D6
color.night: #282A5E
color.danger: #B42318
color.success: #17703F
font.display: "Bricolage Grotesque", sans-serif
font.body: "Instrument Sans", sans-serif
type.base: 16px
type.ratio: 1.25
space.base: 4px
radius.default: 10px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/surface, on-accent/night, danger/surface, success/surface
```

Color sources: `bg` is the app canvas behind boards (true neutral); `surface` is the task card; `text` is card ink; `accent` is the unread badge, the thing these settings route; `night` is the quiet-hours band; `danger`/`success` are status only.

## Patterns

- Buttons: primary = accent fill, white label, 6px radius, 40px tall; secondary = surface with border; press scales to 0.97.
- Inputs and forms: label above, help below in muted 15px, error in danger with an icon-free sentence tied by `aria-describedby`; validation on change and blur. Times are 24-hour selects in 15-minute steps (native time inputs show 12-hour AM/PM in some locales, which disagreed with the ruler).
- Cards / panels: white panels on the canvas, 1px border plus a soft two-layer shadow, 10px radius.
- Tables: routing table, events as row headers, channels as column headers; stacks to a 3-column switch grid under 640px.
- Navigation: left sidebar (app + settings), collapses into a Menu button under 900px.
- Motion: switch thumb and button press only, 140ms; removed under reduced motion.

## Page overrides

None.

## Looks used

- Notifications settings — light, neutral grey ground, vermilion badge accent with a night-indigo band, grotesk display + neo-grotesk body, panels with soft real elevation.

## Learnings

- 2026-10-31: Rejected a mono-label "switchboard" look (patch-bay sockets) as too close to the agent house look; rejected a dark night-shift theme because settings are used in the day.
- 2026-10-31: Slack connect callout sits below the routing table, not above, so the channel strips appear in the first screen at 320px.
- 2026-10-31: Removed the "Delivering" legend swatch; the labeled night band is enough to read the ruler.
