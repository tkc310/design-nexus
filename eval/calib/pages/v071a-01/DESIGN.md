# DESIGN.md

The single source of truth for this project's design. Agents read it before any UI work and update it after. Keep it short; link to code for detail.

## Subject

- Subject: grepline, an open-source Rust CLI that searches structured logs (JSON, logfmt) across many files with a SQL-like filter (`level=error and latency_ms>500`).
- Audience: backend and SRE engineers who already live in a terminal and already grep, jq, and tail logs at bad hours.
- Job of the main surface: get them to run the install command.
- Surface type: marketing

## Direction

"Result lines": the page is grepline's own output. The unit is the result line: a `file:line` gutter, a level cell, then `key=value` pairs, with matched keys marked in match magenta (ANSI 35, the color grep-family tools give to what they found). The signature is a live filter over a real-looking stream from three log files: the brief's filter is applied on load, matching lines are marked, the rest are dimmed, and the visitor can edit the query. The same result-line unit builds the syntax reference (each operator row is a result line with a "Run" action that loads it into the filter), the format comparison (one event as JSON and as logfmt, parsed to the same line), and the closing facts record. Dark because the source is a terminal pane, not as decoration.

## Tokens

Machine-readable. `scripts/tokens-check.mjs` and `scripts/lint.mjs --design` parse this block.

```tokens
color.bg: #14161B
color.surface: #1D2027
color.text: #E9E6DF
color.muted: #9BA1AC
color.accent: #F27BD9
color.on-accent: #14161B
color.border: #3A3F4B
color.danger: #FF7B6B
color.warn: #E7B64C
color.info: #82B6DA
font.display: "Martian Mono", monospace
font.body: "IBM Plex Sans", sans-serif
font.utility: "JetBrains Mono", monospace
type.base: 16px
type.ratio: 1.25
space.base: 4px
radius.default: 4px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/bg, accent/surface, danger/surface, warn/surface, info/surface
```

## Patterns

- Buttons: filled magenta is reserved for Copy on the install commands. Secondary actions are text buttons with a 1px border. Press: scale(0.97). Focus: 2px magenta outline, 2px offset.
- Inputs and forms: the filter input has a muted (3:1+) border, never the hairline border token; it is a prompt line (`$ grepline '…'`), label visible above it, errors below in danger with the column of the problem.
- Cards / panels: terminal panes only: surface fill, 1px border, 4px radius, a title bar carrying the command. No shadows.
- Tables: result lines; `file:line` gutter in muted, level cell coloured by status, values in text, matched keys in accent.
- Navigation: wordmark, three anchors, GitHub link.
- Motion: none beyond button press and a 150ms colour change on result lines when the filter changes; removed under reduced motion.

## Page overrides

None.

## Looks used

- 01-lp-devtool (grepline landing): dark, neutral charcoal ground with magenta accent (≈315°) plus log-level status colours, mono-led display (Martian Mono) with humanist-grotesk body, flat terminal panes with 1px borders.

## Learnings

- 2026-10-31: Rejected acid-green phosphor accent (R04b) and the grep-red match colour (collides with the error level). Magenta is the one ANSI colour no log level owns.
- 2026-10-31: Rejected a stat strip and logo row: there are no real numbers or customers, so the facts are one logfmt record instead.
- 2026-10-31: JetBrains Mono ligatures turned `!=` and `>=` into ≠ and ⩾, which is wrong for text people type. Ligatures are off on every code surface.
- 2026-10-31: Result lines below 900px reflow to two rows (location and level, then time and pairs wrapping between pairs) instead of a horizontal scroll that hid the matched field.
