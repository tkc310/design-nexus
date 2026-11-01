# DESIGN.md

## Subject

- Subject: grepline, an open-source Rust CLI that filters structured logs (JSON, logfmt) across many files with a SQL-like expression.
- Audience: backend and SRE engineers who already live in `grep`, `jq`, and `less`, usually mid-incident, sceptical of marketing.
- Job of the main surface: get them to run the install command (copy `cargo install grepline` or `brew install grepline`).
- Surface type: marketing

## Direction

"Scrollback": the page is one terminal pane of log output. Ground and text come from a terminal's scrollback, colors come from the ANSI palette grep itself uses (`GREP_COLORS`: magenta for the file name, which is the point of a many-file search), and level colors are the usual error/warn/info status. The signature is a live filter prompt — `$ grepline '<filter>' logs/*` — over a real-looking log table in the hero: edit the filter and the table re-filters, matched fields lit in grep magenta, skipped lines collapsed into grep's own `--` separators. Its unit is the log row (file · time · level · key=value fields); the format comparison, the facts record, and the footer are built from the same row.

## Tokens

```tokens
color.bg: #1A1E26
color.surface: #232833
color.text: #E6E8ED
color.muted: #A0A9B8
color.accent: #F27BCB
color.on-accent: #1A1E26
color.border: #3A4250
color.danger: #FF8A80
color.warn: #E9BC5A
color.info: #82BCFF
font.display: "Martian Mono", ui-monospace, monospace
font.body: "IBM Plex Sans", sans-serif
font.utility: "Martian Mono", ui-monospace, monospace
type.base: 16px
type.ratio: 1.25
space.base: 8px
radius.default: 6px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/bg, accent/surface, danger/surface, warn/surface, info/surface
```

Display and utility share one family on purpose: Martian Mono at a wide width (`wdth` 112.5) for headings, condensed (`wdth` 87.5) for log rows and commands. Body is IBM Plex Sans.

## Patterns

- Buttons: Copy buttons sit at the end of a command row; 6px radius, 1px muted border, accent fill only on the primary install row. Press = `scale(0.97)`. Label changes to "Copied" and an `aria-live` note confirms.
- Inputs and forms: the filter input lives inside the prompt line; label is visually hidden ("Filter expression"); parse errors appear under the prompt in danger color with what is wrong and an example, tied by `aria-describedby`.
- Cards / panels: panes are `surface` with a 1px `border`, 6px radius, no shadow (elevation is lighter surface, as in a terminal split).
- Tables: log rows are a real `<table>`, `white-space: nowrap`, inside a horizontally scrolling pane with a visible edge. Skipped lines collapse into a `-- n lines skipped --` row.
- Navigation: wordmark, two in-page anchors (hidden below 720px), GitHub, one "Install" action.
- Motion: none on filtering (it happens on every keystroke); only button press feedback and focus rings. Reduced motion removes the press scale.

## Page overrides

None.

## Looks used

- index.html — dark (slate terminal ground #1A1E26, hue ~220) · accent magenta (hue ~320, grep file-name color) · mono-led display (Martian Mono wide) + humanist-ish grotesk body (IBM Plex Sans) · flat panes with 1px borders, no shadow.

## Learnings

- 2026-10-31: Rejected grep's match red as the accent: red already means `level=error` in the table, so the match highlight and the status would collide.
- 2026-10-31: Rejected dimming non-matching rows in the demo (contrast risk, and it is not what grep does); used grep's `--` group separators instead.
- 2026-10-31: Rejected a "features" card grid; the facts are shown as one logfmt record because that is the material the audience reads all day.
- 2026-10-31: At 320px the log table hid the matched fields off-screen; below 600px each row becomes two lines (file · time · level, then fields wrapping between pairs, never inside one). The decorative `$ ` prompt on command rows is dropped below 380px so `cargo install grepline` fits whole.
