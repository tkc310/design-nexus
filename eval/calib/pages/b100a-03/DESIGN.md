# DESIGN.md

## Subject

- Subject: Payroll SaaS for small clinics (15–40 staff): the monthly "今月の給与" screen.
- Audience: the clinic's office manager (事務長), who runs payroll once a month alongside reception work, is not a payroll specialist, and is afraid of missing the bank deadline or paying someone wrongly.
- Job of the main surface: get this month's pay **finalized** (確定) before the deadline, by first clearing the attendance approvals that block it.
- Surface type: product

## Direction

"押印欄" (the seal boxes). Japanese clinic offices still sign off attendance and payroll by stamping a red seal into ruled boxes. The screen borrows that directly: every staff member is a seal slot carrying their surname. An approved slot is stamped in 朱肉 (shuniku seal ink), a pending one is a dashed empty ring, and a failed import is a dashed ring in the error colour. Finalizing stamps a three-tier date seal (データ印: 給与 / date / 確定). The signature is the approval board (the countdown, a row of 18 seals, the finalize seal slot, and the pay date). The same seal unit is the first column of the ledger table and the marker in the request list.

## Tokens

```tokens
color.bg: #F2F2F0
color.surface: #FFFFFF
color.text: #1D2125
color.muted: #575D63
color.accent: #B8341B
color.on-accent: #FFFFFF
color.border: #868B90
color.danger: #A01E3C
color.rule: #D5D6D7
color.accent-wash: #FBEEEA
font.display: "Zen Maru Gothic", sans-serif
font.body: "BIZ UDPGothic", sans-serif
font.utility: "IBM Plex Sans", sans-serif
type.base: 16px
type.ratio: 1.2
space.base: 4px
radius.default: 6px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/bg, accent/surface, danger/surface
```

## Patterns

- Buttons: 44px high, 6px radius, bold label, no wrapping. Only one filled vermilion button at a time: "勤怠を承認する" while approvals are pending, then "給与を確定する" once nothing blocks it. A blocked action stays in place with a dashed outline, `aria-disabled`, and the reason written beside it.
- Inputs and forms: label above the field, 1.5px #868B90 border, focus is a 3px ink outline.
- Cards / panels: white paper on the wall-grey ground, 8px radius, a soft two-layer shadow (paper on a desk). Hairlines (#D5D6D7) only divide cells inside a panel.
- Tables: sticky header with a 1.5px ink rule, sortable headers with arrows and `aria-sort`, rows that need attention float to the top on a seal-ink wash, figures in IBM Plex Sans with tabular numerals and right alignment. Below 640px each row becomes a block: seal, name and net pay on top, then four labelled figures.
- Seals: 40px (board) or 34px (table) ring with a vertical surname, tilted by a few degrees each, as a hand stamp would be. Stamping animates once (scale 1.25 to 1 plus a fade, 260ms ease-out), and only fades under reduced motion.
- Navigation: a sidebar at 1000px and wider, a top bar with a "メニュー" disclosure below that.
- Motion: stamp, dialog entry (220ms), skeleton pulse. All of it is reduced to fades under `prefers-reduced-motion`.

## Page overrides

- `index.html` — at 1600px and wider, a right rail lists the pending requests next to the ledger — so wide screens use the space for the task instead of stretching the table.

## Looks used

- index.html (payroll dashboard): light; near-neutral grey ground (#F2F2F0) with vermilion seal-ink accent (hue ~10°); rounded display (Zen Maru Gothic) + UD gothic body + grotesk figures; white paper panels with real soft elevation.

## Learnings

- 2026-11-01: Rejected "賃金台帳" (a full-bleed ruled ledger with flat hairlines and mono figures) because it lands on the agent house look. Rejected "受付の呼出表示" (a dark board with LED numerals) because it turns a careful daytime money task into an alarm board.
- 2026-11-01: The 給与 deadline and the 勤怠 period end are different dates. The countdown runs to the payroll deadline (11/20), and the attendance period ended 11/15. Keep them labelled apart.
- 2026-11-01: The totals equation must sum only the rows it can compute. Excluding the failed row from the deductions but not from base pay broke the arithmetic.
