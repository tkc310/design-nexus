# DESIGN.md

The single source of truth for this project's design. Agents read it before any UI work and update it after.

## Subject

- Subject: grepline, an open-source Rust CLI that searches structured logs (JSON, logfmt) across many files with a SQL-like filter.
- Audience: backend and SRE engineers who already live in a terminal and judge a tool by its output.
- Job of the main surface: get them to run the install command.
- Surface type: marketing

## Direction

"Match highlight": the page is one log file being filtered. It borrows the terminal log viewer (a dark pane, mono log lines, a `less`/vim search hit painted in highlight yellow) and leads with the filter itself running over twelve real-looking lines. Signature: the live filter wall, where `level=error and latency_ms>500` lights the matching rows and the matching fields inside them while the rest dim. Its unit, the log row (gutter bar + timestamp + level + key=value fields), is reused by the syntax reference, the JSON/logfmt comparison, the facts line, and the footer.

## Tokens

```tokens
color.bg: #1b2027
color.surface: #29303a
color.text: #dde3ea
color.muted: #8d97a5
color.accent: #f5c542
color.on-accent: #1b2027
color.border: #29303a
color.danger: #ff8077
font.display: "Martian Mono", monospace
font.body: "Instrument Sans", sans-serif
font.utility: "JetBrains Mono", monospace
type.base: 17px
type.ratio: 1.25
space.base: 4px
radius.default: 4px
pairs: text/bg, muted/bg, text/surface, on-accent/accent, accent/bg, danger/bg, muted/surface
```

## Patterns

- Buttons: one filled hit-yellow button per view (copy the primary install command); secondary copy buttons are 1px muted outline on the pane. Press: scale(0.97).
- Inputs and forms: the filter prompt, `$` glyph + a one-line auto-growing mono textarea (Enter runs) on the raised surface with a 1px muted border (>=3:1); errors print below in danger as a shell would, tied by aria-describedby.
- Cards / panels: none. Panels are terminal panes: surface fill, 4px radius, no shadow.
- Tables: the log-row grid. Below 640px, rows become labelled blocks.
- Navigation: wordmark + 3 links, no filled action in the bar.
- Motion: only the filter's dim/undim (opacity, 160ms ease-out) and button press. Reduced motion drops the transitions.

## Page overrides

None.

## Looks used

- 2026-11-01 landing: dark, ground cool graphite (~215deg, low chroma), accent highlight yellow (~45deg), mono-led display + humanist sans body, flat panes with hairline rows.

## Learnings

- 2026-11-01: rejected a man-page light layout (drifts into the agent house look) and a saturated pager-orange incident narrative (loud, but buries the install command under story).
- 2026-11-01: JetBrains Mono's contextual alternates turn `!=` and `>=` into ≠ and ≥, which misstates the filter syntax. Ligatures are off on every code surface, set after all `font` shorthands (the shorthand resets `font-variant-ligatures`).
