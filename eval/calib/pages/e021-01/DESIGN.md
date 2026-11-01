# DESIGN.md

## Subject

- Subject: grepline, an open-source Rust CLI that searches structured logs (JSON, logfmt) across many files with a SQL-like filter.
- Audience: backend and SRE engineers who live in grep, jq, and less, often mid-incident; they distrust hype and new DSLs.
- Job of the main surface: get them to run the install command.
- Surface type: marketing

## Direction

"Light terminal, rg colors." The page is a light-profile terminal (xterm white, near-black foreground) and borrows the colors grep-family tools already print: the magenta of a file path in ripgrep output is the accent, a pale magenta wash marks a matched field, and red appears only on `level=error`. The signature is the live filter pane: a multi-file log stream grouped by file, where the filter you type lights the matching records and their matched fields while the rest stay dimmed. Its unit, the log record row (line-number gutter + key=value fields), is reused by the filter syntax table, the two-format comparison, and the facts line written as a logfmt record.

## Tokens

```tokens
color.bg: #FFFFFF
color.surface: #F3F4F6
color.text: #15171C
color.muted: #565D6C
color.accent: #A1137E
color.on-accent: #FFFFFF
color.border: #7B8190
color.hairline: #D5D8DE
color.match: #FBE3F3
color.danger: #B8241B
font.display: "Martian Mono", ui-monospace, monospace
font.body: "IBM Plex Sans", system-ui, sans-serif
font.utility: "JetBrains Mono", ui-monospace, monospace
type.base: 16px
type.ratio: 1.25
space.base: 8px
radius.default: 8px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/bg, accent/surface, danger/bg, text/match, border/bg
```

## Patterns

- Buttons: primary action is the install command itself (mono, on surface, with a Copy button in accent). Copy buttons: accent fill, white text, 8px radius, `scale(0.97)` on press.
- Inputs and forms: the filter field is a mono input with a 1.5px border in `color.border`; focus is a 2px accent outline offset 2px. Invalid filters show an inline error under the field tied with `aria-describedby`.
- Cards / panels: panes have a 1px hairline border and 8px radius; only the live filter pane (a window) gets a shadow.
- Tables: the syntax table uses mono filter cells, hairline row rules, and a "Try" button per row that loads the filter into the live pane.
- Navigation: wordmark, two in-page links, GitHub link, and an "Install" link to the hero command. Not sticky.
- Motion: only press feedback (120ms) and dim/undim of rows (160ms opacity). Movement removed under reduced motion.

## Page overrides

## Looks used

- light (true white ground), magenta accent ~315deg, mono-led display + humanist-grotesk body, flat hairline panes with one shadowed window.

## Learnings

- 2026-10-31: rejected a dark terminal hero with a green or vermilion accent (R04b) and a cream man-page look (R04a/d). Rejected amber accent (reads as WARN) and cyan (reads as INFO).
- 2026-10-31: JetBrains Mono's coding ligatures drew `>=` and `!=` as single glyphs, which is wrong in a syntax reference people copy from. Ligatures are off for every typed surface, set after all `font:` shorthands (which reset them).
- 2026-10-31: visually hidden labels (`.sr-only`, absolutely positioned) inside horizontal scrollers escaped the clip and caused page scroll at 320px; scrollers that hold them get `position: relative`.
- 2026-10-31: filter cells in the syntax table wrap between tokens (`.tok` spans), never inside one.
