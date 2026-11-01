# DESIGN.md

## Subject

- Subject: payroll SaaS for small clinics (15–40 staff); the "今月の給与" screen for the current pay period.
- Audience: the clinic's office manager (事務長) or the director, who runs payroll between reception and insurance-claim work. Not an accountant. Fears paying someone wrong and missing the cutoff.
- Job of the main surface: get this month's pay confirmed before the cutoff — clear the attendance approvals that block it, then confirm.
- Surface type: product

## Direction

"Card rack": the source object is the punch-clock time card and the steel rack it lives in by the staff entrance (the paper card with a printed day column, numbers printed by a dot-matrix head in purple ribbon for normal entries and red for irregular ones). The usual look of payroll dashboards is a white or pale-gray ground, a grotesk UI face, a row of KPI cards with big numbers, a blue primary button and a striped table. This page departs on ground value (mid-tone steel-rack gray), display genre (dot-matrix figures), the main data mark (the pay period drawn as the card's day column, printed or blank day by day) and surface (card-stock panels that sit on the rack with real elevation). Borrowed properties: the dot-matrix print → display face for the title, the countdown and dates/times; purple vs red print → violet means recorded/approved and is the action color, red means "needs approval" and nothing else; the card's printed ruling and boxed header row → table and ledger ruling; the card's habit of listing every day of the period → the signature strip, which the approvals list and the staff table both point back to (red marks on the days that still have requests). Words kept out of the copy: タイムカード, カード, ラック, 打刻, リボン, インク, パンチ, 印字. Signature: the cutoff strip — every day of the pay period as one printed cell, past days printed in violet, today solid, remaining days blank, the cutoff day boxed in red, red marks under days with unapproved requests.

## Tokens

```tokens
color.bg: #A9B2AC
color.surface: #F6F2E6
color.sunken: #E9E2D0
color.text: #221E2C
color.muted: #5B5566
color.accent: #4A2D80
color.on-accent: #F6F2E6
color.danger: #A3241B
color.border: #7A7364
color.rule: #CEC5AF
font.display: "DotGothic16", monospace
font.body: "BIZ UDPGothic", sans-serif
type.base: 16px
type.ratio: 1.25
space.base: 4px
radius.default: 6px
pairs: text/bg, text/surface, muted/surface, text/sunken, muted/sunken, on-accent/accent, accent/bg, accent/surface, danger/surface, border/surface
```

## Patterns

- Buttons: filled violet for the one action that can be taken now (approve while requests remain, confirm after); outline violet for secondary; quiet outline (field-colored border, ink text) for row-level actions such as 差し戻す; filled red only inside the reject confirmation dialog. 44px high in the header, 36px in rows. Disabled keeps its place and shows the reason beside it.
- Inputs and forms: label above, 1px `border` (#7A7364) box on card stock, 2px violet focus ring.
- Cards / panels: card-stock surface on the rack ground, 6px radius, a short drop shadow (they sit in front of the rack), a printed header row with a double rule.
- Tables: printed ruling (`rule`), double rule under the header, sticky header, sortable headers as buttons with aria-sort, figures right-aligned in tabular numerals. Below 640px each row becomes a labelled block with net pay first.
- Navigation: top bar on the rack ground; current page marked with a violet underline and aria-current.
- Narrow screens (<640px): a one-line bar fixed at the bottom repeats the step that can be taken now (approve, then confirm) while its own button is scrolled away; body reserves 64px for it.
- Motion: only press feedback (scale .97) and opacity fades for approved rows and the toast; under reduced motion only the opacity fades remain.

## Page overrides

None.

## Looks used

- 2026-11 今月の給与: mid-tone, ground green-gray (steel rack) with card-stock panels, accent violet + red status, dot-matrix display over UD gothic body, card panels with real elevation.

## Learnings

- 2026-11: "締め日" is read as the payroll confirmation deadline (末締め・翌月25日払い), so confirming before it is coherent; the strip runs from the 1st to payday.
- Rejected: a white ledger page with a pay-slip grid (too close to the usual table-on-white look); color-coded chart-folder tabs per job type (spends color on categories the user does not act on).
