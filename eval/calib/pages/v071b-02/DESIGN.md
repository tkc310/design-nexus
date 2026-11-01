# DESIGN.md — 土と灯(つちとひ)

## Subject

- Subject: 京都・五条坂の陶芸工房「土と灯」。職人2名、日常の器(飯碗・湯呑・小皿)と、月2回・各回6名までの手びねり体験教室。
- Audience: 30〜50代の国内外の旅行者。京都滞在中の半日を使いたい。言葉と手順と空き状況が不安。
- Job of the main surface: 体験教室の予約ページへ送る(予約する)。
- Surface type: marketing

## Direction

「席の灯」。生の京都の土(濡れた灰色)を地に、窯の内壁の煤色を一枚だけのパネルに使う。工房名の「灯」を、空いている席の印として灯す。単位は器を裏返したときの **高台(外の縁+内側の高台の輪)**。同じ輪が、教室の空席(1席=1つの高台)、器の実寸比較(飯碗・湯呑・小皿を上から見た輪)、体験の流れ(土の塊→縁→高台→灯)に使われる。見出しは箱書きの筆文字(Yuji Syuku)。

## Tokens

```tokens
color.bg: #BCB5AC
color.surface: #E4E0D8
color.text: #221E1A
color.muted: #463F39
color.accent: #F2A93B
color.on-accent: #221E1A
color.kiln: #2B2622
color.kiln-text: #E4E0D8
color.taken: #9C9389
color.border: #221E1A
font.display: "Yuji Syuku", serif
font.body: "Zen Kaku Gothic New", sans-serif
type.base: 16px
type.ratio: 1.25
space.base: 8px
radius.default: 8px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/kiln, kiln-text/kiln, taken/kiln, border/bg
```

- 生土 `#BCB5AC` ground — 練る前の京都の土(濡れた灰色)。
- 化粧土 `#E4E0D8` surface — 白化粧の土。情報表・写真枠。
- 鉄 `#221E1A` text — 鉄釉の焦げ茶黒。
- 鉄・淡 `#463F39` muted — 15px以上の補足だけ。
- 窯 `#2B2622` kiln — 窯の内壁の煤。教室ボード1枚と主ボタンだけ。
- 灯 `#F2A93B` accent — 工房名の「灯」、窯の覗き穴の火。空席と予約の操作だけに使う。
- 焼締 `#9C9389` taken — 予約済みの席(すでに誰かの土が置かれている)。

## Patterns

- Buttons: 主ボタン=窯色地に灯色の文字(小さな窯)。窯パネル上では灯色地に鉄色文字。radius 8px、高さ48px以上、`:active` scale(0.97)。
- Inputs and forms: なし(予約は外部の予約ページ)。
- Cards / panels: 窯パネルは1枚だけ(radius 16px)。影なし(空席の灯だけが光る)。写真枠は化粧土+斜線+1px破線、キャプションに「写真(近日掲載)」と撮る内容。
- Tables: 教室の案内は `dl` の2列、320pxで1列に積む。
- Navigation: ロゴ、4リンク、English、予約ボタン。
- Motion: 色と transform のみ、150ms。`prefers-reduced-motion` で transform を外す。

## Page overrides

なし。

## Looks used

- index.html — mid-tone (wet clay grey ground, one dark kiln panel), ground hue warm grey ~35°, accent amber ~36° (lamp), type: brush display + gothic body, surface: flat with one dark panel and circular foot-ring marks.

## Learnings

- 2026-10-31: クリーム地+明朝+テラコッタ(R04a)は陶芸サイトの既定の見た目なので不採用。地は生土の灰色、文字は筆。
- 2026-10-31: 料金は架空の値を方針として載せないため、予約ページで確認する導線にした。
- 2026-10-31: 灯色は地(灰色)の上では文字にもボタン面にも使えない(コントラスト不足)。地の上の主ボタンは窯色地+灯色文字。
- 2026-10-31: 写真枠の中の「写真 近日掲載」タグはキャプションと重複するので外した(1つ減らす)。
- 2026-10-31: 1280では日付欄を固定幅にすると筆文字の日付が席の輪にかぶった。日付欄は max-content、席の輪は折り返さない。
