# NOTES — grepline landing page

Budget: standard · Surface: marketing · Mode: build (DESIGN.md written here; it did not exist).

## Grounding

- Subject: grepline, an open-source Rust CLI that filters structured logs (JSON, logfmt) across many files with a SQL-like expression.
- Audience: backend and SRE engineers who live in `grep`, `jq`, `less`, often mid-incident, allergic to marketing copy.
- Job: get them to **run the install command** (copy `cargo install grepline` / `brew install grepline`).

## Three directions considered

- A — "Scrollback": borrows the terminal pane and grep's own ANSI colors (`GREP_COLORS`: magenta file names, `--` group separators); the page leads with a live filter prompt over a log table. Dark slate ground, mono-led display, flat panes.
- B — "Postmortem": borrows the incident write-up (timeline table, UTC timestamps, "impact / trigger / resolution" headings); leads with an incident timeline where grepline's query finds the root-cause line. Light warm paper, serif display, hairline tables. Rejected: drifts toward the agent house look / broadsheet (R04c/d), and it dramatises incidents rather than showing the tool.
- C — "Query plan": borrows `EXPLAIN` output and parse trees; leads with a large diagram of `level=error and latency_ms>500` parsed into a tree that fans out over files. Mid-tone blue-grey ground, condensed grotesk display, illustrated diagram. Rejected: explains the parser, which the audience doesn't care about, instead of showing results on logs.

**Chosen: A — "Scrollback"**, because the audience judges a log tool by its output, and the most characteristic thing in this subject's world is a filtered log stream.

Accent candidates: grep match red (ANSI 31), rejected because red already means `level=error`; grep separator cyan (ANSI 36), rejected because it collides with the info level and is the stock devtool teal; **grep file-name magenta (ANSI 35), chosen**, because "across many files" is the product's point and magenta is how grep marks which file a hit came from. It marks matches, file names, and the install action, and nothing else.

Display face candidates: condensed grotesk (Barlow Condensed), serif (Fraunces), **mono-led (Martian Mono), chosen**: the subject's own lettering is terminal text. Martian Mono's width axis gives two voices from one family: wide (112.5) for headings, condensed (87.5) for log rows and commands. Body: IBM Plex Sans.

## Signature

The **live filter prompt in the hero**: `$ grepline '<filter>' logs/*` with an editable filter (prefilled `level=error and latency_ms>500`) over 14 log lines from 3 files. Typing re-filters on every keystroke, matching fields are lit in magenta, and skipped lines collapse into grep-style `-- n lines skipped --` rows. It is visible and in its meaningful state (4 of 14 lines · 3 files) on load: the default result rows are pre-rendered in the HTML, so the hero is complete even before (or without) JS.

Unit: the **log row** (file · time · level · key=value fields). Reused by:
- the formats section (a raw JSON line and a raw logfmt line, then both as normalized log rows with the same matches lit),
- the facts section (one logfmt record set large: `lang=rust license=MIT binaries=1 formats=json,logfmt`, with a log prefix),
- the footer (`app=grepline license=MIT …`).
The syntax table's "Run above" buttons load each example into the hero prompt.

## States (all in the real component, reachable through the real flow)

- Matches: default render.
- No match: type a filter that matches nothing, e.g. `level=fatal` → empty row explaining which fields exist and suggesting `level=warn`.
- Parse error: type `latency_ms>` or `latency_ms 500` → message under the prompt in error red with what's wrong and an example; the input gets `aria-invalid` and keeps the last good result on screen.
- No filter: clear the input → all 14 lines shown.
- Copy: "Copied" on the button + live note; if the clipboard API is blocked, the command is selected and the note says to press Ctrl+C / ⌘C.

## Verification

- lint (`--design DESIGN.md`): floor 0 · reflex 0 · finish 0 · kept 0
- render-check: floor 0 · reflex 0 · finish 0 · kept 0 (320/768/1280/1920)
- tokens-check: floor 0 · reflex 0 · finish 0
- First render pass found F02 (filter input focus ring only on its wrapper), F08 (nav and hero code headline overflowed at 320) and R17 (example-filter chips escaped the pane at 320). All fixed.
- Critique round fixes: cargo command clipped at 320 (smaller, condensed command text; decorative `$ ` hidden below 380px); matched fields off-screen in the demo at 320 (rows become two lines below 600px); normalized table squeezed at 1280 (now spans the section's full width).
- Accessory removed: the dashed rule above the facts notes.

## Reflex findings kept

None.

## Assumptions and invented content (not real facts)

- The demo log lines (services, routes, statuses, latencies, messages, timestamps, file names `api-1.jsonl`, `api-2.jsonl`, `billing.log`) are invented, representative examples.
- Filter operators beyond the brief's example (`!=`, `>=`, `<=`, `<`, quoted values, `or` accepted by the demo parser), case-insensitive string matching, and "lines without the field are skipped, not errors" are assumed behaviour; confirm against the real CLI.
- The CLI invocation `grepline '<filter>' ./logs/*` (filter first, then file globs) is assumed.
- GitHub URLs `https://github.com/grepline/grepline` and `/issues` are assumed.
- "Compiled ahead of time; nothing to set up before the first query" is inferred from "written in Rust, 1 binary".
- No customer logos, testimonials, benchmarks, or star counts were used (none exist).
- Fonts load from Google Fonts. The render check may have used local fallbacks, so the condensed width at 320 was verified with the fallback too.
