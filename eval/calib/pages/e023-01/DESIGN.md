# DESIGN.md

## Subject

- Subject: grepline, an open-source Rust CLI that filters JSON and logfmt log records across many files with a SQL-like expression.
- Audience: backend and SRE engineers who already live in a terminal and currently reach for grep, jq, or a log vendor's query bar.
- Job of the main surface: get them to run the install command (copy `brew install grepline`).
- Surface type: marketing

## Direction

"Query as headline": the page is a terminal pane showing grepline's own output. It borrows ripgrep's output conventions (magenta file paths as group headings, matches marked) and the ANSI level colors log libraries print. The signature is the hero's editable filter, set at display size, that runs live against twelve records from three files; matching records get a magenta rule and underlined deciding fields. The record row / field cell (`key` above or before `value`) is the unit: the hero table, the parsed-record cells in Formats, the syntax table, and the facts row under Install are all built from it.

## Tokens

```tokens
color.bg: #16181B
color.surface: #1F2226
color.text: #E6E4DF
color.muted: #A0A5AC
color.accent: #D670D6
color.on-accent: #16181B
color.border: #6E757E
color.rule: #33383E
color.danger: #FF7B72
color.warn: #E3B341
font.display: "Martian Mono", monospace
font.body: "IBM Plex Sans", sans-serif
font.utility: "IBM Plex Mono", monospace
type.base: 16px
type.ratio: 1.25
space.base: 8px
radius.default: 6px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/bg, accent/surface, danger/surface, warn/surface, border/surface
```

## Patterns

- Buttons: one filled magenta button per screen (Copy brew command); others outlined in `--edge`. Mono label, 40px high, `:active` scale 0.97.
- Inputs and forms: the filter is a textarea with a token-colored layer painted over it; `--edge` 1px border on `--ground`; red border and inline message when the expression does not parse.
- Cards / panels: flat panes (`--pane` fill, `--rule` border), no shadows: terminal panes are flat.
- Tables: mono 15px, tabular figures, grouped by file with a magenta path heading when the group has matches. Below 880px each row becomes a wrapped block with `key=` prefixes.
- Navigation: wordmark + 4 text links; Formats/Syntax hide below 480px.
- Motion: color and border transitions only (150ms); smooth scroll to the console only without reduced motion.

## Page overrides

## Looks used

- index.html — dark, neutral graphite ground, magenta accent (300°), mono-led (Martian Mono display + Plex Sans body), flat panes with hairline rules.

## Learnings

- 2026-11-01: a transparent textarea under a highlight layer reads as zero-contrast text to the render check and to anyone without the overlay. Draw the real text in the textarea (muted) and paint the token colors on top instead.
- 2026-11-01: rejected a fake terminal window (traffic-light dots) and a feature-card grid; rejected acid green (R04b) and ripgrep's red match color (collides with ERROR).
