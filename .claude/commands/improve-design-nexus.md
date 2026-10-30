---
description: Run one iteration of the design-nexus improvement loop (evaluate, collect feedback, change one thing, re-evaluate)
argument-hint: "[case filter, e.g. 01,03] [hypothesis]"
---

Run one iteration of `loop/IMPROVEMENT.md` for this repository. Arguments: $ARGUMENTS

1. Read `loop/IMPROVEMENT.md`, `eval/rubric.md`, and the latest `eval/runs/baseline/summary.md` (if there is no baseline, create one first and stop after scoring it).
2. Read `loop/feedback.md` (open entries) and the baseline's `feedback.md` (run `node eval/run.mjs feedback --run baseline` if missing).
3. Choose ONE hypothesis (or use the one given in the arguments). Write it to `loop/experiments.md` before changing anything.
4. Make the smallest change in `skills/design-nexus/` that tests it. If you touched scripts or checks, run `node scripts/test.mjs`.
5. `node eval/run.mjs prepare --label exp-<n>` (with `--cases` if a filter was given). For each case folder, spawn a subagent that works only inside that folder and completes its `PROMPT.md` using the skill at `skills/design-nexus/`.
6. `node eval/run.mjs score --run <run>`, then `node eval/run.mjs judge --run <run>`; for each case spawn a separate fresh subagent with that case's `JUDGE_PROMPT.md` and save its JSON reply as `judge.json`. Then score again.
7. `node eval/run.mjs compare --base baseline --run <run>`. Apply the verdict as `loop/IMPROVEMENT.md` step 4 says, record the result in `loop/experiments.md`, and report the comparison table.

Do not commit or push unless asked.
