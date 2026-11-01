# DESIGN.md

The single source of truth for this project's design. Agents read it before any UI work and update it after.

## Subject

- Subject: Tasklane, a project-management web app; this file starts with its Notifications settings screen.
- Audience: people on project teams (engineers, designers, PMs) who already use the app daily and either get pinged too much or fear missing work assigned to them.
- Job of the main surface: choose which events reach them on which channel, then save.
- Surface type: product

## Direction

"Channel strips". The source object is a broadcast/recording mixing console: every input has its own vertical channel strip with a tape label at the top, a column of square backlit push caps, a signal lamp, and a legend printed once at the side for all strips. The usual notifications page (white ground, Inter, a stack of cards with blue pill toggles, soft shadows) is replaced by: a graphite panel ground (console paint), condensed silkscreen-style lettering (Barlow Condensed) for the title, channel names, and row legends, square lit caps (native checkboxes) as the main control — lit amber means "on", dark means "off", always with On/Off text — and a cream tape band naming each channel. Status lamps follow console meaning: green = connected/saved, red = error. Quiet hours and the save bar are built from the same strip unit (a full-width master strip with its own tape band and a 24-segment hour ladder). Object words kept out of the copy: console, mixer, fader, mute, solo, talkback, bus, gain, clip, patch, signal, channel strip, scribble strip. Signature: the three channel strips with row legends shared across them.

## Tokens

```tokens
color.bg: #1E2226
color.surface: #2A3036
color.text: #ECEEF0
color.muted: #A9B2BA
color.border: #7D8892
color.accent: #F4B740
color.on-accent: #1A1C1E
color.tape: #E8E1CF
color.success: #5ACB7E
color.danger: #FF8A7A
font.display: "Barlow Condensed", sans-serif
font.body: "Source Sans 3", sans-serif
font.utility: "Barlow Condensed", sans-serif
type.base: 16px
type.ratio: 1.25
space.base: 4px
radius.default: 4px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/surface, border/surface, border/bg, on-accent/tape, success/surface, danger/surface, danger/bg
```

## Patterns

- Buttons: one filled amber button per view (Save changes, in the sticky footer). Secondary actions are outlined in `border` with `text` ink. 4px radius, press scale 0.97.
- Inputs and forms: fields filled with `bg` on the `surface` strip, 1px `border` (≥3:1), labels above, help below, errors in `danger` tied with aria-describedby.
- Toggles: native checkbox drawn as a square cap, 32×24; checked = amber fill with a soft glow plus "On" text; unchecked = dark `bg` cap with a 1px `border` edge plus "Off" text; disabled = dashed edge. No bevel (removed as the page's one accessory).
- Cards / panels: strips are flat `surface` panels, 6px radius, 1px hairline in a mix of border and surface; no drop shadows.
- Navigation: settings sections as a left column at ≥1024px, a wrapping row above that.
- Save: a sticky dock at the end of the page (status lamp + text, Discard, Save changes); a save failure opens an alert band directly above it with Try again.
- Motion: color and glow only, 120ms ease; reduced motion removes the press scale.

## Page overrides

None yet.

## Looks used

- Notifications settings — dark graphite ground (cool neutral), amber accent, condensed grotesk display + humanist sans body, flat panels with lit caps.

## Learnings

- 2026-11-01: Rejected "breaker panel" (mid-tone enamel, lever toggles): quiet hours and Slack connection had no natural home. Rejected "interoffice routing slip" (buff paper, typewriter mono, ruled grid): lands on the agent house look (R04d).
- 2026-11-01: Event names are printed once in a legend column at ≥701px (each cap row then shows only its On/Off state, with the full name kept for screen readers); below 701px each strip shows its own row names and the legend follows the strips. The page title sits in the legend column beside the tape labels so the column has no empty top.
