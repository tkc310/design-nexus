# NOTES — grepline landing page

Budget: standard. Surface: marketing. Mode: build (plus a DESIGN.md for the record).

- Subject: grepline, an open-source Rust CLI that filters JSON and logfmt logs across many files with a SQL-like syntax.
- Audience: backend and SRE engineers who already use grep/jq and distrust marketing.
- Job (primary action): install — copy `brew install grepline` (filled button); `cargo install grepline` is the outlined secondary.

## Directions considered

Usual look: near-black ground, all-mono type, a terminal window with traffic-light dots as hero, green or purple accent, grid of feature cards.

- A — "Edge-notched": a McBee Keysort edge-notched record card and its steel tray (the paper system that filtered stacks of structured records by boolean conditions); a live filter tray leads the page.
- B — "Strip chart": a chart recorder's gridded paper roll with a pen trace crossing a threshold line; full-bleed sequence where latency spikes over 500 ms are the matches. Light cool ground, grotesk.
- C — "Departure board": a Solari split-flap board; dark, loud, condensed display; each log line a flipping row. Rejected: still dark + mono-ish, close to the category default and to R04b.

Chosen: A. It is the off-screen object that does exactly grepline's job (keep the records whose fields satisfy conditions joined by and/or). Departs from the usual look on ground value (buff card stock, not near-black), display genre (condensed grotesque of the card's printed rubric, not mono), and the look of the data mark (a hole per condition, opened when true; kept lines pulled out of the stack).

Accent candidates: rubric red #A3241B (the card's printed field codes), ribbon blue-black #26336B (typed entries), tray steel #56635C (near-neutral). Chose rubric red: on the card it is the only colored ink and it marks the field positions, i.e. the conditions the user writes. Blue on pale paper would land on the house look (R04d); steel cannot carry an action.
Display candidates: Barlow Condensed (condensed grotesque, the card rubric), a typewriter mono (usual look), a slab (no source). Chose Barlow Condensed; Barlow body (same family, normal width), IBM Plex Mono for commands and log lines.

## Signature

The filter tray in the hero: ten log lines from four files, each with one hole per condition of the current filter, opened (red when the line is kept) where that condition holds; kept lines slide out of the stack. The filter is editable and re-evaluated live. The same unit (the edge position, intact or opened) is reused in the syntax table's Keeps/Skips column and as the section dividers; the clipped corner of the card is reused on the install command panels.

States reachable through the real flow: type an unparseable filter (e.g. `latency_ms>`) for the error message with a fix; `level=debug` for the no-match message; `foo=1` for the unknown-field message; clear the field for the empty prompt. Copy buttons show "Copied" (or "Select it" if the clipboard is refused).

## Reflex findings kept

None. Lint: floor 0 · reflex 0 · finish 0. Render: floor 0 · reflex 0 · finish 0 (320/768/1280/1920).

## Changes from critique

1. 1280 hero had a large void under the install panel: moved the four facts (Rust, 1 binary, MIT, 2 formats) into the hero as a ruled list; closing section became heading + commands split.
2. Removed the accessory: the inline "Written in Rust / One binary / MIT licensed" strip (now redundant).
3. Footer link tap target raised to 24px+ (F09); `.next` command allowed to wrap at spaces at 320.

## Invented or assumed facts (not from the brief)

- Operators beyond `=`, `>`, `and`: `!=`, `<`, `>=`, `<=`, `or`, parentheses; numeric vs string comparison; a missing field never matches.
- Command shape `grepline '<filter>' <files...>`, mixed JSON and logfmt files in one run, and output prefixed with the file path.
- All log lines, file names (api-01.json, worker.log, edge.json…), services and latencies are illustrative.
- Repository URL https://github.com/grepline/grepline.
