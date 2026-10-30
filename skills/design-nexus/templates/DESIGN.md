# DESIGN.md

The single source of truth for this project's design. Agents read it before any UI work and update it after. Keep it short; link to code for detail.

## Subject

- Subject:
- Audience:
- Job of the main surface:
- Surface type: marketing | product | mobile | content

## Direction

One paragraph: the concept, what it borrows from the subject's world, and the signature element.

## Tokens

Machine-readable. `scripts/tokens-check.mjs` and `scripts/lint.mjs --design` parse this block.

```tokens
color.bg: #F3F6F7
color.surface: #FFFFFF
color.text: #1E2328
color.muted: #4A5560
color.accent: #0E6E7E
color.on-accent: #FFFFFF
color.border: #CFE3E6
color.danger: #B42318
dark.color.bg: #0F1417
dark.color.surface: #172026
dark.color.text: #E6ECEF
dark.color.muted: #A5B3BC
dark.color.accent: #5CC2D1
dark.color.on-accent: #0F1417
font.display: "Fraunces", serif
font.body: "Source Serif 4", serif
font.utility: "IBM Plex Mono", monospace
type.base: 17px
type.ratio: 1.25
space.base: 4px
radius.default: 2px
pairs: text/bg, muted/bg, text/surface, on-accent/accent, accent/bg
```

## Patterns

- Buttons:
- Inputs and forms:
- Cards / panels:
- Tables:
- Navigation:
- Motion:

## Page overrides

Pages that intentionally deviate. Format: `path — what differs — why`.

## Learnings

Dated notes on what worked, what was rejected, and user feedback. Agents append here during retro.
