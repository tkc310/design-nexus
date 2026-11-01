# DESIGN.md

The single source of truth for this project's design. Agents read it before any UI work and update it after.

## Subject

- Subject: grepline, an open-source Rust CLI that searches structured logs (JSON, logfmt) across many files with a SQL-like filter such as `level=error and latency_ms>500`.
- Audience: backend and SRE engineers who already live in grep, jq, and less, often reading logs mid-incident. They want the answer, not a new query language or another service to run.
- Job of the main surface: get them to run the install command (`brew install grepline` or `cargo install grepline`).
- Surface type: marketing

## Direction

"Green-bar printout." Logs were once read on continuous-form line-printer paper: alternating green and white bands, tractor-feed holes down a perforated margin. The page borrows that sheet as its one material. The signature is **the sift**: a banded printout of 12 interleaved lines from four JSON and logfmt files, with the filter applied in place, so matching lines stay in full ink with a form-green rule and underlined fields while the rest drop to muted ink. The filter is editable. The unit is the **printout row** (banded line, `file:line` gutter, tokens that wrap only between fields), and the syntax reference, the formats comparison, and the install commands are all built from that row on the same tractor-fed sheet.

## Tokens

```tokens
color.bg: #FBFBF9
color.surface: #E3F0DF
color.text: #1C211E
color.muted: #5B635E
color.accent: #1E6A44
color.on-accent: #FBFBF9
color.border: #5B635E
color.danger: #B3261E
font.display: "Martian Mono", monospace
font.body: "IBM Plex Sans", sans-serif
font.utility: "IBM Plex Mono", monospace
type.base: 16px
type.ratio: 1.25
space.base: 8px
radius.default: 6px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/bg, accent/surface, danger/surface, danger/bg
```

Color sources:

- `bg` paper #FBFBF9: the white bands of continuous-form stock (near-neutral, no tint).
- `surface` bar #E3F0DF: the green bands of green-bar paper. Used only on printout rows.
- `text` ribbon #1C211E: line-printer ribbon black.
- `muted` #5B635E: faded ribbon; non-matching lines, secondary copy at 15px and up, field borders.
- `accent` form green #1E6A44: the ink the form itself is printed in (column numbers, margin marks). Means "matched" and "do this": match rules, the install buttons, focus.
- `danger` ribbon red #B3261E: the red half of a two-colour ribbon. Only the value `error` in a log line.

Accent candidates were: grep's own match red (`GREP_COLORS ms=01;31`), form green, carbon-copy blue. Red already means `level=error` in every log viewer, so it stays a status colour; carbon blue lands on the ink-blue house look and means nothing here; form green is the paper's own ink and is free to mean "matched".

Display candidates: Martian Mono (mono-led, condensed width axis, reads like a printer banner), Big Shoulders Display (condensed signage), Zilla Slab (slab). Chosen Martian Mono because the subject's own lettering is fixed-width printer and terminal type.

Type scale (from 16, ratio about 1.25): 15 (log rows, code), 17 (body), 21 (lead, h3), 27 (h2), clamp(34px, 5.6vw, 60px) (h1). Loaded from Google Fonts with `display=swap`.

## Patterns

- Buttons: primary is form green with paper text, 6px radius, 40px min height; hover turns ink; press scales to 0.97. Secondary is a 1px muted outline.
- Inputs and forms: the filter field is mono 16px on paper with a 1px muted border (6:1), 2px form-green border on focus, ribbon-red border and message on a parse error tied by `aria-describedby`.
- Cards / panels: none. Everything that holds content is a printout sheet: tractor strip (paper, ringed holes) plus a dashed perforation, then banded rows.
- Tables: printout rows. Below 640px each row stacks (code first, meaning under it).
- Navigation: single-colour Martian Mono wordmark, three links (Filter syntax and Formats drop below 720px; both sections stay on the page), one Install button. Not sticky.
- Motion: row colour fades 160ms on filter change; copy feedback swaps the label. Nothing moves under reduced motion.

## Page overrides

None.

## Looks used

- index.html: light, neutral paper ground with pale green bands (~110°) and deep form-green accent (~150°), mono-led display (Martian Mono) with humanist-grotesk body (IBM Plex Sans), textured material (green-bar bands, tractor holes, perforations), no shadows.

## Learnings

- 2026-11-01: Rejected "Pager at 03:12" (mid-tone slate, alert-led split) because a dark terminal page with one accent sits next to R04b, and "Query plan" (railroad diagram of the grammar) because it explains syntax before showing results. The printout shows the result first.
- 2026-11-01: Rejected a red match colour: in logs red is `error`, so a red match mark would read as severity when the filter is `level=warn`.
- 2026-11-01: Removed the two-tone wordmark ("line" in form green) as the page's least necessary accessory; green stays reserved for matches and actions.
- 2026-11-01: The filter is a one-row textarea with `field-sizing: content` so a long filter wraps at 320px instead of scrolling out of sight inside an input.
- 2026-11-01: Rejected a dark closing band for the install section; the page ends on the same paper as the sheet, to stay off the agent house look.
