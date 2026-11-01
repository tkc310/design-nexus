# NOTES: grepline landing page

Budget: standard. Surface: marketing. Mode: build (DESIGN.md written here as the record).

## Ground

- Subject: grepline, an open-source Rust CLI that filters JSON and logfmt log lines across many files with a SQL-like expression.
- Audience: backend and SRE engineers who want to see the filter work before installing.
- Job: install. The primary action is the filled "Copy command" button next to the install command, shown on the first screen at every width.

## Directions considered

Usual look: near-black ground, mono-led type, a fake terminal window with traffic-light dots as the hero, an acid-green accent, flat dark feature cards in a three-column grid.

- A, "Edge-notched records": borrows from the McBee Keysort edge-notched card, the paper tool that filtered a stack of structured records by field: matching holes are notched open to the edge and fall out on the needle. The hero is a live list of log lines whose edge marks are notched where the filter matches. Light buff ground, condensed grotesk caps.
- B, "State listing": borrows from an HP 1630 logic analyzer's state-listing screen with trigger qualifiers. A dense table/board on a dark graphite ground, mono-led, where the trigger row leads. Rejected: it sits too close to the usual near-black dev-tool look.
- C, "Field book": borrows from a yellow all-weather surveyor's field book, with ruled reading columns and pencil entries struck through instead of erased. Saturated yellow ground, slab display, split layout. Rejected: it is loud and distinctive, but a field book records readings and doesn't filter them, so it says less about the product.

## Chosen

A, "Edge-notched records". It is the only object of the three that does grepline's job off screen (selecting records by field across a whole stack at once). It departs from the usual look on ground value (light buff stock), display genre (condensed grotesk caps from the card's printed captions), the look of the data mark (notched red slot vs intact ring), and surface (light ruled panels with one soft elevation).

Accent candidates: ruling red `#A3162A`, sorting-steel gray `#4A5560`, carbon-copy violet `#4B3F8F`. I chose red because the card prints its hole row in red so the eye finds match positions. Here red appears only on matches and on the copy button, and log levels are set in plain text so red never doubles as a status color.

Display candidates: condensed grotesk (chosen), slab, mono-led (the usual look).

## Signature

The notch edge. Every log record row in the hero has an edge mark: an intact ring when the line doesn't match the filter, and a red slot cut from the panel edge to the hole when it does. Matching rows also step 8px out of line, like records falling out of the stack. It is live against the editable filter and shows the meaningful state on load (`level=error and latency_ms>500`, 3 of 12 lines). Other sections reuse the same unit:
- The syntax table's "Matches above" column: a 12-position strip per filter, notched for the sample lines that filter keeps.
- The card's ruled field divisions: double rules under the header, between sections, and above the field captions in the formats section. The install steps are ruled rows too.

Words kept out of the copy: card, deck, stack, needle, notch, punch, hole, Keysort, drop, sort.

## Tool results

- `lint.mjs index.html --design DESIGN.md`: floor 0, reflex 0, finish 0.
- `render-check.mjs index.html --out shots`: floor 0, reflex 0, finish 0. The first run had F08 (horizontal scroll at 320 from the syntax table and a nowrap filter code) and R21 (install command overlapping its button at 320). Both are fixed.
- `tokens-check.mjs DESIGN.md`: floor 0, reflex 0, finish 1 (N08: display and body share Archivo, on purpose; the 62% vs 100% width axis carries the voice).

## Reflex findings kept

None.

## Critique round fixes

1. At 768, the syntax table squeezed the middle column to one word per line. Filter code now wraps at spaces below 1040px, and the middle column has a 12rem minimum.
2. At 320, the filter text was cut off in a single-line input. It is now a textarea that wraps (Enter is blocked and newlines are replaced, so it still works as one line).
3. An empty status line left a gap at the end of the install steps. It now sits after the list.
4. Also: the content measure widens to 1480px at 1600px and up, and at 320 the edge marks line up with each row's first line.

Accessory removed: the rule above the facts strip (Rust / MIT / one binary).

## States (all in the hero filter panel, on the real code path)

- Matches: the default.
- No match: type `level=debug`. The status reads "0 of 12 lines match" with a hint to loosen a condition.
- Parse errors: type `lvl=error` (unknown field, lists the valid fields), `level=` (missing value), `(level=error` (unclosed parenthesis), or `level=error error` (missing and/or). The field gets `aria-invalid` and a red border, the message is in the live status, and the last valid result stays visible.
- Empty filter: clear the field. All lines are unmarked, with a prompt to type a filter.
- Copy: success says what was copied and to paste it into the terminal. If clipboard access is blocked, the command is selected and the note says to press Ctrl+C / Cmd+C.

## Assumptions and invented content

- CLI usage `grepline '<filter>' <path>`, and the `logs/` argument. These are not given in the brief.
- Operators beyond `=`, `>` and `and`: `!=`, `<`, `>=`, `<=`, `or` and parentheses. "SQL-like" suggests them, but they are not confirmed.
- That one folder can mix JSON and logfmt files, and the field names `ts`, `level`, `service`, `route`, `latency_ms`, `msg`.
- All 12 log lines, the file names (api-1.jsonl, api-2.jsonl, worker.log, auth.log), and the messages and timings are invented examples.
- "On any platform Rust builds for" for cargo is a reasonable inference, not a stated fact.
- No repository URL was given, so there is no GitHub link. No logos, testimonials, stars, or performance numbers are used.
- No dark scheme. The page is light only.
- Fonts: Archivo (variable width/weight) and IBM Plex Mono from Google Fonts.
