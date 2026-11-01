# DESIGN.md

## Subject

- Subject: grepline, an open-source Rust CLI that filters structured log lines (JSON, logfmt) across many files with a SQL-like expression such as `level=error and latency_ms>500`.
- Audience: backend and SRE engineers who already live in a terminal, distrust marketing, and want to see the filter work before they install anything.
- Job of the main surface: get them to run the install command (copy it).
- Surface type: marketing

## Direction

"Edge-notched records." Source object: the McBee Keysort edge-notched card, the paper tool that filtered a stack of structured records by field: each edge hole is a field value, the holes that match are notched open to the edge, and a needle run through the stack lets the matching records fall out. It departs from the usual dev-tool landing page (near-black ground, mono-led type, fake terminal window with traffic-light dots, acid-green accent, flat dark feature cards) on ground value (light buff stock), display genre (condensed grotesk caps, from the card's printed field captions), the look of the data mark (match = a red slot notched from the row edge to its hole, and the row steps out of line; no match = an intact ring) and surface (light record panels with one soft elevation). Card properties used: printed condensed caps captions -> display face for the wordmark, headings and table/field captions; notched vs intact hole -> the match state of each log line in the hero and of each sample line in the syntax table strips; the card's ruled field divisions -> double rules under the header and between sections, and the field captions above values in the formats section; the habit of matching cards dropping out of the stack -> matched rows shift 8px out to the panel edge. Words kept out of the copy: card, deck, stack, needle, notch, punch, hole, Keysort, drop, sort. Signature: the notch edge on every record row, live against the editable filter.

## Tokens

```tokens
color.bg: #ECE2C8
color.surface: #F8F3E5
color.text: #1E1A14
color.muted: #594F40
color.accent: #A3162A
color.on-accent: #F8F3E5
color.border: #8A7C62
font.display: "Archivo", sans-serif
font.body: "Archivo", sans-serif
font.utility: "IBM Plex Mono", monospace
type.base: 17px
type.ratio: 1.25
space.base: 8px
radius.default: 6px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/bg, accent/surface, border/surface
```

Display and body share the Archivo family on purpose: display uses its condensed width (62%) in heavy caps, body its normal width (100%) at 400. The width axis is the voice, not a second family.

Colors and sources:
- stock `#ECE2C8` ground: buff manila card stock.
- face `#F8F3E5` panels: the unhandled face of a fresh card.
- ink `#1E1A14` text: the card's black print.
- muted `#594F40` secondary text and non-matching lines: faded print.
- ruling `#8A7C62` borders, rings, field rules: the card's printed field ruling.
- red `#A3162A` accent: the red printing used for the card's hole row; on the page it marks only matches and the copy button.
- Accent candidates: ruling red (saturated signal), sorting-steel gray `#4A5560` (near-neutral), carbon-copy violet `#4B3F8F` (muted ink, about 115 degrees away). Chosen red because the card prints its hole row in red so the eye finds the match positions; steel gave the matches no pull against the ink text, violet had no tie to filtering.
- Display candidates: condensed grotesk (Archivo at 62% width, from the printed field captions), slab (typewriter fill-ins, too close to mono code), mono-led (the usual look). Chosen condensed grotesk.

## Patterns

- Buttons: one filled red button per screen (copy install command); secondary copy buttons are 1.5px ruling outlines. 6px radius, `:active` scale 0.97, 2px ink focus outline with 2px offset.
- Inputs and forms: the filter field is a native text input on the face color with a 1.5px ruling border; errors appear in the status line below the records, tied by `aria-describedby`.
- Cards / panels: face color, 1px ruling border, 6px radius, one shadow `0 1px 0 ruling, 0 8px 24px rgba(30,26,20,.10)` for the hero record panel only.
- Tables: field captions in condensed caps; rows separated by 1px ruling; below 640px each row becomes a labelled block.
- Navigation: wordmark + three anchor links; no filled nav action.
- Motion: matched rows translate 8px left in 160ms ease-out; none under reduced motion.

## Page overrides

None.

## Looks used

- 2026-11-01 grepline landing: light, buff ground (hue ~43) with crimson accent (hue ~352), condensed grotesk display + same-family body + mono utility, ruled panels with one soft elevation.

## Learnings

- 2026-11-01: Rejected a dark logic-analyzer direction (too close to the usual near-black dev-tool look) and a yellow field-book direction (loud, but the field book records, it does not filter). Rejected red double rules on every divider: diluted the red that means "match".
