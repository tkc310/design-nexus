# NOTES: grepline landing page

Budget: standard. Surface: marketing. Mode: build, plus a DESIGN.md for the record step.

## Ground

- Subject: grepline, an open-source Rust CLI that searches structured logs (JSON, logfmt) across many files with a SQL-like filter.
- Audience: backend and SRE engineers who know grep, jq and SQL and don't trust marketing claims.
- Job: install. The primary action is "Copy install command" (`cargo install grepline`). It is the only filled control and sits on the first screen at every width.

## Three directions considered

- A "Filtered stream": borrows the terminal itself (the pane, SGR 2 dimming, jq's key colour). A live filter over a merged log stream leads the page. Dark blue-graphite ground, mono-led, flat panes, dense.
- B "Man page": borrows `man grepline` (NAME / SYNOPSIS / FILTER / EXAMPLES) as the page structure. The synopsis line leads. Light true-neutral paper, condensed grotesk display, hairline rules, airy. Rejected because it drifts toward the agent house look (R04d), and a static synopsis shows less than a filter you can run.
- C "Incident page": borrows the 3 a.m. pager alert. A saturated amber `level=warn` ground leads, with a full-bleed sequence of the alert, the query and the answer. Slab display, loud. Rejected because it spends the whole page on status colours, which then can't mean status, and it's tiring for a reference people come back to.

Chosen: A, because the subject's strongest proof is what it does to your logs, and a stream you can filter shows that without any claim.

Accent candidates: grep's match red (GREP_COLORS ms=01;31), jq's object-key blue, and the amber of `level=warn`. Chose the key blue because the filter is written in field names (keys), so the colour of a key is the colour of what the user acts on. Red was rejected because it means `level=error` here and reads as R04b on dark. Amber was rejected because it is a status colour and the warmest default.

Display face candidates: Martian Mono (mono), Barlow Condensed (condensed grotesk) and Roboto Slab (slab). Chose Martian Mono because the subject's own lettering is the terminal.

## Signature

A live filter on a merged stream of 12 log lines from three files (two JSON-lines files and one logfmt file). On load it is already in its meaningful state: `level=error and latency_ms>500` lights 3 of the 12 lines, from 3 files. The lines that just miss stay dimmed: an error at 95 ms, an info line at 630 ms, a 500 at 310 ms. The filter is editable. A real parser handles `= != > < >= <=`, `and/or/not`, parentheses, quoted values and dotted keys.

The unit is the log row (a 192px time/file gutter, then the line). These reuse it:
- the facts line (a logfmt line with the same key-blue bar as a matched row)
- the syntax table (the form sits in the gutter)
- the install rows (the tool sits in the gutter)

## States, and how to reach them

- Matches: shown by default.
- No match: type a filter that matches nothing, for example `level=fatal`. The status line says so and suggests a looser filter.
- Parse error: type `latency_ms>` or `level=error and`. The status line says what is wrong and gives an example, and the field gets a red border and `aria-invalid`.
- Copy: success shows "Copied" and a status note. If the clipboard is blocked, the note says to select the command and copy it by hand.

## Invented or assumed content (not from the brief)

- The GitHub URL `https://github.com/grepline/grepline`.
- The filter operators beyond the brief's example: `!=`, `<`, `>=`, `<=`, `or`, `not`, parentheses, quoted values and dotted nested keys. The brief only says "SQL-like" and gives `level=error and latency_ms>500`. Check these against the real grammar.
- "On macOS or Linux with Homebrew", and the first-run command `grepline 'level=error' ./logs/*`, which assumes the invocation `grepline '<filter>' <files>`.
- Every log line, file name, route and job name in the demo.
- The page has no customer logos, testimonials or metrics.

## Tool results (final)

- lint: floor 0 · reflex 0 · finish 0 (also with `--design DESIGN.md`)
- render: floor 0 · reflex 0 · finish 0 at 320, 768, 1280 and 1920
- tokens-check: floor 0 · reflex 0 · finish 0

Fixed during the loop:
- F08 at 320: the inline filter in the lead and the file list were set to nowrap.
- R17 at 320: the "Try" chip was too long, and so was the fields line in the formats panel.
- The filter input cut off the expression at 320 and 768. It is now a textarea that grows.
- JetBrains Mono ligatures showed `>=` as `≥` in the syntax table and chips. Ligatures are now off for all code.
- The left column of the hero was much shorter than the stream at 1280. The facts line moved into the hero.

Accessory removed: the dashed border around the "both read as" panel.

## Reflex findings kept

None.

Known compromise: at 1280 the left hero column still ends about 200px above the stream. I accepted this because the stream is the signature and shortening it would drop the near-miss lines that make the filter believable.
