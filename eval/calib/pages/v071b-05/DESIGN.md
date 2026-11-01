# DESIGN.md

## Subject

- Subject: かやの市コミュニティバス「かやのん号」(市内循環・一方向)の停留所別時刻表。
- Audience: 市内の高齢者が中心。スマートフォンのブラウザで、バス停や自宅から「次のバスは何分後か」を確かめる。老眼・片手持ち・屋外の明るさが前提。
- Job of the main surface: 選んだ停留所の「次の3本」を一目で知らせる。
- Surface type: mobile

## Direction

「停留所の時刻表板」。バス停のポールに付いている白い時刻表板と、かやのん号の車体の黄色い帯を借りる。時刻表板の単位は「時の帯 + 分の並び」の一行(時刻表行)で、次の3本・当日の全時刻表・運休の貼り紙のすべてがこの板と行から組まれる。シグネチャーは、黄色い帯の上に停留所名を掲げた「次の3本」の板で、最初の1本は「あと 7分」が画面の主役になる大きさで出る。

## Tokens

```tokens
color.bg: #E6E5DF
color.surface: #FFFFFF
color.text: #1B1A17
color.muted: #55534C
color.accent: #F5C400
color.on-accent: #1B1A17
color.border: #7D7A70
color.danger: #B3121F
dark.color.bg: #121210
dark.color.surface: #1F1E1B
dark.color.text: #F1EFE7
dark.color.muted: #BAB7AC
dark.color.accent: #F5C400
dark.color.on-accent: #1B1A17
dark.color.border: #8F8C82
dark.color.danger: #FF8A80
font.display: "Barlow Semi Condensed", "BIZ UDPGothic", sans-serif
font.body: "BIZ UDPGothic", sans-serif
type.base: 18px
type.ratio: 1.333
space.base: 8px
radius.default: 10px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, danger/surface, border/surface
```

- color.bg — 停留所ポールの亜鉛めっきの灰(板が掛かる地)
- color.surface — 時刻表板の白
- color.text — 時刻表板の黒い印刷
- color.muted — 発車済みの便・補足(本文インクより一段弱いが 7:1 以上)
- color.accent — かやのん号の車体の黄帯(地として使う。文字色には使わない)
- color.danger — 運休の貼り紙に押される赤い印(運休にだけ使う)

## Patterns

- Buttons: 高さ 48px 以上、8px 角、黒インクの 2px 枠。押されている状態は黄帯の地 + 黒インク。`:active` で scale(0.97)。
- Inputs and forms: 停留所は native `<select>`(高さ 56px、文字 1.333rem)。ラベルは常に見える。
- Cards / panels: 「板」= 白地、10px 角、影 1 段(ポールに掛かった板の厚み)。板の上端に黄帯。
- Tables: 時刻表行 = 左に黄帯の「時」セル、右に分。発車済みは muted、次の便は黒地に黄の数字、運休は打ち消し線 + 赤の「運休」。
- Navigation: なし(1 画面)。
- Layout: 〜1023px は 1 列(停留所 → 次の3本の板 → 運休の貼り紙 → 全時刻表)。1024px 以上は左に停留所と次の3本、右に貼り紙と全時刻表。時刻表行は 640px 以上で 2 段組、1600px 以上で 3 段組。
- Text size: 「文字の大きさ」標準(root 18px)/大きく(root 22px)。すべて rem で組む。
- Motion: ボタンの押下フィードバックのみ。reduced-motion で無効。

## Page overrides

なし。

## Looks used

- index.html — light (zinc gray ground, white plates), accent yellow (hue ~48, used as ground band), condensed grotesk figures + UD gothic, cards with real elevation.

## Learnings

- 2026-10-31: 不採用 —「車内 LED 行先表示」(黒地にアンバーの点字体)。夜の雰囲気は出るが、屋外の日中に読みづらく、R04b に近い。
- 2026-10-31: 不採用 —「回数券」(車体色の飽和した地 + 丸ゴシック + 券面カード)。親しみはあるが、時刻の一覧が券面に収まらず、全時刻表が別物になる。
- 2026-10-31: 連続する運休便は 1 行にまとめる(3 行並べると 2本目が画面外に押し出された)。
- 2026-10-31: 運行終了後は「今日のバスは終わりました」を先に出し、明日の始発から 3 本を数える。
- 2026-10-31: 「次の3本」を数えるとき運休の便は数に入れず、打ち消し線の行として間に残す(乗るつもりだった便が消えた理由がその場でわかる)。
