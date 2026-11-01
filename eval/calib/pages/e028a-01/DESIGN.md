# DESIGN.md

## Subject

- Subject: grepline, an open-source Rust CLI that searches structured logs (JSON lines, logfmt) across many files with a SQL-like filter.
- Audience: backend and SRE engineers who already live in a terminal and already know grep, jq and SQL.
- Job of the main surface: get them to run the install command.
- Surface type: marketing

## Direction

"Filtered stream". The page is a terminal pane running grepline. Its signature is a live filter over a merged stream of twelve log lines from three files: the lines that match are lit, with a key-blue bar, and the lines that don't are dimmed the way a terminal dims with SGR 2. The unit is the **log row**: a 192px meta gutter (time and file) followed by the line itself. The facts strip (a logfmt line with the same key-blue bar), the syntax table (form column in the gutter) and the install rows (tool in the gutter) are all built from that row.

## Tokens

```tokens
color.bg: #171A20
color.surface: #21252D
color.text: #DDE3EA
color.muted: #99A3B0
color.accent: #74B9FF
color.on-accent: #0D1B2A
color.danger: #FF8A80
color.warn: #F0C060
font.display: "Martian Mono", monospace
font.body: "Atkinson Hyperlegible", sans-serif
font.utility: "JetBrains Mono", monospace
type.base: 17px
type.ratio: 1.25
space.base: 8px
radius.default: 6px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/bg, accent/surface, danger/surface, warn/surface
```

Sources: bg = a dark terminal profile; surface = a tmux pane; text = default foreground; muted = SGR 2 dim, used for lines the filter rejects; accent = jq's object-key blue, used for field names and the one install button; danger and warn = the colours of `level=error` and `level=warn`, used only for those values.

## Patterns

- Buttons: one filled key-blue button per screen ("Copy install command"). All other copy buttons are outlined in muted. Press scales to 0.97.
- Inputs and forms: the filter is a one-line textarea that grows to wrap the expression; ground fill, muted border (≥3:1), key-blue border on focus, danger border when the expression can't be parsed.
- Cards / panels: panes are surface on bg, 6px radius, no shadows. Elevation is surface lightness only.
- Tables: the syntax table uses the log-row gutter for its first column; below 640px each row becomes a labelled block.
- Navigation: wordmark plus four text links; no filled nav action.
- Motion: only the button press and border/colour transitions; no movement under reduced motion.
- Code: ligatures off everywhere code is shown, so `>=` and `!=` look like what you type.

## Page overrides

None.

## Looks used

- index.html: dark, blue-graphite ground (terminal) with a sky-blue accent (jq key colour), mono-led display (Martian Mono) with a humanist body face (Atkinson Hyperlegible), flat panes with no shadows.

## Learnings

- 2026-11-01: The grep match red was rejected as the accent: in log-land red means `level=error`, and it would read as vermilion on dark (R04b).
- 2026-11-01: JetBrains Mono ligatures turned `>=` into `≥` in the syntax table. A syntax reference people copy from needs ligatures off. Note that the `font` shorthand resets `font-variant-ligatures`, so the override has to come after it.
- 2026-11-01: A filter expression doesn't fit a single-line input at 320px. A textarea that grows keeps the whole expression visible.
