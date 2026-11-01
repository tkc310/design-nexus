# DESIGN.md

## Subject

- Subject: grepline, an open-source Rust CLI that searches structured logs (JSON, logfmt) across many files with a SQL-like filter (`level=error and latency_ms>500`).
- Audience: backend and SRE engineers who already live in `grep`, `jq`, and log files, and distrust marketing.
- Job of the main surface: get them to run the install command (copy `brew install grepline` or `cargo install grepline`).
- Surface type: marketing

## Direction

"Edge-notched": the page borrows from the McBee Keysort edge-notched record card, the paper system that filtered a stack of structured records by boolean conditions before computers did. The usual CLI landing page (near-black ground, all-mono type, a terminal window with traffic-light dots, a green or purple accent, a grid of feature cards) is replaced by: the buff card stock as the page ground; the condensed grotesque of the card's printed field rubric as the display face; the hole row along the card's edge as the match mark (an intact hole = the condition is false for that line, a hole opened to the edge = true; a line whose expression holds is pulled out of the stack); the steel file tray as the one dark panel; the clipped orientation corner on panels that hold commands. The object's words (card, notch, punch, needle, sort, drawer, hole, Keysort) never appear in copy. Signature: the live filter tray in the hero, a stack of real-looking log lines from four files, each with one hole per condition of the filter, opened where the condition is true; editing the filter re-evaluates every line.

## Tokens

```tokens
color.bg: #E6D9B8
color.surface: #F4ECD8
color.text: #1F1C16
color.muted: #51493B
color.accent: #A3241B
color.on-accent: #F4ECD8
color.border: #51493B
color.tray: #323D37
font.display: "Barlow Condensed", sans-serif
font.body: "Barlow", sans-serif
font.utility: "IBM Plex Mono", monospace
type.base: 17px
type.ratio: 1.333
space.base: 8px
radius.default: 3px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/bg, accent/surface, surface/tray, bg/tray
```

## Patterns

- Buttons: one filled rubric button per view (copy the install command); secondary copy buttons are outlined in ink. Press: scale(0.97). Copied state shows "Copied" in text for 2s.
- Inputs and forms: the filter field is a mono input on leaf with a 2px ink border (well above 3:1), error message tied by aria-describedby.
- Cards / panels: no cards. Command panels have a clipped top-right corner (the card's orientation corner) and a 1px ink border; no shadows.
- Tables: syntax table ruled in ink hairlines; first column carries the match hole (opened = keeps the sample line).
- Navigation: wordmark + 3 links, no filled nav action.
- Motion: matched lines slide 12px out of the stack (180ms ease-out); removed under reduced motion.
- Dividers: a row of intact holes between sections (the card edge), drawn with CSS, aria-hidden.

## Page overrides

## Looks used

- 2026-11-01 grepline LP — light warm (buff manila ground, rubric red accent, dark steel-green tray), condensed grotesque display + grotesk body + mono utility, flat with clipped corners and hole-row dividers.

## Learnings

- 2026-11-01: rejected a near-black terminal hero (the category default) and a split-flap departure board (loud, but still dark + mono, close to R04b). Rejected a serif display on the buff ground: it would land on R04a (cream + serif + red).
