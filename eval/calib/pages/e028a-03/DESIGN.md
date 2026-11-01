# DESIGN.md

## Subject

- Subject: payroll SaaS for small clinics (15–40 staff); the monthly 「今月の給与」 screen.
- Audience: the clinic's office manager (事務長) or director, doing payroll after clinic hours, not a payroll specialist; fears paying someone the wrong amount and missing the cut-off.
- Job of the main surface: close this month's payroll — clear pending attendance requests, then confirm (確定).
- Surface type: product

## Direction

「押印欄」: the payroll month is shown as the row of stamp boxes from a Japanese approval form (稟議書の押印欄). Each completed step receives a vermilion 日付印 (date stamp: label / date / name); the step that is stuck has a JIS-yellow header band; future steps show a dashed empty seal slot. The first box is a tear-off-calendar countdown to the 締め日. The same two-tier ruled cell (label band over content) builds the totals strip, the confirm dialog summary and the staff cards on narrow screens.

## Tokens

```tokens
color.bg: #F1F2F2
color.surface: #FFFFFF
color.text: #1F2326
color.muted: #565D63
color.accent: #B5381C
color.on-accent: #FFFFFF
color.border: #7B838A
color.rule: #D3D7DA
color.caution: #F2C230
color.caution-tint: #FDF3CF
font.display: "Shippori Mincho B1", serif
font.body: "BIZ UDPGothic", sans-serif
font.utility: "IBM Plex Sans Condensed", sans-serif
type.base: 16px
type.ratio: 1.25
space.base: 4px
radius.default: 6px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/surface, text/caution, text/caution-tint, border/surface
```

## Patterns

- Buttons: 44px high, 6px radius. One filled 朱 button per view: the step that unblocks payroll (承認 → 打刻再取得 → 確定). A blocked 「給与を確定する」 stays in place, dashed and disabled, with the reason beside it (aria-describedby).
- Inputs and forms: label above (14px bold), 1px #7B838A border, 40px high.
- Cards / panels: white sheet, 8px radius, soft two-layer shadow. Inside, data sits in two-tier ruled cells (1px #D3D7DA gaps, #F1F2F2 label band).
- Tables: figures in IBM Plex Sans Condensed tabular, no currency symbol in cells (as on a 給与明細); sticky header; sortable headers with aria-sort. When the staff panel is narrower than 780px (container query) each row becomes a mini payslip of ruled cells with 差引支給額 first, two cards per row where they fit. Unit shown once as 「金額の単位:円」, as on printed Japanese reports.
- Navigation: left sidebar ≥1024px, top bar with a 「メニュー」 disclosure below.
- Motion: only the stamp press (260ms ease-out, scale 1.3 → 1) when a step completes, dialog rise, toast. All removed under reduced motion.
- Status: 朱 = approved / the stamping action; JIS yellow = needs attention (pending band, 承認待ち tag); yellow/ink hazard stripe = data failure (打刻未取込, load error). No red error color, so a red stamp never reads as an error.

## Page overrides

## Looks used

- light / neutral clinic-wall ground #F1F2F2, accent vermilion stamp ink (hue ≈ 11°) + JIS yellow status / UD gothic body with mincho stamp lettering and condensed grotesk figures / white sheets with soft elevation and ruled two-tier cells.

## Learnings

- 2026-11-01: Rejected a 給与明細-ledger direction (pale paper, mincho, hairlines) because it lands on the agent house look; rejected a dark 当直明け direction because a payroll owner reads exact figures for a long stretch and dark ground made the stamp ink muddy.
- 2026-11-01: A payslip-style group band (支給 / 控除 / 差引) above the column headers was dropped: it vanished in the card layout (R18) and the unit note carries the only information it added.
- 2026-11-01: Removed the ink underline on the 差引支給額 total cell as the one accessory; weight already marks it.
- 2026-11-01: Keeping errors off red was necessary once the stamp ink is vermilion; JIS yellow/black stripes carry failure instead.
