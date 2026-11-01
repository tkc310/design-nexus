# DESIGN.md

## Subject

- Subject: みどり台市コミュニティバス「ぐるりんバス」（右回り循環・12停留所）の停留所別時刻表
- Audience: 高齢の利用者が多い地域住民。スマートフォンのブラウザで、停留所や家の玄関先で見る
- Job of the main surface: 選んだ停留所から次のバスが「あと何分」で出るかを知る
- Surface type: mobile

## Direction

「標柱の時刻表板」。停留所のポールに付いている時刻表板をそのまま画面にする。白い琺瑯の板、黒い罫、車体色の緑で塗った「時」の列、点字ブロックの黄色で「次に乗るバス」を示し、運休は事業者が貼る赤いシールの色。シグネチャは「次のバス」板：左に黄色の「あと◯分」セル、右に発車時刻。その単位（左の色セル＋右の本文、2px の黒罫で区切る行）を、運休行（赤セル）・お知らせ（赤／黒セル）・全時刻表（緑の時セル）でも使う。

## Tokens

```tokens
color.bg: #FFFFFF
color.surface: #F3F3F1
color.text: #161616
color.muted: #5A5A5A
color.accent: #FFD100
color.on-accent: #161616
color.border: #161616
color.danger: #B3261E
color.livery: #00694B
dark.color.bg: #121416
dark.color.surface: #1E2225
dark.color.text: #F3F3F1
dark.color.muted: #A9ADB0
dark.color.accent: #FFD100
dark.color.on-accent: #161616
dark.color.danger: #FF8A80
dark.color.livery: #0F5A41
font.display: "Overpass", sans-serif
font.body: "BIZ UDPGothic", sans-serif
type.base: 18px
type.ratio: 1.25
space.base: 4px
radius.default: 8px
pairs: text/bg, muted/bg, text/surface, on-accent/accent, danger/bg
```

## Patterns

- Buttons: 高さ 52px 以上、2px の黒枠、押下中は黒地に白（aria-pressed）。ラベルは動詞か選択肢名。
- Inputs and forms: ネイティブ select（OS のピッカーを使う）、高さ 64px、文字 28px、3px 枠。
- Cards / panels: カードは使わない。「板」= 2px 黒枠・角丸 12px の中に、色セル＋本文の行を 2px 黒罫で積む。
- Tables: 時刻表は `<table>`、時の列は緑地白抜き、分は 28px の Overpass。次の便は黄色地、運休は赤の取り消し線＋「運休」、発車ずみは muted。
- Navigation: なし（1画面）。
- Motion: 押下時の scale(0.97) と背景色の遷移のみ。reduce では scale を外す。

## Page overrides

なし。

## Looks used

- 2026-10 ぐるりんバス時刻表: light（白の琺瑯）、ground 無彩色・accent 黄 50°＋車体緑 160°、sign-gothic 数字（Overpass）＋UD ゴシック、2px 黒罫の板・影なし。

## Learnings

- 2026-10-31: お知らせ行を時刻と同じ 8.5rem セルにすると 320px で本文が 7 字/行まで細る。お知らせは 520px 以下でセルを上の帯にした。
- 2026-10-31: 1時間以上先のカウントダウンは 8.5rem セルで「1時間／23分」に割れる。480px 以上はセルを 10.5rem に。
- 却下: 行先 LED 風のドット数字（高齢者に読みにくい）、回数券の綴り風カード（横スワイプが必要になる）。
