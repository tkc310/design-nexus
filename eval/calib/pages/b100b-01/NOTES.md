# NOTES: grepline landing page

Budget: standard. Surface: marketing. Mode: build. Primary action: run the install command, via the filled "Copy" on `brew install grepline` in the hero (`cargo install grepline` is the outlined secondary).

## Ground

- Subject: grepline, an open-source Rust CLI that searches structured logs (JSON, logfmt) across many files with a SQL-like filter.
- Audience: backend and SRE engineers. They live in a terminal and trust output more than adjectives.
- Job: install it (copy `brew install grepline` or `cargo install grepline`).

## Three directions considered

- A, "Match highlight": borrows the terminal log viewer and the search-hit highlight of vim/less. The page leads with a live filter running over twelve log lines. Dark graphite pane, mono-led type, dense, flat hairline rows.
- B, "man grepline": borrows the man(1) page (NAME, SYNOPSIS, OPTIONS, EXAMPLES as the page structure). Light neutral paper, single column, serif and mono. Rejected because it drifts straight into the agent house look (R04d) and makes the reader scroll before seeing a single result.
- C, "Incident at 03:12": a full-bleed sequence telling a pager incident, from alert to the one query that found the slow errors. Saturated pager-orange ground, condensed display face, loud. Rejected because the story pushes the install command below the fold and invents a narrative where the brief gives facts.

Chosen: A. Without logos or testimonials, the only honest proof for this audience is the tool's own output. A puts the filter, the matches, and the install command on the first screen.

## Token decisions

- Accent candidates: (1) grep's default match red (`GREP_COLORS ms=01;31`), (2) the vim `hlsearch` / less search-hit yellow, (3) jq's bold blue for JSON keys. Chose the hit yellow because it marks the thing the product exists to find. Red would collide with `level=error`, which is a status. Blue reads as a link or a key, not as a match.
- Display candidates: (1) a condensed grotesk like dashboard panel titles, (2) a slab like printed runbooks, (3) a mono like the terminal itself. Chose Martian Mono at 75% width because the subject's own lettering is the terminal. The narrow width keeps the h1 short at 320px. Body: Instrument Sans. Code and log lines: JetBrains Mono, with ligatures off so `!=` and `>=` read as typed.
- Ground #1b2027 (terminal pane), surface #29303a (tmux bar and split rule), ink #dde3ea, dim #8d97a5 (a non-matching line), hit #f5c542, err #ff8077 (`level=error` only).

## Signature

The live filter wall in the hero. `level=error and latency_ms>500` runs over twelve lines from three files. The three matching rows get a yellow gutter bar and highlighted matching fields, and the other nine stay visible but dimmed. The filter is a real parser: `= != > >= < <=`, `and or not`, parentheses. It is editable and has four preset filters.

The unit is the log row (gutter bar, timestamp, level, service, message, key=value fields, @file). Other sections reuse it:
- The syntax reference is a table of rows with the same gutter bar. The row whose example is loaded in the hero lights up, and each row's "Run" button loads its example into the wall.
- The JSON vs logfmt section shows raw source lines with the same marks and a "prints as" log row beneath each.
- The facts section (`lang=rust`, `license=MIT`, `binaries=1`) uses key=value tokens with a gutter rule.
- The footer is a key=value line.

## States (all reached through the real filter)

- Match: the default, 3 of 12.
- Empty: type a filter with no matches, e.g. `latency_ms>9000`. A typo'd field such as `latncy_ms>500` also says which field doesn't exist and lists the real fields, with a reset button.
- Parse error: e.g. `latency_ms>>5`, `(level=error`, `level=x and`. The field border turns error-red, `aria-invalid` is set, and the message says what is wrong and gives an example. The last good result stays on screen.
- No filter: clear the field. All 12 lines show unhighlighted.
- Copy failure: when the clipboard is unavailable, a message says to select the command and press Ctrl+C / ⌘C.

## Critique rounds (2)

1. 320px horizontal scroll (inline code in the lead, the long preset chip, the footer URL), plus the prompt escaping the wall. Fixed by letting those wrap at spaces and making the input an auto-growing textarea so the whole filter stays visible at 320. The syntax table's labelled-block layout at 320 was broken (operators stacked in the grid, and the live-row bar was drawn behind the label), so I fixed that too. The JSON/logfmt panes overflowed at 768, so they now always use the stacked row layout.
2. JetBrains Mono ligatures were rendering `!=`/`>=` as ≠/≥, which misstates the syntax. Turned off at higher specificity than the `font` shorthands. At 1280 the hero's left column had a void, which I filled with a real "Then run your first search" step. The container is wider at 1920. At narrow widths the copy buttons are tightened so they sit beside their commands.

Accessory removed: the redundant `tool=grepline` item in the footer.

## Reflex findings kept

None. Lint: floor 0 · reflex 0 · finish 0. Render: floor 0 · reflex 0 · finish 0 (320/768/1280/1920).

## Invented or assumed (not stated in the brief)

- The operator set beyond `=`, `>` and `and` (`!=`, `>=`, `<`, `<=`, `or`, `not`, parentheses), case-insensitive string equality, and "a line missing the field doesn't match".
- The output line format shown in the wall and under "prints as".
- All twelve log lines, the services (checkout, billing, search, auth), the file names, the timestamps and the values.
- The GitHub URL `https://github.com/grepline/grepline`.
- "No daemon, no index to build first" and "built for directories of large files": inferred from a single-binary grep-style CLI. Verify before shipping.
- brew was chosen as the primary command over cargo, on the assumption that more SREs have Homebrew than a Rust toolchain.
