# DESIGN.md

## Subject

- Subject: Notification settings in a project-management web app (sample workspace "Meridian Studio").
- Audience: Team members (designers, engineers, PMs) who get too many pings, fear missing an assignment, and don't want reminders at 2 a.m.
- Job of the main surface: Decide which project events reach them, on which channel, and when to hold them.
- Surface type: product

## Direction

"Switchboard and night band." The page is the real data structure: an event × channel matrix where every "on" switch is a lit amber lamp, like a switchboard. Quiet hours are drawn on a 24-hour day strip in the night color, wrapping past midnight, with an amber tick where held notifications are delivered. Signature: the 24-hour day strip, which redraws live as start, end, and timezone change and shows the validation error in place.

## Tokens

```tokens
color.bg: #F3F3F3
color.surface: #FFFFFF
color.text: #1C1D1F
color.muted: #595D63
color.accent: #B45309
color.on-accent: #FFFFFF
color.border: #D9D9D9
color.control: #6B7077
color.night: #232A3D
color.danger: #B42318
color.ok: #26683A
font.display: "Bricolage Grotesque", sans-serif
font.body: "Hanken Grotesk", sans-serif
type.base: 16px
type.ratio: 1.2
space.base: 4px
radius.default: 6px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/surface, control/surface, danger/surface, ok/surface, on-accent/night
```

Sources: `bg` is neutral app chrome (no tint, no source needed); `accent` is a lit switchboard lamp, used only for "on" switches, the primary action, the current nav item, and the delivery tick; `night` is the overnight hours themselves, used only for the quiet band and the workspace mark; `danger`/`ok` are status only.

## Patterns

- Buttons: 40px tall, 6px radius. Primary = lamp amber with white text, one per view (Save changes). Secondary = white with control border. Quiet = underlined text.
- Inputs and forms: labels above, helper below, error text between field and helper, tied with `aria-describedby`. Validation on blur, re-checked on change once an error shows.
- Switches: `input[type=checkbox][role=switch]`, 40×24, off = outlined gray knob, on = filled amber.
- Cards / panels: white, 1px hairline border, 10px radius, no shadow. Only toasts carry a shadow, because they float.
- Tables: the event × channel matrix is a real `<table>`; below 640px each row reflows to a block with visible channel labels.
- Navigation: left sidebar ≥901px, wraps into a top row below.
- Save: sticky top bar holds the page title, a save-state line (dot + text), Discard when dirty, and the one primary button. Toasts use the verb: "Save changes" → "Notification settings saved".
- Motion: switch knob 160ms ease-out, band 200ms, toast 220ms rise; reduced motion keeps only color/opacity.

## Page overrides

## Looks used

- Notifications settings: light, true-neutral gray ground, amber accent with deep-navy night band, grotesk (Bricolage Grotesque display + Hanken Grotesk body), flat hairline panels.

## Learnings

- 2026-10-31: Rejected an ink-blue accent (house look) and a pale tinted paper ground with no source; rejected a 24-hour circular dial (hard to read at 320px, labels under 12px).
