# DESIGN.md

## Subject

- Subject: 小規模クリニック(スタッフ15〜40名)向け給与計算SaaS
- Audience: 事務長・院長。毎月の締め前に勤怠を承認し、給与を確定する人。経理の専門家ではなく、締め日を落とすことと計算ミスを恐れている。
- Job of the main surface: 締め日までに勤怠を承認し、今月の給与を確定する。
- Surface type: product

## Direction

「勤務表の帯」。クリニックの勤務表(シフト表)の日付マスを給与サイクルの単位にする。勤怠期間の初日から締め日、支給日までを1マス1日で並べ、今日・休診日・締め後の処理期間・未承認の申請がある日を同じマスに描く(シグネチャ)。同じマスが未承認申請の日付チップと、差引支給額の推移セルにも使われる。アクセントは承認印の朱肉。承認・確定は丸い朱の印として残る。

## Tokens

```tokens
color.bg: #F2F3F3
color.surface: #FFFFFF
color.text: #1F2429
color.muted: #555C63
color.accent: #B0371C
color.border: #80878E
color.danger: #A1132B
color.accent-deep: #8F2C16
color.rule: #D3D7DA
color.danger-wash: #FCEBEC
font.display: "BIZ UDPGothic", sans-serif
font.body: "Zen Kaku Gothic New", sans-serif
font.utility: "IBM Plex Sans", sans-serif
type.base: 16px
type.ratio: 1.25
space.base: 4px
radius.default: 4px
pairs: text/bg, muted/bg, text/surface, muted/surface, surface/accent, accent/surface, danger/surface
```

CSS names: `--paper` (bg), `--sheet` (surface), `--ink` (text), `--pencil` (muted), `--shuin` (accent), `--shuin-deep` (accent-deep, hover and the 未承認 note), `--rule` (hairlines), `--field` (border of fields and secondary buttons), `--alarm` (danger), `--alarm-wash` (danger-wash).

Type sizes: 14 / 16 / 20 / 25 / 39px. Display face only for headings, the clinic name, the seal, and the big figures (あと7日, 未承認件数, 差引支給額の合計).

## Patterns

- Buttons: 44px high, 4px radius. Primary = 朱 fill, one per view. The primary moves from 「勤怠を承認する」 to 「給与を確定する」 when no request is pending. Press: scale(0.97), 120ms.
- Inputs and forms: label above, 1px `--field` border, 40px high.
- Cards / panels: white sheet, 1px `--rule` border, 8px radius, no shadow. Shadows only on dialogs and the toast.
- Day cell (signature unit): 4px radius, 1px `--rule` border. past = paper fill, closed = diagonal hatching, after close = dashed, today = ink fill, 締め = 2px ink border, 支給 = 2px 朱 border, pending = 朱 dot. 36 cells in one row at 1260px and up, a 7-column calendar below.
- Seal: 44px 朱 ring rotated −8°, used for 承認 (queue rows) and 確定 (page title).
- Tables: sticky header, figures right aligned in IBM Plex Sans with tabular-nums, 差引支給額・残業代・前月比 sortable. Stacked label/value rows below 900px.
- Navigation: top bar with the clinic name, current page underlined in ink. Not sticky.
- Motion: stamp 260ms ease-out, dialog rise 220ms, toast fade 200ms, skeleton pulse. Under reduced motion, only opacity fades remain.

## Page overrides

## Looks used

- light (true neutral paper #F2F3F3), vermilion seal accent (hue ≈ 11°), Japanese UD gothic display + gothic body + grotesk figures, flat hairline panels with a day-cell grid — 今月の給与 dashboard.

## Learnings

- 2026-10-31: Rejected a truncated-axis bar chart for the 6-month trend (it exaggerated a ±2% change); replaced with value cells showing amount and month-over-month change.
- 2026-10-31: The headline 前月比 is like for like (staff paid both months, computed this month) so it equals the sum of the table's 前月比 column; a new hire and a staff member with missing attendance are excluded and noted.
- 2026-10-31: Rejected a teal "scrubs" accent (house look R04d) and a kraft-envelope mid-tone ground (read as retail, hurt table legibility).
