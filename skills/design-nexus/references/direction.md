# Direction: from subject to token plan

## 1. Ground the subject

Write three sentences before anything visual:

- **Subject**: what this is, in the subject's own vocabulary (a ceramics studio, a payroll tool for clinics, a CLI for log search).
- **Audience**: who arrives, what they already know, what they fear or want.
- **Job**: the single thing this page or screen must get done. One verb.

If the brief is vague, choose a concrete subject and say you chose it. Pull from the subject's world: its materials, instruments, documents, units, rituals, and real artifacts. A tide-table app borrows from nautical almanacs; a tax tool borrows from forms and ledgers. That borrowed vernacular is where distinctiveness comes from, not from effects.

## 2. Infer from the product type

Use these defaults only as a starting hypothesis, then argue with them.

| Product type | Usually wants | Usually avoid |
|---|---|---|
| Developer tool / CLI | Monospace utility face, dense information, real code and output as hero | Abstract 3D blobs, stock photos of people |
| Finance / B2B ops | Calm palette, tabular figures, precise alignment, trust through specifics | Playful bouncy motion, neon |
| Health / care | Warm but clinical clarity, generous spacing, plain language | Alarm red as brand color, jargon |
| Consumer lifestyle / food / craft | Material photography, characterful display type, tactile texture | Dashboard-like cards, generic SaaS grids |
| Creative portfolio / agency | One strong idea executed fully, editorial type, unusual layout | Template sections (features / testimonials / pricing) by reflex |
| Education / docs | Readable measure (60–75ch), strong wayfinding, code/figure styling | Decorative motion, low-contrast gray text |
| Data dashboard / admin | Quiet surfaces, aligned numerals, restrained color reserved for status and data | Gradients on cards, oversized hero headers |
| Public sector / civic | Maximum legibility and contrast, predictable patterns | Novelty for its own sake |

## 3. Three directions

Directions must differ in **structure** (layout concept, hierarchy, what leads), not only in palette. Format:

```
A — "Almanac": tide data set as a printed almanac; the hero is today's tide curve drawn large.
B — "Harbor board": a departures-board grid of ports; type is the interface.
C — "Logbook": a single scrolling column of entries, handwritten-weight accents.
Recommend A because the curve is the product's unique asset.
```

## 4. Token plan

```
Colors (4–6, named by role):
  ink      #1E2328  body text
  paper    #F3F6F7  background
  tide     #0E6E7E  accent, links, signature curve
  foam     #CFE3E6  surfaces, rules
  buoy     #D9480F  single alert/highlight, used sparingly
Type:
  display  "Fraunces" 600, opsz high — headings only, max 2 sizes on a page
  body     "Source Serif 4" 400/600 — 17px, line-height 1.6
  utility  "IBM Plex Mono" 500 — figures, timestamps, labels
  scale    1.25 ratio from 17px
Spacing: 4px base; section rhythm 96/64/40
Radius: 2px everywhere except pills for tags; no shadows, rules instead
Layout: asymmetric two-column; curve bleeds off the right edge
  +----------------------+--------+
  | H1 + today's tide    | curve->|
  +----------------------+--------+
Signature: the live tide curve, drawn as the page's main graphic
```

## 5. Challenge the plan

For each line ask: would this appear on any similar page? If yes, change it and record why. Then compare against R04 (the three default looks) and R01/R02 in `checks.md`. Finally confirm the token pairs pass contrast with `scripts/tokens-check.mjs`.

## When the brief or DESIGN.md already decides

Follow it exactly, even if it matches a default look. Skip directions; still write the token plan as a restatement so the build derives from it.
