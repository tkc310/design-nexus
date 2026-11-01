# DESIGN.md

## Subject

- Subject: Kestrel, a project-management web app; this file covers its account settings, starting with Notifications.
- Audience: team members who get too many pings, or worry about missing assigned work, and want to choose what reaches them where.
- Job of the main surface: route each event to the channels the person wants, then save.
- Surface type: product

## Direction

"Switchboard". Notification routing is literally a patch panel: events are inputs, channels are outputs, and every crossing is a jack that is lit or dark. The routing matrix is a dark graphite faceplate set into an otherwise quiet, neutral settings page; amber lamps mark live routes. The lamp cell is the unit: the quiet-hours strip is 24 of the same cells (lit = delivered, dark = held), and the disconnected Slack column is a row of unplugged jacks with a connect row on the same faceplate.

## Tokens

```tokens
color.bg: #F1F1F1
color.surface: #FFFFFF
color.text: #1C1E22
color.muted: #565B63
color.faceplate: #24272C
color.faceplate-muted: #A9AEB6
color.accent: #F2A516
color.border: #84898F
color.danger: #B3261E
color.success: #1C7A43
font.display: "Barlow Condensed", sans-serif
font.body: "IBM Plex Sans", sans-serif
type.base: 16px
type.ratio: 1.2
space.base: 4px
radius.default: 6px
pairs: text/bg, muted/bg, text/surface, muted/surface, border/surface, bg/faceplate, faceplate-muted/faceplate, accent/faceplate, danger/surface, success/surface
```

Roles and sources:
- `bg` #F1F1F1: the app chrome, a true neutral so the faceplate is the only material on the page.
- `surface` #FFFFFF: settings panels.
- `text` #1C1E22 / `muted` #565B63: graphite ink; muted only at 15px and up.
- `faceplate` #24272C: the switchboard panel (powder-coated rack steel). Its dividers are grooves in `text`.
- `faceplate-muted` #A9AEB6: engraved secondary labels and unlit jack rings.
- `accent` #F2A516: the indicator lamp of a live route. Only used for "this will notify you". Never a button fill.
- `border` #84898F: field edges (3:1 on white).
- `danger` / `success`: save and validation feedback only.

Accent candidates: lamp amber (switchboard indicator, 40°), cobalt selection blue (the app's link color, 225°), signal green "line open" (145°). Chosen amber: a lit route is a lamp, and green would collide with the success state of the save flow; blue is the color of every settings page and says "selected", not "live".

Display candidates: Barlow Condensed (engraved patch-panel lettering, condensed grotesk), IBM Plex Mono (terminal labels, mono-led), Source Serif (document heading, serif). Chosen Barlow Condensed: rack and switchboard labels are condensed caps; mono would push toward the agent house look.

Type scale (1.2 from 16): 14 / 16 / 19 / 23 / 28. Body IBM Plex Sans 400/500/600, tabular figures for times.

## Patterns

- Buttons: primary = graphite fill (`text`) with white label, 40px high, 6px radius; secondary = 1px `border` outline on white; text buttons for Discard. Press scales to 0.97.
- Inputs and forms: labels above, helper below at 14px in `text`, error text in `danger` with an icon, `aria-describedby` + `aria-invalid`. Validation on change and blur.
- Cards / panels: white on `bg`, no border, 10px radius, no shadow. Only the faceplate has elevation (it is a physical panel).
- Matrix (signature): a real `<table>`, each jack an `<input type="checkbox">` drawn as a 40px cell with a 14px lamp.
- Save: one sticky strip holding status (change count / saved time / error), Discard, and Save changes. From 560px it sits under the page title and sticks to the top (DOM order matches, so focus reaches it before the matrix); below 560px it is a one-line bar stuck to the bottom. Ctrl/Cmd+S saves.
- Navigation: top app bar + settings sub-nav (left column ≥ 960px, wrapping row below).
- Motion: lamp on/off fades (opacity, 120ms); save bar status swaps without movement. Reduced motion removes the button press scale.

## Page overrides

## Looks used

- settings/notifications — light neutral ground (#F1F1F1) with one dark graphite faceplate, amber accent (40°), condensed grotesk display + humanist-leaning grotesk body, flat panels + one elevated physical panel.

## Learnings

- 2026-11-01: rejected a radial 24-hour quiet-hours dial (pretty but hard to operate by keyboard and illegible at 320); the linear 24-cell strip reuses the jack unit instead.
- 2026-11-01: a bottom sticky save bar covered the quiet-hours and test panels at 768–1920 on the default render; moved it under the title (sticky top) from 560px up.
- 2026-11-01: rejected amber as the Save button fill: amber means "live route" on this page, so the primary action is graphite.
