# DESIGN.md

## Subject

- Subject: grepline, an open-source Rust CLI that searches structured logs (JSON, logfmt) across many files with a SQL-like filter (`level=error and latency_ms>500`).
- Audience: backend and SRE engineers who already live in grep, jq, and less, and who meet it mid-incident with too many log files open.
- Job of the main surface: get them to run the install command (`brew install grepline` or `cargo install grepline`).
- Surface type: marketing

## Direction

"grep --color". The page is a light terminal in the default Terminal "Basic" profile (white ground, near-black text), and its only colors are lifted from GNU grep's default `GREP_COLORS`: magenta filenames (`fn=35`), green line numbers (`ln=32`), bold red matches (`ms=01;31`). Martian Mono carries display and log output, changing width (wdth axis) between headline and log lines; Atkinson Hyperlegible Next carries prose. Signature: a live filter in the hero, an editable query that refilters sample log lines from four files and colors the matching fields red, as grep would.

## Tokens

```tokens
color.bg: #FFFFFF
color.surface: #FFFFFF
color.text: #1C1C1C
color.muted: #5C5C5C
color.accent: #A2197E
color.on-accent: #FFFFFF
color.border: #E6E6E6
color.danger: #C0161D
color.line: #1D7A36
font.display: "Martian Mono", ui-monospace, monospace
font.body: "Atkinson Hyperlegible Next", system-ui, sans-serif
font.utility: "Martian Mono", ui-monospace, monospace
type.base: 17px
type.ratio: 1.25
space.base: 8px
radius.default: 4px
pairs: text/bg, muted/bg, text/surface, on-accent/accent, accent/bg, danger/bg, line/bg
```

Token sources: `bg`/`text` = Terminal "Basic" profile; `muted` = ANSI 90 (bright black, dimmed output); `border` = macOS window chrome; `accent` = grep `fn=35`; `danger` = grep `ms=01;31`, used only for matched fields and parse errors; `line` = grep `ln=32`, used only for line numbers.

## Patterns

- Buttons: one filled magenta button style (copy commands, primary). 4px radius, `:active` scale 0.97, 2px magenta focus ring offset 2px.
- Inputs and forms: the query input is mono, 2px muted border, label above; parse errors in red below, tied with `aria-describedby`.
- Cards / panels: none. The terminal window is the only elevated surface (real window shadow); everything else is flat on the ground.
- Tables: the facts sheet is a `dl` styled like `--help` output: mono keys, prose values.
- Navigation: wordmark, two in-page links, GitHub, one Install link.
- Motion: only the result lines fade in (120ms opacity) after a filter changes; none under reduced motion.

## Page overrides

None.

## Looks used

- 2026-10-31 landing: light, true-neutral white ground, magenta accent with grep red/green as data colors, mono-led (Martian Mono) + humanist sans body, flat with one shadowed terminal window.

## Learnings

- 2026-10-31: rejected a dark terminal hero (reads as R04b near-black + acid accent) and a man-page single column (drifts toward the house look). Rejected a three-card feature grid; the filter anatomy figure explains the syntax instead.
