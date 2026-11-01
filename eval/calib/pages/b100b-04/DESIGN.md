# DESIGN.md

## Subject

- Subject: Trestle, a project-management web app; this file covers its account settings, starting with Notifications.
- Audience: people on project teams (engineers, designers, leads) who get too many pings and want to choose what reaches them, where, and when.
- Job of the main surface: route each event to the channels that should carry it, then save.
- Surface type: product

## Direction

"Switchboard". The notifications page is a patch panel: events are rows, channels are columns, and every route is a jack that lights in patch-cord magenta when it is live. The jack (a 44px square cell, 6px radius) is the unit of the page: the quiet-hours 24-hour strip is a row of the same cells (one per hour, split into halves), and the channel heads and the test result light the same jack shape. Everything else stays quiet: neutral board ground, white panels, a condensed grotesk for designation labels.

## Tokens

```tokens
color.bg: #F3F3F3
color.surface: #FFFFFF
color.text: #1C1B1F
color.muted: #5C5C61
color.accent: #B0175F
color.on-accent: #FFFFFF
color.border: #7A7A80
color.hairline: #DCDCDC
color.danger: #B8290B
color.success: #1D7339
font.display: "Archivo", sans-serif
font.body: "Public Sans", sans-serif
type.base: 16px
type.ratio: 1.25
space.base: 4px
radius.default: 6px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/surface, border/surface, danger/surface, success/surface
```

## Patterns

- Buttons: one filled magenta action per view (Save changes: in the sticky page header from 640px, in a one-line fixed bottom bar below that). Secondary actions are outlined in ink (Send test notification, Connect Slack). Text buttons for Discard. Labels never wrap.
- Inputs and forms: labels above, helper below at 14px in ink, 1px border in `border` (3:1 on white), 2px magenta focus ring offset 2px. Errors: danger text with an icon, tied by `aria-describedby`, field gets `aria-invalid`.
- Jacks (routing toggles): `button[aria-pressed]`, 44×44, white with `border` outline when off, magenta fill with white check when on, hatched and dashed when the channel is not connected.
- Cards / panels: white on the board ground, 10px radius, 1px hairline plus a 1px shadow; no nested cards.
- Navigation: settings sidebar at 960px and up; below that, one swipeable row of links (group names kept for screen readers).
- Motion: jack fill and toast enter only (opacity/transform, 120–200ms, ease-out); removed movement under reduced motion.

## Page overrides

None yet.

## Looks used

- Settings / Notifications — light, true-neutral gray ground, magenta accent (hue ~330), condensed grotesk display + neo-grotesk body, white panels with hairline + faint shadow.

## Learnings

- 2026-11-01: rejected a dial/clock face for quiet hours (hard to operate, poor at 320px) in favour of a 24-cell strip that reuses the jack unit. Rejected mono micro-labels for time figures (agent house look); times use tabular figures in the body face.
- 2026-11-01: removed small connection swatches above the channel column heads; the Slack callout and the hatched jacks already carry that state.
