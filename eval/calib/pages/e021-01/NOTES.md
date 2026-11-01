# NOTES: grepline landing page

Budget: standard · Mode: build (+ DESIGN.md) · Surface: marketing

## Grounding
- Subject: grepline, an open-source Rust CLI that searches JSON and logfmt logs across many files with a SQL-like filter.
- Audience: backend and SRE engineers who know grep, jq, and less, often reading logs mid-incident.
- Job: run the install command (`cargo install grepline` / `brew install grepline`).

## Three directions considered
- A — "Light terminal, rg colors": a light-profile terminal (xterm white, near-black foreground) using the colors grep-family tools already print: ripgrep's file-path magenta as the accent, a match wash on matched fields, red only on `level=error`. Leads with a live multi-file log stream that the filter lights up. Mono-led display, flat panes with one shadowed window.
- B — "Midnight pager": a saturated deep-blue ground taken from Midnight Commander and `less` color schemes, a condensed display face in WARN amber, loud and dense. Leads with a diagram of many files funnelling into one result.
- C — "Postmortem": a light paper ground from incident-review documents, a serif display, a split layout. Leads with an incident timeline where the filter finds the cause.

**Chosen: A.** The audience's trust comes from seeing their own output, and the colors that output already uses (magenta path, red error, highlighted match) are a vocabulary these readers know on sight. B risked reading as retro novelty. C slid toward the cream-and-serif document look (R04a/d).

Accent candidates: rg path magenta (chosen: it marks *where* a match lives, which is grepline's point: many files), WARN amber (rejected: it reads as a warning and is the warmest default), INFO cyan (rejected: it reads as passive info). Display candidates: Martian Mono (mono, chosen: terminal lettering, and the narrowed width axis keeps headlines compact), Barlow Condensed (condensed grotesk, dashboard panels), Zilla Slab (slab, man-page print). Body is IBM Plex Sans; log lines use JetBrains Mono.

## Signature
The **live filter pane**: four log files (two JSON, two logfmt) grouped rg-style under magenta paths. The filter `level=error and latency_ms>500` is applied on load: 3 of 13 lines are lit, with the matched fields washed and bold, and the rest dimmed but still readable. The filter is editable, has preset chips, and has a "show only matching lines" toggle. Its unit, the log record row (line-number gutter + key=value fields), is reused by the syntax table (each row is a filter with its live count in the pane and a Try button that loads it), the JSON/logfmt two-up, the facts written as a logfmt record, and the closing terminal transcript.

## States (in the product, reachable through the real flow)
- Invalid filter: type `latency_ms>` or `level=error and`. An inline error under the field (`aria-describedby`, red border, `aria-invalid`) says what is wrong and how to fix it; the last good result stays on screen.
- No matches: type `latency_ms>99999`. An empty-state line in the stream suggests loosening a condition; all scanned lines stay visible, dimmed.
- Copy: the Copy buttons report "Copied" in a status line. If the clipboard is blocked, they select the command and say to press Ctrl+C / Cmd+C.

## Tool results
- lint: floor 0 · reflex 0 · finish 0 · kept 0 (with `--design DESIGN.md`)
- render: floor 0 · reflex 0 · finish 0 · kept 0 (320/768/1280/1920)
- tokens-check: floor 0 · reflex 0 · finish 0
- Fixed along the way: F08 at 320px (absolutely positioned `.sr-only` labels inside horizontal scrollers escaped the clip; a nowrap inline code in the lead). Critique fixes: ligatures turning `>=`/`!=` into ≥/≠, the facts record ignoring the page gutter (padding collision), and a clipped Try column and squeezed "Reads as" column in the syntax table. Removed accessory: link hover underline-thickening.

## Reflex findings kept
None.

## Assumptions and invented content (not on the brief)
- Filter syntax beyond `level=error and latency_ms>500`: `!=`, `>=`, `<`, `<=`, `or`, parentheses, and numeric comparison of numeric fields are assumed from "SQL-like". The in-page parser implements exactly that.
- CLI invocation shape `grepline '<filter>' <files...>` is assumed.
- The claim that one run reads JSON and logfmt files together is inferred from the brief ("JSON, logfmt, across many files").
- GitHub URL `https://github.com/grepline/grepline` is assumed.
- All log lines, file names, services, routes, timestamps, and line numbers are invented examples.
- The jq comparison command is real jq syntax; it describes jq, not a benchmark.
- No metrics, logos, or testimonials are shown (none exist).
