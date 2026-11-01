# DESIGN.md

The single source of truth for Plotboard's settings screens. Read before UI work; update after.

## Subject

- Subject: Plotboard, a project-management web app for small studio teams; this surface is the personal Notifications settings page.
- Audience: team members who already use Plotboard daily and either miss things or get pinged too much; they want control without the fear of missing a mention.
- Job of the main surface: route each event to the channels that should ring, and set when the board stays quiet.
- Surface type: product

## Direction

"Switchboard". Notification routing is literally what a telephone switchboard did: lines (events) patched to stations (channels), with a lamp that lights when a call will come through. The page borrows the lamp-key: a raised square key that lights amber when that event will reach that channel. The signature is the lamp-key matrix (events x channels). The same key unit builds the 24-hour quiet-hours ribbon (one key per hour, dark when the board is quiet) and the channel lamps in the test-notification panel, so the page reads as one board.

## Tokens

```tokens
color.bg: #F2F2F2
color.surface: #FFFFFF
color.text: #1C1F24
color.muted: #565C66
color.accent: #F2A516
color.accent-ink: #8A5A00
color.border: #7C818B
color.rule: #D5D7DB
color.night: #27303F
color.danger: #B3261E
color.success: #1E7A46
font.display: "Barlow Condensed", sans-serif
font.body: "Public Sans", sans-serif
type.base: 16px
type.ratio: 1.25
space.base: 4px
radius.default: 6px
pairs: text/bg, muted/bg, text/surface, muted/surface, text/accent, accent-ink/surface, border/surface, danger/surface, success/surface
```

design-nexus: keep R08 because 11 tokens = 8 core roles plus three state colors (night for quiet hours, danger, success) that the brief's quiet-hours and save states require.

Roles and sources:

- `bg` #F2F2F2 — true neutral ground; the enamel of the board, no tint.
- `surface` #FFFFFF — panels (the key shelf).
- `text` #1C1F24 — bakelite black of the keys and the operator's labels; also the primary button fill and the check on a lit key.
- `muted` #565C66 — secondary text 16px and up only.
- `accent` #F2A516 — the lit lamp: an event that will ring through on that channel. Never used for text.
- `accent-ink` #8A5A00 — the lamp's brass rim: lit-key border, focus ring, accent text.
- `border` #7C818B — unlit key rim and form-field borders (3:1+ on surface).
- `rule` #D5D7DB — decorative hairlines only, never a control edge.
- `night` #27303F — quiet hours: the board after hours.
- `danger`, `success` — status only (validation, save result).

Accent candidates: lamp amber (switchboard line lamp, hue ~40), patch-cord red (hue ~5), station-plate blue (hue ~220). Chosen amber because a lit lamp means "this line will come through", which is exactly what an on cell means here; red would collide with errors and the unread-badge alarm, and plate blue is the house look and carries no state.

Display face candidates: "Barlow Condensed" (condensed grotesk, like engraved switchboard plates and station labels), "IBM Plex Mono" (mono-led, terminal), "Fraunces" (serif, editorial). Chosen Barlow Condensed because the board's own lettering is condensed caps on narrow plates, and it fits channel heads in narrow columns. Body: Public Sans 400/600 for plain, legible form copy with tabular figures for times.

Scale (1.25): 14 / 16 / 20 / 25 / 31 px. Loaded from Google Fonts with `display=swap`.

## Patterns

- Buttons: primary is an ink-filled key ("Save changes"), secondary is an outlined key; `:active` scales to 0.97. Labels never wrap.
- Inputs and forms: labels above, 1.5px `border` rim, 6px radius, helper text below at 14px in ink; errors in `danger` with an icon, tied by `aria-describedby`, validated on change/blur and on save.
- Lamp key: 40px square native checkbox (44px below 640px), raised with a 2px inner bottom shadow; lit = `accent` fill + `accent-ink` rim + ink check; unavailable = dashed rim, check kept at reduced opacity.
- Cards / panels: white, 1px `rule` hairline, 8px radius, no shadow.
- Tables: the matrix is a real `<table>` with row and column headers; each key has an aria-label "<event> by <channel>".
- Navigation: left settings sidebar with the current page marked; it becomes a wrapped link row below 900px.
- Save bar: a white bar at the end of the form, spanning the board at every width; holds the save status (role=status) on the left and Discard (only when there are changes) + "Save changes" on the right. Save stays aria-disabled until something changes; a failed save relabels it "Try saving again".
- Quiet-hours ribbon: 24 hour keys in two rows of 12 (side by side from 640px to 1199px), 28px high (36px in the side-by-side layout); quiet hours in `night`, ringing hours as a pale lamp, the current hour outlined in ink. Times follow the viewer's locale.
- Slack connection: disconnected = dashed strip with "Connect Slack" and dashed, disabled Slack keys that keep their saved state; connected = filled strip linking to Integrations (disconnecting lives there, not here).
- Motion: one moment — when a test is sent, the lit keys of each channel that received it flash once (240ms, staggered 60ms). Button press 120ms. Removed under `prefers-reduced-motion`.

## Page overrides

None.

## Looks used

- Notifications settings — light, true-neutral ground, amber lamp accent with dark night slate, condensed grotesk display + neo-grotesk body, raised keys on hairline panels.

## Learnings

- 2026-10-31: Removed the sticky save bar: at 1280 it covered the test panel heading on load. Removed the amber halo around lit keys (decoration; the fill and rim already carry the state).
- 2026-10-31: Rejected a list of per-channel toggle switches (every settings page has it) in favor of the lamp-key matrix. Rejected a dark "after hours" palette for the whole page: quiet hours are one part of the job, so night colors only mark the quiet hours.
