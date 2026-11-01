# NOTES: grepline landing page

Budget: standard. Surface: marketing. Mode: build (with system: DESIGN.md written here).

## Ground

- Subject: grepline, an open-source Rust CLI that filters JSON and logfmt logs across many files with a SQL-like filter.
- Audience: backend and SRE engineers, terminal-native, often reading logs mid-incident.
- Job: install. Primary action is the filled **Copy** button for `brew install grepline` in the hero; `cargo install grepline` has an outlined Copy beside it.

## Three directions considered

- A — "Search hit": a terminal pane where the filter is edited inside a real `$ grepline '…' logs/*` command and the log stream answers live; matches lit in pager search-hit yellow. Dark graphite, mono-led, flat bordered panes, dense.
- B — "Greenbar printout": continuous-form line-printer paper (pale green bands, tractor holes) with the filter circling matching lines in red pen. Light warm paper, line-printer mono, textured material.
- C — "On-call hi-vis": saturated safety-yellow ground from incident-command vests, condensed display at poster size, the filter shown as a single giant command with the result count. Loud and maximal.

**Chosen: A.** The audience's own material is a terminal and its output, so the product working on real-looking records is the strongest proof available when there are no logos or testimonials. B was nostalgic, not something SREs look at now. C was loud but showed less of the product.

## Accent and display choices

- Accent candidates: GNU grep match red (`ms=01;31`), pager/vim `hlsearch` yellow, ANSI cyan (grep separator). Chosen: **search-hit yellow #F2CC4B**. It means "match", which is what grepline produces, and it fills the one install button because that command is the match the visitor came for. Red was rejected because it collides with `level=error`, which the demo has to show as status. Cyan was rejected because in log pretty-printers it reads as "info", not "match".
- Display candidates: Martian Mono (mono), Barlow Condensed (condensed display, pager signage), Zilla Slab (slab). Chosen: **Martian Mono**, because the lettering of the subject's world is a terminal. Body: IBM Plex Sans. Log lines and code: JetBrains Mono, with ligatures off so `>=` and `!=` read exactly as typed.

## Signature

The **live filter pane**: the filter is a field inside the shell command, and the 16-record, 4-file stream below re-filters as you type. Matched fields are highlighted per record, non-matches collapse into grep-style `-- N records filtered out` separators, and a status line counts records and files. Its unit is the **record row** (`file:line` gutter plus key/value tokens that wrap between tokens, never inside one). The same row builds:
- the syntax table, whose match counts come from running the same parser on the same records, plus a "Run above" button per row;
- the "why one error printed and the other didn't" trace, which evaluates two `level=error` records condition by condition;
- the closing "grepline, as a record" line (`lang=rust license=MIT binaries=1 formats=json,logfmt`);
- the install commands (`$` prompt rows).

## States (all reached through the real input)

- Default: `level=error and latency_ms>500` gives 3 of 16 records in 2 of 4 files.
- Parse error: type `latency_ms>>5`, `level=error and` or an unclosed quote. You get a red message with the column and an example, and the field is set to `aria-invalid`.
- Unknown field: type `latnecy_ms>5`. The message lists the fields that exist, and the empty state appears.
- No match: type `level=debug`. The empty state explains what happened and suggests loosening a condition.
- Empty filter: every record prints.
- Copy success: "Copied: …". Copy failure (no clipboard permission, and the execCommand fallback fails): an error telling you to select the command and press Ctrl+C / ⌘C.

## Assumptions and invented content

- The filter grammar beyond the brief's example (`!=`, `<`, `>=`, `<=`, `or`, parentheses, quoted values, numeric vs text comparison, "a record without the field never matches") is my assumption of what a "SQL-like" filter supports. Confirm it against the real CLI.
- The invocation form `grepline '<filter>' logs/*` is assumed.
- All 16 log records, file names (`api.jsonl`, `gateway.jsonl`, `worker.log`, `billing.log`) and line numbers are invented examples.
- The crates.io URL `https://crates.io/crates/grepline` is inferred from `cargo install grepline`. No GitHub link was added because the repository URL is unknown.
- The only stated facts used: Rust, MIT, one binary, `cargo install grepline`, `brew install grepline`, JSON and logfmt, and the example filter. No logos, testimonials or metrics.

## Challenge-the-plan revisions

- The first plan had a "facts" stat strip. I replaced it with a single logfmt record of grepline itself (R09).
- The first plan used a single-line input. I replaced it with an auto-growing one-line textarea, because at 320px a text input hid the end of the filter.
- The first build had a closing row with a short paragraph floating under empty space. I moved the heading and record into the left column and the install box to the right.
- I turned off JetBrains Mono ligatures, which had turned `>=` into `≥` in a syntax reference.
- From 1600px up, the content width grows to 96rem so log lines fit on one row and the page is not a narrow floating column.
- The removed accessory was the "4 files · 16 records" label in the pane header, which repeated the status line.

## Tool results (final)

- `lint.mjs index.html --design DESIGN.md`: floor 0, reflex 0, finish 0, kept 0.
- `render-check.mjs index.html --out shots`: floor 0, reflex 0, finish 0, kept 0 (320/768/1280/1920 screenshots in `shots/`).
- `tokens-check.mjs DESIGN.md`: floor 0, reflex 0, finish 0.
- The first render run found F08 (horizontal scroll at 320 from long tokens and a preset button), F09 (wordmark and footer link under 24px tall) and R17. All were fixed.

## Reflex findings kept

None.

## Known trade-offs

- The demo records, syntax counts and trace are rendered by an inline script at the end of `<body>` instead of being prerendered HTML. They appear on first paint in practice, but without JS the pane shows only the prompt and examples.
- Only the near-black ground plus a single yellow accent is close to R04b. R04b names acid green or vermilion; yellow is argued from the search-hit colour and is also the hit highlight, so it carries meaning rather than decoration.
