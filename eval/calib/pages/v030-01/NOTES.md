# NOTES: grepline landing page

Budget: standard. Surface: marketing. Mode: build (+ system, since DESIGN.md was written here).

## Ground
- Subject: grepline, an open-source Rust CLI that filters structured logs (JSON, logfmt) across many files with a SQL-like where-clause.
- Audience: backend and SRE engineers fluent in grep/jq/less, often reaching for it mid-incident.
- Job: run the install command (`brew install grepline` / `cargo install grepline`).

## Three directions considered
- A "grep --color": light terminal in the default Terminal "Basic" profile, colors taken only from GNU grep's default GREP_COLORS (magenta filename, green line number, bold red match); mono-led; split hero over a full-width live terminal that leads the page.
- B "man grepline(1)": the page as a man page (NAME / SYNOPSIS / FILTERS / EXAMPLES / INSTALL); single column, mono-only, airy, flat. Rejected: it drifts toward the agent house look (printed-document, hairlines, mono micro-labels).
- C "3 a.m. page": dark, saturated alert-red/navy ground from an incident pager, condensed display grotesk, loud full-bleed sequence (alert fires, too many files, one query, the line). Rejected: it dramatizes the problem rather than showing the product, and dark + one hot accent sits close to R04b.

## Chosen
A, because the tool's name and audience come from grep: these engineers already read magenta:green:red as "file:line:match", so the palette is a vocabulary they own rather than a brand invention, and the hero can prove the filter syntax by running it.

## Signature
The live filter in the hero terminal: an editable `$ grepline '<filter>' *.jsonl *.log` command (default `level=error and latency_ms>500`) that refilters 18 sample lines from four files in the browser, prints them as grep-style `file:line:` output, and colors the fields that satisfied the filter in bold red. It shows the meaningful state on load (5 of 18 lines matched), has presets, a useful parse-error message (`aria-invalid`, `aria-describedby`), and an empty state that lists available fields.

## Verification
- lint (`--design DESIGN.md`): floor 0, reflex 0, finish 0, kept 0.
- render (320/768/1280/1920): floor 0, reflex 0, finish 0, kept 0.
- tokens-check DESIGN.md: floor 0, reflex 0, finish 0.

Critique fixes made after the first render: (1) anatomy-figure labels ran together ("equals value to match"), so tokens now have a gap; (2) at 1920 the page was a 1216px column floating in white, so the max width and display size grow above 1600px; (3) at 320 the install commands were clipped behind the Copy button, so they use the narrow width axis and a tighter button. Also shortened the formats demo lines so both red matches are visible without scrolling. Accessory removed: the 4px magenta rule above the closing install section (now a plain hairline aligned to the content).

## Reflex findings kept
None. No Reflex findings were reported by lint or render.

## Assumptions (no one to ask)
- GitHub URL assumed as https://github.com/grepline/grepline.
- CLI invocation shape `grepline '<filter>' <files...>` and grep-style `file:line:` output are assumed; only the filter example `level=error and latency_ms>500` is a given fact. The in-page demo also accepts `or`, `!=`, `>=`, `<`, `<=`; the copy only claims `=`, `>`-style comparisons and `and`.
- All log lines are sample data and labeled as such in the terminal status bar and footer. No metrics, logos, or testimonials were invented.
- Light scheme only (no dark palette) given the standard budget.
