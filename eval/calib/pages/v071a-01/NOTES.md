# NOTES: grepline landing page

Budget: standard. Surface: marketing. Mode: build (plus a DESIGN.md for the project root).

## Ground

- Subject: grepline, an open-source Rust CLI that searches structured logs (JSON, logfmt) across many files with a SQL-like filter.
- Audience: backend and SRE engineers who already grep, jq and tail logs, often during an incident.
- Job: run the install command (copy `brew install grepline` or `cargo install grepline`).

## Three directions considered

A. "Result lines" (chosen): the page is grepline's own output. Dark ground taken from a terminal pane, mono-led display, flat terminal panes with 1px borders. The hero leads with a live filter over a stream from three log files.
B. "man page": a light page laid out like `man grepline` (NAME, SYNOPSIS, FILTERS, EXAMPLES), with a serif body and mono throughout and a single column. Rejected: it sits too close to the agent house look (pale paper, serif body, mono labels, hairlines), and it describes the filter where it could show the filter running.
C. "Query plan": a mid-tone slate ground with a condensed grotesk display. The page is a grid of artifacts (a query, the plan, the per-file counts), like a database console. Rejected: the console look belongs to databases, not logs, and it made the page about the engine instead of the lines an SRE is hunting for.

Accent candidates: grep's bold red match colour (ANSI 31), ANSI 35 magenta (the colour rg gives file paths), and a near-neutral cursor grey. I chose magenta because red collides with `level=error` and grey can't mark a match. Magenta is the one ANSI colour no log level owns.
Display face candidates: Martian Mono (mono, wide), Barlow Condensed (condensed display), IBM Plex Serif (serif). I chose Martian Mono because the subject's own lettering is a terminal. Body is IBM Plex Sans, and code and log lines use JetBrains Mono.

## Signature

The live filter pane ("Try a filter on the 03:12 incident"). On load it already has `level=error and latency_ms>500` applied to 22 lines from api.jsonl, worker.log and gateway.jsonl: 7 lines are marked with a magenta bar and the matched keys, the rest are dimmed, and per-file counts are shown. Visitors can edit the filter.
The unit is the result line: a `file:line` gutter, time, level, then `key=value` pairs. It is reused by:
- The filter syntax list. Each operator row has a live match count against the same stream, and a Run button loads that example into the filter.
- The formats section. One logfmt line and one JSON line both come out as the same result lines.
- The closing facts record (`Cargo.toml:1 info lang=rust license=MIT binaries=1`).

## States (all in the real component)

- Default: the brief's filter, 7 of 22 match.
- Parse error: type `latency_ms>` or `level=error and (status>500`. The message gives the column and a fix, the input gets aria-invalid, and the lines keep the last valid result.
- Unknown field: type `latancy_ms>5`. A hint lists the fields that exist.
- No matches: type `latency_ms>99999`. A message in the stream suggests loosening a number or using `or`.
- Empty filter: clear the input. All lines are shown unmarked.
- "Show non-matching lines" toggle, and a Reset filter button.
- Copy: the button reads "Copied". If the clipboard is blocked, the command is selected and the user is told to press Ctrl+C or Cmd+C. Both are announced through a polite live region.

## Invented or assumed (not given in the brief)

- The command-line shape `grepline '<filter>' <files…>` and the example `grepline 'level=error' logs/*`.
- The filter grammar beyond `=`, `>` and `and`: `!=`, `>=`, `<`, `<=`, `or`, `not`, parentheses, double-quoted values, "and binds tighter than or", and "fields missing from a line never match". These need confirming against the real parser.
- That JSON and logfmt files can be mixed in one run and come back in one output shape.
- All log lines, file names, line numbers, routes, jobs and timings are invented incident data.
- No GitHub URL was given, so the page has no repository link. Add one to the nav and footer once known.
- The page is dark only, with no light scheme.

## Verification

- lint (`--design DESIGN.md`): floor 0, reflex 0, finish 0.
- render-check (320/768/1280/1920): floor 0, reflex 0, finish 0. Fixed along the way:
  - F02: focus on the filter input.
  - F08: 320px overflow from the hero code nowrap and the query grid's min-width.
  - R17: a label and a quoted value escaping their panels at 320.
- Tokens-check: 0 findings. The border token is decorative only, and the input border uses the muted token for 3:1.
- Headless test of the filter states above: no page errors.
- Critique fixes after reading the screenshots:
  - Turned off code ligatures, so `!=` no longer showed as ≠.
  - Result lines reflow below 900px, because the matched field was scrolled out of view at 320 and 768.
  - Install rows stack at under 480px, because the commands were clipped.
  - Formats panes are stacked full width, because the raw lines were clipped in half-width panes.
  - Widened the syntax example column.
- Accessory removed: the "macOS, Linux" label on the install pane (least necessary, and inaccurate for cargo).

## Reflex findings kept

None.
