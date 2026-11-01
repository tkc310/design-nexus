# DESIGN.md

## Subject

- Subject: grepline, an open-source Rust CLI that searches structured logs (JSON, logfmt) across many files with a SQL-like filter.
- Audience: backend and SRE engineers who live in a terminal, often reading logs during an incident.
- Job of the main surface: get them to run the install command (copy `brew install grepline` or `cargo install grepline`).
- Surface type: marketing

## Direction

"Search hit": the page is a terminal pane where the filter is edited in place inside a real shell command and the log stream below answers live. Matched fields light up in the yellow of a pager search hit (vim `hlsearch`, `less` / tmux search), the same yellow that fills the one install button, because the install command is the hit you came for. Signature: the live filter pane. Its unit is the **record row** (a `file:line` gutter plus key/value tokens that wrap between tokens, never inside one); the syntax table, the "why it printed" trace, the facts record and the install commands are all built from that row.

## Tokens

```tokens
color.bg: #15171A
color.surface: #1D2024
color.text: #E6E3DB
color.muted: #A3A9B0
color.accent: #F2CC4B
color.on-accent: #15171A
color.border: #3A4048
color.danger: #FF7B72
color.accent-hover: #F7DA74
font.display: "Martian Mono", monospace
font.body: "IBM Plex Sans", sans-serif
font.utility: "JetBrains Mono", monospace
type.base: 16px
type.ratio: 1.25
space.base: 8px
radius.default: 6px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/bg, danger/surface
```

Sources: `bg` terminal ground; `surface` a pane inside the terminal; `border` tmux pane divider; `text` terminal default foreground; `muted` SGR dim; `accent` search-hit yellow (vim hlsearch / less); `danger` ANSI bright red, used only for `level=error` values.

## Patterns

- Buttons: one filled accent button (hero Copy for the first install command). All other actions are outlined in `border`, text in `text`. Press: scale(0.97). Focus: 2px accent outline, 2px offset.
- Inputs and forms: the filter is a one-line auto-growing textarea (Enter does not add a newline) inline in a `$ grepline '…' logs/*` prompt, on `bg` with a 1px `muted` border (3:1+ on `surface`), so the whole filter stays visible at 320px. Parse errors show under the prompt in `danger` with the column and an example; an unknown field lists the fields that exist.
- Cards / panels: flat panes, 1px `border`, 6px radius, no shadows (terminal panes do not float).
- Tables: syntax reference rows are record rows; below 640px each row becomes a labelled block.
- Navigation: wordmark, three anchor links, crates.io link (dropped from the header below 480px; it stays in the footer). No filled control in the header.
- Motion: press feedback only; nothing moves under `prefers-reduced-motion`.
- Type: ligatures off everywhere, so `>=` and `!=` read exactly as typed.

## Page overrides

None.

## Looks used

- 2026-11-01 grepline landing: dark, neutral graphite ground, yellow (hue ~47) accent, mono-led display (Martian Mono) + humanist-ish grotesk body (IBM Plex Sans), flat bordered panes.

## Learnings

- 2026-11-01: rejected GNU grep match red as the accent (collides with `level=error` status, which the demo must show) and ANSI cyan (reads as "info", not "match"). Rejected greenbar line-printer paper and on-call hi-vis yellow ground as directions; see NOTES.md.
- 2026-11-01: log lines wrap between key/value tokens (each token `nowrap`) instead of scrolling sideways, so nothing the reader needs sits past an edge at 320px.
