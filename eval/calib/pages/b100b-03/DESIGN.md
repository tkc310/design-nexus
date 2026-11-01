# DESIGN.md

## Subject

- Subject: payroll SaaS for small clinics (15–40 staff), the monthly "今月の給与" screen.
- Audience: the clinic's office manager (事務長) or director, who runs payroll once a month after clinic hours, is not a payroll specialist, and fears a wrong transfer or a missed bank deadline.
- Job of the main surface: get this month's payroll confirmed (確定) before the transfer deadline; approving attendance is the step that unblocks it.
- Surface type: product

## Direction

"給与明細書" — the screen is built like the Japanese payslip form it produces. Its unit is the 欄: a ruled box with a small label in the top-left corner and the figure set bottom-right, as on a printed 給与支払明細書. The month summary is one clinic-wide payslip sheet (確定期限・未承認・支給合計 − 控除合計 = 差引支給合計) ending in a 印 box whose dashed vermilion ring marks where the seal still has to go; when payroll is confirmed a vermilion 確定 seal is stamped into it. The staff table is ruled with the pale green bands of continuous payslip form paper, and on narrow screens each staff row becomes its own small payslip of 欄. Signature: the clinic-wide payslip sheet with its 確定 seal box.

## Tokens

```tokens
color.bg: #F4F4F1
color.surface: #FFFFFF
color.text: #1A2320
color.muted: #4F5A55
color.accent: #1D6A4A
color.on-accent: #FFFFFF
color.border: #6E7A74
color.danger: #B3361F
color.band: #E6F0E9
color.rule: #C3CCC7
font.display: "Zen Old Mincho", serif
font.body: "BIZ UDPGothic", sans-serif
font.utility: "IBM Plex Sans", sans-serif
type.base: 16px
type.ratio: 1.25
space.base: 4px
radius.default: 6px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/bg, accent/surface, danger/surface, text/band, border/surface
```

- `accent` (帳票グリーン): the green of the printed rules on payslip form stock. Primary action, focus ring, selected month.
- `danger` (朱): the vermilion of a 朱肉 seal. Used only where a seal is applied or still needed: the 確定 seal, the 未承認 count, 申請中 tags, errors.
- `band`: the pale stripe of continuous form paper. Table row bands and the label strip of each 欄.
- `rule`: hairlines between 欄 (decorative only; never the only boundary of a control).
- `border`: field and control outlines (≥3:1 on surface).

## Patterns

- Buttons: 6px radius, 44px min height, `white-space: nowrap`. One filled (accent) button per view: the step that unblocks payroll. A blocked primary action stays in place, disabled, with the reason beside it.
- Inputs and forms: label above, 1px `border` outline, accent focus ring 3px.
- Cards / panels: "sheets" — white surface, 6px radius, one soft paper shadow. Inside a sheet, 欄 are separated by `rule` hairlines with no radius.
- Tables: green-bar banding on every other row, sticky header, sortable headers are buttons with `aria-sort`, figures right-aligned in IBM Plex Sans tabular. Below 900px each row becomes a payslip block of 欄 with 差引支給額 top-right (two blocks per row from 721–900px, one below).
- Navigation: top bar with the clinic name and current section marked `aria-current`.
- Motion: one orchestrated moment — the 確定 seal stamps in (scale 1.12→1, 220ms ease-out). Otherwise only functional motion: dialogs rise in 200ms, toasts fade, skeletons pulse, buttons press to 0.97. Reduced motion: all of it becomes instant (the seal appears already stamped), skeletons stop pulsing.

## Page overrides

None.

## Looks used

- 今月の給与 dashboard: light, warm-neutral form-paper ground, form-green accent (~155°) with vermilion seal (~10°), mincho display + UD gothic body + grotesk figures, ruled 欄 inside soft-shadowed sheets.

## Learnings

- 2026-11-01: rejected a dark "after-hours office" console (the subject is a document people sign off, not a monitoring tool) and a calendar-led countdown (a generic deadline widget; the payslip form is what only payroll owns). Rejected vermilion as the button color: it is the seal's meaning, and red on a clinic's primary button reads as danger.
- 2026-11-01 (shipped): removed the row-hover accent bar on the staff table as the least necessary decoration. A blocked 給与を確定する stays in place with a dashed outline and the reason under it; 勤怠を承認する carries the fill until every request is approved, then the fill moves to 確定.
