# NOTES: grepline landing page

Budget: standard. Surface: marketing. Mode: build (plus a DESIGN.md, since none existed).

## Ground

- Subject: grepline, an open-source Rust CLI that searches JSON and logfmt logs across many files with a SQL-like filter.
- Audience: backend and SRE engineers who already use grep, jq and less, often mid-incident.
- Job: run the install command (`brew install grepline` / `cargo install grepline`).

## Three directions considered

- A — "Green-bar printout": borrows continuous-form line-printer paper (green/white bands, tractor-feed holes, perforations), the physical form logs were once read on; a live, banded printout of interleaved log lines leads the page. Light, mono-led display, textured material, full-width sequence.
- B — "Pager at 03:12": borrows the incident moment (an alert summary, then the query that answers it) on a mid-tone slate terminal ground; split layout, grotesk + mono, cards with real elevation. Dark-ish and dense.
- C — "Query plan": borrows SQL EXPLAIN output and railroad syntax diagrams; the filter grammar drawn as a diagram leads. Light cool, condensed display, diagram-led, flat hairlines.

**Chosen: A.** It shows the result (the lines you'd get back) before the syntax, uses the log's own physical form rather than generic terminal chrome, and stays clear of R04b (near-black + one acid accent), which B sits next to. C explains grammar before value.

## Signature

**The sift**: a green-bar printout of 12 interleaved lines from four files (`api-1.log`, `api-2.log` as JSON; `worker.log`, `edge.log` as logfmt), with `level=error and latency_ms>500` already applied on load. Matching lines keep full ribbon ink, a form-green rule and a green `file:line`, and the fields that satisfied the filter are underlined; the rest fade to muted ink. The command line is the filter field (`$ grepline '[filter]' logs/*.log`), so typing re-sifts the sheet live. Unit: the printout row (band, `file:line` gutter, tokens that wrap only between fields). Reused by: the hero install commands, the filter-syntax table (whose "Try" buttons load each filter into the sift), the JSON/logfmt two-up, and the install sheet.

## States (all inside the sift, on the real parse/evaluate path)

- Default: 4 of 12 lines match, from 3 files.
- No match: type `job=foo` → "No lines match job=foo." plus the field names present in the lines.
- Parse error: type `latency_ms>>500`, `level=`, `level=error and`, or `(level=warn` → field gets a ribbon-red border, message under it (tied by `aria-describedby`) says what is wrong and gives a working example; lines stay as they were.
- Empty filter: clear the field → "No filter yet. Type one above, or pick one under Try."
- Copy: buttons switch to "Copied" for 1.8s; if the clipboard is blocked, "Select and copy" and a polite announcement with the command.

## Tool results

- `lint.mjs index.html`: floor 0 · reflex 0 · finish 0 · kept 0.
- `render-check.mjs index.html --out shots`: floor 0 · reflex 0 · finish 0 · kept 0 (320/768/1280/1920).
- `tokens-check.mjs DESIGN.md`: floor 0 · reflex 0 · finish 0.
- First render pass found F08 (preset button wider than 320px), F09 (wordmark tap target 21px tall) and R17 (preset escaping the sheet); all fixed. Critique fixes after that: sheet padding was being reset by `.rows` (tractor strip overlapped the "Try" buttons and the `$`), the hero had a void beside the headline (reflowed into a two-row grid), the filter input cut off long filters at 320px (now an auto-growing textarea), and the headline broke as "fields, / not the text" (phrase-grouped).
- Accessory removed: the two-tone wordmark.

## Reflex findings kept

None.

## Assumptions and invented content (verify before shipping)

- Filter operators beyond the brief's `level=error and latency_ms>500`: `!=`, `<`, `>=`, `<=`, `or`, parentheses, double-quoted values with spaces, and numeric comparison of numbers. These are assumed from "SQL-like"; the page's demo parser implements exactly these.
- Usage form `grepline '<filter>' <files...>` and `logs/*.log` as the file argument are assumed.
- Mixing JSON and logfmt files in one run is implied by the brief but not stated outright.
- GitHub URL `https://github.com/grepline/grepline` is a guess.
- All 12 log lines (timestamps, routes, jobs, latencies, file names) are invented examples.
- No version number, benchmark, star count, logo or testimonial is shown, because none exist.
- No dark scheme: the page is a printout by concept. Fonts load from Google Fonts (Martian Mono, IBM Plex Sans, IBM Plex Mono) with `display=swap`.
