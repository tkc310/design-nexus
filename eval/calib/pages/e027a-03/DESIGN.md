# DESIGN.md

## Subject

- Subject: 小規模クリニック(スタッフ15〜40名)向けの給与計算SaaS。
- Audience: 院長や事務長。経理の専門家ではなく、月に一度、診療の合間に給与を締める。間違った額を払うことと、締め日を過ぎることを恐れている。
- Job of the main surface: 今月の給与を確定する(その前に勤怠申請を承認する)。
- Surface type: product

## Direction

Source object: スタッフ通用口のラックに差してある紙のタイムカード(タイムレコーダーが2色リボンで打刻する月次カード)。クリニックの給与は実際にここから始まる。Usual look of payroll dashboards: white ground, Inter/Noto Sans, blue primary, a row of KPI cards (big number + small label), a zebra table on rounded shadowed cards. This page departs on ground value (mid-tone rack steel instead of white), display genre (dot-matrix lettering from the recorder's printed digits), and the main data mark (a pay-period day strip whose days are punched in ink, with irregular days punched in the recorder's red). Properties borrowed: the recorder's dot-matrix digits → display face for the title and the three key figures; the two-color ribbon (normal ink / red for irregular) → normal vs. unapproved days and rows; the card's single-ink green ruling → table and strip ruling; the card stock → the main surface; the steel rack → the page ground; the card's one-line-per-day habit → the strip, the table rows, the approval list and the skeleton. Words kept out of the copy: タイムカード, 打刻, リボン, ラック, 差し込む, パンチ.

Signature: 締め日カウントダウンを兼ねた「支給対象期間の日付帯」。期間の31日を1日1マスの罫線で並べ、経過した日は通常インクの点線、未承認の申請がある日は赤インクで印字され、今日は太枠、締め日までの残りの日は淡い罫色で塗られ、締め日は二重罫で閉じる。同じ「1日1行の罫線」単位をスタッフ表、承認リスト、読み込み中の骨組みが再利用する。

## Tokens

```tokens
color.bg: #CDD1CC
color.surface: #F4EFE2
color.text: #27222F
color.muted: #5C5566
color.accent: #2E6A4B
color.on-accent: #F4EFE2
color.border: #6E8777
color.danger: #B0232E
font.display: "DotGothic16", monospace
font.body: "BIZ UDPGothic", sans-serif
font.utility: "BIZ UDGothic", monospace
type.base: 16px
type.ratio: 1.25
space.base: 4px
radius.default: 4px
pairs: text/bg, muted/surface, text/surface, on-accent/accent, accent/surface, danger/surface, border/surface
```

- bg 台枠 — rack steel; surface カード — card stock; text 墨 — the recorder's black-violet ribbon ink; muted — the same ink, faded; accent 罫 — the card's printed green ruling ink, used for actions and (at low strength) ruling; danger 朱 — the recorder's red ribbon for irregular entries (unapproved requests, errors); border — the ruling ink at field strength.

## Patterns

- Buttons: filled = accent green on card stock, one per view (the step that unblocks the month). Outlined = 2px ink border. Disabled keeps its place with the reason beside it. Press: scale(0.97).
- Inputs and forms: label above, 2px border in `border` (≥3:1 on surface).
- Cards / panels: one card-stock surface on the steel ground, 6px corners (card corners), one soft shadow (the card standing out of the rack). Nothing else is elevated.
- Tables: one ruled line per row in green ruling ink, figures in BIZ UDGothic tabular, right-aligned; at 800px and below each row becomes a labelled block (name + 差引支給額 on top, the other four figures in a row of four), and the header row becomes a wrapping row of sort buttons.
- Navigation: top bar on the steel ground, current page underlined in ink.
- Motion: only the dialog fade and button press; none under reduced motion except opacity.

## Page overrides

## Looks used

- 2026-11 今月の給与: light-mid (steel ground #CDD1CC, card stock surface), ground hue grey-green, accent green 150° + red ribbon 355°, dot-matrix display + UD gothic body, one elevated card with printed ruling.

## Learnings

- 2026-11: Rejected the pay-envelope direction (kraft + vermilion stamp + mincho) because it lands on R04a; rejected the waiting-room LED number board (dark, amber 7-segment) because it reads as a patient-facing screen, not an office tool.
