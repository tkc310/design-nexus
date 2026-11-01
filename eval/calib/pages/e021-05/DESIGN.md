# DESIGN.md

## Subject

- Subject: ひなた市コミュニティバス「ひなた号」市内循環の停留所時刻表(スマートフォンのブラウザ)
- Audience: 停留所や自宅で次のバスを確かめる住民。高齢の利用者が多く、屋外の日差しの下で片手で見る。
- Job of the main surface: 選んだ停留所から次に乗れるバスが「何時に」「あと何分で」来るかを知る。
- Surface type: mobile

## Direction

「停留所の時刻板」。停留所の標柱に付いている白いホーロー時刻板を画面に起こす。黒い枠と左の「時」の列、太いゴシックの数字、時刻板に貼られる赤い運休の貼り紙、バス車体の緑の帯。シグネチャは「つぎに来るバス」の発車板で、単位は時刻板の行(左のラベル列+右の数字)。同じ行がお知らせ(左列=日付)と全時刻表(左列=時)にも使われ、ページ全体が一枚の時刻板として読める。

## Tokens

```tokens
color.bg: #E8E9E6
color.surface: #FFFFFF
color.text: #15181A
color.muted: #4B5157
color.accent: #0A6B3B
color.on-accent: #FFFFFF
color.border: #7D848B
color.danger: #B42318
color.danger-bg: #FCECEA
dark.color.bg: #101311
dark.color.surface: #1B201D
dark.color.text: #EDF0EC
dark.color.muted: #B7BEB8
dark.color.accent: #6FD39A
dark.color.on-accent: #08180F
dark.color.border: #78817B
dark.color.danger: #FF9C8F
dark.color.danger-bg: #3A1B18
font.display: "Atkinson Hyperlegible", sans-serif
font.body: "BIZ UDPGothic", sans-serif
type.base: 18px
type.ratio: 1.25
space.base: 4px
radius.default: 10px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/surface, danger/surface, danger/danger-bg
```

## Patterns

- Buttons: 高さ 3rem(通常 54px、文字を大きくすると 66px)、2px の枠、押下中は塗り。トグルは `aria-pressed`。
- Inputs and forms: 停留所はネイティブの `select`(2px 墨の枠、1.25rem 太字、矢印は CSS)。ダイヤ切替はラジオを2分割のセグメントに。幅 640px 以上では両ダイヤを並べるので切替は出さない。
- Cards / panels: `.plate` = 白地、2px 墨枠、角丸 10px、影なし。中身は `.row`(左ラベル列 4.2rem + 本体)を 1px 罫で区切る。
- Tables: 全時刻表は「時」の行見出し+分のチップ。幅 640px 以上は 平日|土日・祝日 の2列、それ未満は選んだダイヤの1列。今日のダイヤの列だけ、発車済み(薄字)・つぎ(緑塗り)・その次(緑枠)・運休(赤破線+取消線+「運休」)を付ける。
- Navigation: ヘッダーはサービス名と「文字を大きく」のみ。固定しない。
- Motion: ボタンとセグメントの色の切替 120ms のみ。`prefers-reduced-motion` で無効。
- Text size: ルート 112.5%(18px)、大きく 137.5%(22px)。寸法はすべて rem なので一緒に拡大する。
- Dark: ヘッダーは緑の面をやめて時刻板の面+緑の下線にする。

## Page overrides

## Looks used

- light (aluminium neutral ground, white plate), accent green from the bus livery + red for cancellations, humanist/UD sans (Atkinson Hyperlegible figures + BIZ UDPGothic), bordered plates with heavy 2px ink frames, no shadows.

## Learnings

- 2026-10-31: 夜は「次の3本」が翌日の始発になる。「あと10時間」を巨大数字で出すと 320px で崩れたので、1時間以上の待ちは数字を一段小さくし、「明日」タグと「きょうの運行は終わりました」を添える形にした。
- 2026-10-31: 土日祝は1時間1本で、1280px の1列表は右側が空いた。標柱の時刻板と同じ 平日|土日・祝日 の2列にして解決。
- Rejected: LED 行先表示器風のダーク(夜間以外は日差しで読みにくい)、回数券風の色紙地(コントラストが取りにくい)。
