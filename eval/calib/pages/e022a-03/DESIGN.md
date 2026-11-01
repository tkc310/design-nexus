# DESIGN.md

## Subject

- Subject: payroll SaaS for small clinics (15–40 staff): one screen per pay month, from attendance approval to payroll confirmation.
- Audience: the clinic's office manager (事務長) or the director, who runs payroll between reception and claims work, knows every staff member by name, and fears paying someone the wrong amount or missing the bank-transfer deadline.
- Job of the main surface: get this month's payroll confirmed (approve what is pending, then 確定).
- Surface type: product

## Direction

「明細の欄」 (payslip fields). The Japanese 給与明細書 is a ruled form with tinted column groups: 支給, 控除, and a boxed 差引支給額. The dashboard borrows that form literally. The signature is the **明細帯** (payslip band): a strip at the top that reads 支給合計 − 控除合計 = 差引支給額 in the form's tinted fields, with 前月比 next to the total. The unit is the field: a tinted tab label over a figure. The same fields head the staff table's column groups, become the label cells of each staff card at phone width, and summarize the payroll again in the confirmation dialog.

## Tokens

```tokens
color.bg: #EDEFEC
color.surface: #FFFFFF
color.text: #1B2420
color.muted: #535E58
color.accent: #2C6A4C
color.on-accent: #FFFFFF
color.accent-tint: #E2EEE6
color.border: #848F89
color.hairline: #D3D8D4
color.warn: #8A5300
color.warn-bg: #FBEFD5
color.danger: #B3261E
font.display: "BIZ UDPMincho", serif
font.body: "BIZ UDPGothic", sans-serif
font.utility: "IBM Plex Sans", sans-serif
type.base: 16px
type.ratio: 1.25
space.base: 4px
radius.default: 6px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/bg, accent/surface, text/accent-tint, warn/warn-bg, danger/surface, border/surface
```

Roles and sources:

- `surface` #FFFFFF: the payslip sheet itself (white form stock).
- `bg` #EDEFEC: the desk tray; neutral gray, tinted a few points toward the accent. Also the 控除 band tint (deductions are printed on the untinted part of the form).
- `text` #1B2420: form ink, a green-black.
- `accent` #2C6A4C: the green ruling of a printed payslip form. Used for the 支給 band, the one primary button, selection, and focus.
  - Candidates: form-ruling green (hue ~150), 朱肉 vermilion of the approval seal (hue ~10), bank-transfer-slip navy (hue ~220). Green won because the bands are the form's own ruling and green has no status meaning on this screen. Vermilion would collide with errors and with negative figures; navy is the generic SaaS blue and says nothing about payroll.
- `accent-tint` #E2EEE6: the tinted 支給 field.
- `warn` / `warn-bg`: pending approvals and large month-on-month changes (status only).
- `danger`: a failed timecard import (status only).

Type:

- Display: BIZ UDPMincho 700, page title and dialog title only (the printed heading of a 給与明細書 is set in mincho). Candidates: BIZ UDPMincho (serif, printed form heading), Zen Maru Gothic (rounded, clinic signage), Barlow Condensed (condensed, LED queue board). Chose the form heading.
- Body: BIZ UDPGothic 400/700, the universal-design gothic made for business forms; 16px, line-height 1.7.
- Utility: IBM Plex Sans 500/600 for every figure, tabular numerals, listed before the Japanese face.
- Scale: 13 (one-word tags only), 14, 16, 20, 25, 31.
- Loading: Google Fonts CSS2 (unicode-range slices), `display=swap`.

Spacing: 4px base; 8 inside groups, 16 between rows of a panel, 24 between panels.
Shape: 6px panel radius, 4px controls; panels separated by 1px hairline borders, no shadows except the dialog and toast (they float above the page).

## Patterns

- Buttons: one solid green primary per state. While approvals are pending, 「勤怠を承認する」 is primary and 「給与を確定する」 is an outlined button that explains what blocks it. When nothing blocks, 「給与を確定する」 becomes primary.
- Inputs and forms: label above, 1px `border` (3.3:1 on white), 4px radius, green 2px focus ring with 2px offset.
- Cards / panels: white sheet, 1px hairline, 6px radius.
- Tables: two-row sticky header; the upper row is the payslip band (支給 green tint, 控除 gray, 差引支給額 ink). Numbers right-aligned in Plex tabular. Below 640px each row is a card whose cells carry their band label.
- Navigation: top bar with product name, clinic name, and page links; current page underlined in green.
- Motion: the skeleton opacity pulse (off under reduced motion), a 120ms button press, and a 160ms toast fade.

## Page overrides

None.

## Looks used

- Payroll dashboard (2026-11): light, neutral gray ground with form-green accent (hue ~150), mincho display + UD gothic body + Plex figures, flat tinted bands on white sheets.

## Learnings

- 2026-11: Rejected a dark "reception number board" direction (LED counters for days left and pending count): striking, but the office manager reads these figures next to printed payslips and bank forms, and a dark screen would sit apart from them.
- 2026-11: Rejected a "clinic calendar" direction (the reception calendar with closed days circled) as the lead: the deadline matters, but the money is what the manager checks.
- 2026-11: Rejected vermilion (approval seal) as the accent: it reads as error next to payroll figures.
