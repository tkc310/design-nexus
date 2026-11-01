# DESIGN.md

## Subject

- Subject: Plotline, a project-management web app; this file covers its account settings screens.
- Audience: team members (designers, engineers, PMs) who want to stay reachable without being interrupted all day.
- Job of the main surface: set which events reach them on which channel, then save.
- Surface type: product

## Direction

"Routing faceplate". The source object is the X-Y control unit of a broadcast routing switcher: a black anodized rack faceplate with rows of backlit square keys, condensed engraved legends, and a separate commit key that lights while a change is staged. The usual settings page (white cards, Inter, iOS toggle switches, blue Save) is replaced in two places: the display lettering is a condensed caps face taken from the key legends (page title, channel and event names, key states, section titles), and the main control is a grid of square keys (native checkboxes) that are lit cool-white when on and dark when off, with an amber top edge while a change is unsaved. The faceplate material is reused for the quiet-hours strip (48 half-hour cells, lit when notifications arrive) and for the sticky save bar, whose save key is the only amber fill. Words from the object kept out of the copy: take, route, crosspoint, source, destination, bus, salvo, preset, router, panel, tally. Signature: the events-by-channel faceplate.

## Tokens

```tokens
color.bg: #F2F2F2
color.surface: #FFFFFF
color.text: #1A1C1F
color.muted: #565B62
color.accent: #F5A524
color.danger: #B3261E
color.success: #1F7A45
color.plate: #23262A
color.legend: #C4C9CF
color.lit: #EEF3F6
color.cap-edge: #8A9199
font.display: "Sofia Sans Extra Condensed", sans-serif
font.body: "Sofia Sans", sans-serif
type.base: 16px
type.ratio: 1.25
space.base: 4px
radius.default: 4px
pairs: text/bg, muted/bg, text/surface, text/accent, legend/plate, text/lit, danger/bg, success/bg, accent/plate, cap-edge/plate, lit/danger
```

## Patterns

- Buttons: one amber commit key (save) per view, condensed caps legend; outlined ink buttons for secondary actions on the light ground; outlined lit buttons on the faceplate; underlined text buttons for discard/disconnect.
- Inputs and forms: labels above, 44px fields on white with a #565B62 border, hints below at 16px muted, errors in danger with a 3px left rule, tied by aria-describedby.
- Toggles: a key = native checkbox under a square cap. Lit cool-white = on, dark cap = off, amber top edge = changed but unsaved, dashed edge = unavailable (channel not connected).
- Cards / panels: no cards. The faceplate (#23262A, 6px radius) is the only panel material.
- Tables: matrices are rows of keys under column heads; below 640px each row becomes a block with the channel name printed on each key.
- Navigation: settings sidebar at 900px+, a tab row below.
- Motion: color transitions 120ms; 0.97 press scale on keys and buttons, removed under reduced motion.

## Page overrides

None.

## Looks used

- Notifications settings: light true-neutral ground with a dark graphite faceplate band, cool-white lit marks, amber commit accent; condensed grotesk display + humanist-leaning sans body (Sofia Sans family); flat panel with a backlight glow on lit keys only.

## Learnings

- 2026-11-01: Rejected amber for the "on" state: it would put many amber fills on screen and blur the save key's meaning. Amber is kept for "unsaved" and "save".
- 2026-11-01: Rejected a fully dark page: settings pages are visited in daylight between tasks; the faceplate band carries the material without darkening every form field.
