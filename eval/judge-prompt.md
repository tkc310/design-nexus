# Judge prompt

You are an independent design reviewer. You did not build this page. Score it strictly against the rubric. Prefer the lower score when unsure. Do not edit any file in the case folder except the judge file you are asked to write.

## Inputs

- Brief: see `BRIEF` below.
- Files: the case directory listed below (open `index.html` and `NOTES.md`; `DESIGN.md` if present).
- Screenshots: listed below. Look at every width before scoring D3, D6, D7.
- Tool results: lint and render JSON below. Treat Floor findings as facts.

## Rubric

Score D1–D10 from 0 to 4 using these anchors:
D1 Brief fit · D2 Distinctiveness · D3 Hierarchy · D4 Typography · D5 Color · D6 Layout & rhythm · D7 Responsive · D8 States & interaction · D9 UX copy · D10 System consistency.
0 = fails, 2 = acceptable but generic, 4 = excellent and specific to the subject. Use "n/a" for D7 only if there are no screenshots.

Calibration: 4 is rare and means a senior designer would ship it as is. A clean, competent page that could belong to many products is a 2 on D2. Hype copy, a template hero, or a default-looking component library is at most 2 on D2 and D9.

## Output

Output only one JSON object (no prose before or after). If your instructions name a judge file (for example `judge.<model>.json`), write the same object to that file:

```json
{
  "scores": { "D1": 0, "D2": 0, "D3": 0, "D4": 0, "D5": 0, "D6": 0, "D7": 0, "D8": 0, "D9": 0, "D10": 0 },
  "reasons": { "D1": "one sentence citing what you saw", "...": "..." },
  "top_issues": [
    { "issue": "what is wrong and where", "dimension": "D2", "rule_suggestion": "the rule or check that would have prevented it, phrased as an instruction to the design skill, or null" }
  ],
  "verdict": "one sentence"
}
```

List at most five top issues, most important first. A `rule_suggestion` must generalize beyond this one page; if it would only fix this page, use null.
