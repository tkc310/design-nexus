# NOTES — grepline landing page

Budget: standard. Surface: marketing. Mode: build (no DESIGN.md existed; one was written here).

## Ground

- Subject: grepline, an open-source Rust CLI that filters JSON and logfmt log records across many files with a SQL-like expression.
- Audience: backend and SRE engineers, fluent in grep/jq, suspicious of marketing, deciding in seconds whether this is worth a `brew install`.
- Job (primary action): **install**: copy `brew install grepline`. It is the only filled control on the first screen at 1280 and 768 and is on the first screen at 320.

## Three directions considered

- A — "Query as headline": a terminal pane in ripgrep's output conventions (magenta paths, ANSI level colors); the page leads with an editable filter at display size running live against real-looking records. Dark, mono-led, table/board, flat panes, dense.
- B — "Man page": the printed `man grepline` page (NAME, SYNOPSIS, OPTIONS, EXAMPLES) on a true white ground, single column, mono + serif, hairlines; leads with the SYNOPSIS line. Light, airy, documentary (rejected: drifts into the agent house look R04d, and shows syntax without showing the result).
- C — "Incident at 03:12": a full-bleed sequence narrating one incident as successive filters narrowing a flood of lines to three; pager-amber saturated ground, condensed display type, loud. (Rejected: needs invented incident numbers to land, and puts the install action behind a story.)

**Chosen: A**, because what sells grepline is seeing a filter turn into matching records; the visitor can do that before installing.

## Token plan (as shipped)

- Colors: ground #16181B (terminal background), pane #1F2226 (focused pane), rule #33383E (pane divider), edge #6E757E (field/button outline, 3:1 on pane), ink #E6E4DF (terminal foreground), dim #A0A5AC (non-matching output), path #D670D6 (ripgrep's path color as ANSI bright magenta — accent), lv-error #FF7B72 and lv-warn #E3B341 (ANSI red/yellow as log libraries print levels; status only).
- Accent candidates: ripgrep's bold-red match color (collides with ERROR, status hue), ripgrep's magenta path color (chosen: it marks *where the match lives*, which is what the page shows), plain bold foreground (too quiet to carry the action).
- Display candidates: Martian Mono (terminal lettering, chosen: the subject's own letters are monospaced), Barlow Condensed (dashboard panel titles), a slab (Roboto Slab, printed manual). Body IBM Plex Sans; data/code IBM Plex Mono. All from Google Fonts.
- Scale 1.25 from 16 (15 data, 16, 20, 25, 39 h1, 48 filter). Spacing base 8. Radius 6px on panes/controls; no shadows.

## Challenge: what changed

- No fake terminal window chrome (traffic-light dots); the pane is the page's own table.
- Hero is not "headline + two buttons": the filter is the thesis and is bigger than the h1.
- No feature-card grid or stat strip: features appear as a format comparison, a syntax reference table whose examples run in the console, and a facts row built from the same record unit.
- Avoided acid green (R04b) and the dark closing band; the closing section reuses the command component.

## Signature

The editable filter `level=error and latency_ms>500`, set in Martian Mono at 48px with colored tokens, running live against 12 records grouped by file like ripgrep's `--heading` output: matches get a magenta rule, their file heading turns magenta, and the fields that decided the match are underlined. Unit: the record row / field cell, reused in Formats (parsed fields), Syntax (each example is a button that loads the filter and shows its live count), and Install (facts row).

## States, and how to reach them

- Match (default): 3 of 12.
- Parse error: type `level=error and latency_ms>` or `(level=warn` — red border, `aria-invalid`, message saying what is missing; table keeps the last valid result and the status says so.
- No match: `level=ERROR` (values are case-sensitive) → suggestion; unknown field `host=web1` → names the fields that exist.
- No filter: clear the field → all 12 shown.
- Copy failure: if the clipboard is unavailable, the command is selected and the message says to press Ctrl+C / ⌘C.

## Invented or assumed facts (verify before publishing)

- The repository URL `https://github.com/grepline/grepline`.
- CLI invocation shape `grepline '<filter>' <files…>`.
- Operators beyond the brief's `=`, `>` and `and`: `!=`, `<`, `>=`, `<=`, `or`, `not`, parentheses, quoted strings; numeric comparison for numbers; missing field never matches; case-sensitive string equality.
- Brew chosen as the primary command (laptops of the stated audience); cargo is secondary.
- All 12 log records, file names (api.jsonl, worker.log, edge.jsonl), routes, jobs, and messages are illustrative.

## Tool results

- lint: floor 0 · reflex 0 · finish 0 (also with `--design DESIGN.md`).
- render-check (320/768/1280/1920): floor 0 · reflex 0 · finish 0. First run had 3 Floor findings (F01 transparent textarea text at 1280/1920, F08 overflow at 320 from the 20px install command); both fixed.
- tokens-check: 0 findings.

## Reflex findings kept

None.

## Critique round fixes

1. Nav links sat left at desktop (ul auto margin inside nav) → nav pushed right.
2. In the narrow block layout, the empty `status –` cell rode on the first line → ordered with the other fields.
3. Textarea overlay redone so the real text is drawn (muted) and token colors are painted over it.

Accessory removed: the magenta chevron before the wordmark.
