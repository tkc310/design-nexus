# DESIGN.md

## Subject

- Subject: 小規模クリニック(スタッフ15〜40名)向け給与計算SaaS「給与ノート」
- Audience: 事務長・院長。経理の専門家ではなく、診療の合間に月1回の給与業務をこなす。締め日の見落としと支給額の誤りを恐れている。
- Job of the main surface: 今月の給与を締め日までに確定する(勤怠の承認 → 給与の確定)。
- Surface type: product

## Direction

「検印欄」。日本の事務書類にある押印欄と、承認印(認印)・データ印を借りる。勤怠を承認したスタッフの行には朱の認印が押され、月の工程(締め日・勤怠承認・給与確定・支給日)は稟議書の押印欄のような罫線の箱に並ぶ。給与確定はデータ印(上段「確定」・中段日付・下段氏名)で押される。紙は白い明細用紙、台紙はほぼ無彩色、一覧の縞は給与計算の印字に使われた連続帳票(グリーンバー用紙)の緑。シグネチャーは押印欄の単位(罫線の箱+朱の印)で、工程の箱・一覧の勤怠列・承認状況の小さな印の並び・確定ダイアログで再利用する。

## Tokens

```tokens
color.bg: #F1F2F2
color.surface: #FFFFFF
color.text: #1F2427
color.muted: #555C61
color.accent: #B3301C
color.on-accent: #FFFFFF
color.accent-tint: #FBEEEB
color.band: #EDF4EE
color.border: #D3D8DA
color.field-border: #737B80
font.display: "Shippori Mincho B1", serif
font.body: "BIZ UDPGothic", sans-serif
font.utility: "BIZ UDGothic", monospace
type.base: 15px
type.ratio: 1.25
space.base: 4px
radius.default: 6px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/bg, accent/surface, text/band, muted/band, field-border/surface, accent/accent-tint, text/accent-tint
```

- 墨 `#1F2427` — 本文。明細の印字の黒。
- 薄墨 `#555C61` — 補足(15px以上のみ)。
- 台紙 `#F1F2F2` — 画面の地。机上の書類トレイのような無彩色。
- 明細用紙 `#FFFFFF` — パネル。
- 朱肉 `#B3301C` — 承認印・確定印と、押印に当たる主要アクション。エラー見出しにも使うが必ずアイコンと文章を伴う。
- 帳票グリーン `#EDF4EE` — 一覧の縞。連続帳票のグリーンバー。
- 罫 `#D3D8DA` — 区切り線。入力欄の枠は `#737B80`(3:1以上)。

## Patterns

- Buttons: 塗りの朱は画面に1つだけ(次に押すべき工程)。使えない主要アクションは位置を保ったまま無効表示し、理由を横に書く。押下で scale(0.97)。
- Inputs and forms: ラベルは上、枠は field 色、フォーカスは墨の2pxアウトライン+2pxオフセット。
- Cards / panels: 白い紙+1px罫+ごく薄い影(紙が台紙に載っている程度)。角丸6px、ボタン4px、印は円。
- Tables: 帳票グリーンの縞、行40px以上、数値は BIZ UDGothic の等幅数字で右揃え。640px未満では各行をラベル付きブロックに組み替え、差引支給額を上に。
- Navigation: 1024px以上は左サイドバー、未満は上部バー+メニューボタン。
- Motion: 押印のときだけ。scale(1.25)→1 と不透明度、220ms ease-out。reduced-motion では不透明度のみ。読み込み中のスケルトンは reduced-motion で静止。

## Page overrides

なし。

## Looks used

- 今月の給与ダッシュボード — light、無彩色の地+朱(約8°)の印、明朝ディスプレイ(印・見出し)+UDゴシック本文、白い紙の罫線パネル+ごく薄い影。

## Learnings

- 2026-11-01: 前月比を赤/緑で塗る案は不採用。人件費の増加は悪ではなく、朱を「押印=確定」の意味に限定するため、増減は符号(+/−)で示す。
- 2026-11-01: 1920px で一覧が間延びするため、工程と合計を左列に縦積みし、一覧を右に置く2列構成にした。
