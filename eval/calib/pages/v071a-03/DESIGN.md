# DESIGN.md

## Subject

- Subject: こよみ給与 — 小規模クリニック（スタッフ15〜40名）向け給与計算SaaS。
- Audience: 院長の代わりに給与を回す事務長・医療事務。毎月の締めに追われ、計算ミスと振込遅れを恐れている。会計の専門家ではない。
- Job of the main surface: 締め日までに勤怠を承認し、給与を確定する（verb: 確定する）。
- Surface type: product

## Direction

「勤務表の暦」。クリニックの誰もが毎月見ている勤務表のマス（曜日＋日付の縦長セル）を単位にする。ダッシュボードの先頭は、勤怠期間の初日から支給日までを1マスずつ並べた暦ストリップで、今日・締め日・支給日と、未承認の申請がある日を直接ラベルで示す（signature）。同じマスは承認待ちリストの各申請、取り込みエラー行の対象日、確定ダイアログの締め日・支給日にも使う。スタッフ別の表は給与台帳の連続帳票（グリーンバー）の帯を下地にする。

## Tokens

```tokens
color.bg: #F4F5F3
color.surface: #FFFFFF
color.text: #1B2420
color.muted: #545E59
color.accent: #17694A
color.on-accent: #FFFFFF
color.border: #D3D9D5
color.danger: #B03A25
color.band: #EAF2EC
color.danger-wash: #FBECE8
color.closed: #E6E9E7
font.display: "BIZ UDPGothic", sans-serif
font.body: "Zen Kaku Gothic New", sans-serif
font.utility: "IBM Plex Sans", sans-serif
type.base: 16px
type.ratio: 1.25
space.base: 4px
radius.default: 6px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/bg, danger/surface, danger/danger-wash, text/band, text/closed
```

Color sources: bg = 診察室の壁と白衣のニュートラル; surface = 帳票の白; text = 墨; accent = 給与台帳の連続帳票（グリーンバー）の罫の緑; band = グリーンバーの帯; danger = 朱肉（承認印が必要なもの＝未承認・エラー）; closed = 休診日のマス。

## Patterns

- Buttons: 主ボタンは accent 地に白文字（hover/押下は color-mix で accent を墨へ22%寄せた色）、高さ40px、radius 6px。副ボタンは白地に罫線。押下で scale(0.97)。ラベルは動詞（「承認する」「給与を確定する」）。トーストは同じ動詞の過去形（「承認しました」「確定しました」）。
- Inputs and forms: ラベルは上、高さ40px、罫線1px、フォーカスで accent の2px outline。
- Cards / panels: 白地＋1px 罫線、radius 6px、影なし。影はダイアログとトーストだけ。
- Tables: 数字は右揃え・tabular-nums・nowrap。2行おきにグリーンバーの帯。ヘッダーは sticky（狭幅では横スクロール＋氏名列 sticky）。並べ替えは th 内ボタン＋aria-sort。
- Day cell（暦のマス）: 曜日（上）＋日付（下）、幅28〜44px。休診日は closed 地。締め日は accent 塗り、支給日は accent 罫、今日は墨の2px罫、未承認ありは朱肉の件数バッジ。
- Navigation: 上部バー、現在地は aria-current と下線。
- Motion: 承認した申請の退出（opacity 160ms）、スケルトンのゆるい明滅、トーストの出入りのみ。prefers-reduced-motion では明滅と移動を止める。

## Page overrides

なし。

## Looks used

- index.html（今月の給与）— light、ground は無彩色寄りの白（緑わずか）、accent は帳票グリーン（hue ≈155°）＋朱肉、UDゴシック＋ゴシック本文＋Plex Sans数字、フラットな罫線＋グリーンバーの帯、radius 6px。

## Learnings

- 2026-10-31: 待合室の呼出表示（暗地＋アンバーLED）方向は却下。毎日長時間見る管理画面には強すぎ、アンバーが警告色と衝突する。
- 2026-10-31: 朱肉の朱をブランドの主色にする案は却下。主ボタンが赤だと「取り消し・削除」に読める。朱は「あなたの印が要るもの」（未承認・エラー）に限定した。
- 2026-10-31: 暦ストリップの凡例から「今日」を削除。マスの下に「今日」と直接書いてあるため重複していた。
- 2026-10-31: 1fr のグリッドに min-width: max-content を付けると、最も広いラベル（締め日）に全列が揃って横スクロールが出た。列数×最小幅で min-width を決める。
