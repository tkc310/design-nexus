# DESIGN.md

## Subject

- Subject: 京都・五条坂の小さな陶芸工房「土と灯」。職人2名、日常の器(飯碗・湯呑・小皿)と月2回の手びねり体験教室(各回6名まで)。
- Audience: 30〜50代の国内外の旅行者。清水寺・五条坂を歩くついでに、手を動かす時間を探している人。
- Job of the main surface: 体験教室の予約ページへ送る(「予約する」)。
- Surface type: marketing

## Direction

「テストピース盤」。工房の聚楽壁に吊るした釉薬の試験片(テストピース)を、ページの単位にする。上に吊り穴、上部は素地のまま、下2/3に釉薬が掛かり、素地部分に鉄絵の筆で記号が書かれた縦長の小板。ヒーローは体験で選べる6色の釉薬を吊るした盤そのもの(シグネチャー)。日程は「1回=1枚の試験片」、教室の流れの印、器の棚札にも同じ板を使う。地は京都の聚楽土の壁色(中明度)、行動色は京焼の呉須。

## Tokens

```tokens
color.bg: #C4B08C
color.surface: #EEEBE3
color.text: #221C17
color.muted: #3F3428
color.accent: #24366F
color.on-accent: #EEEBE3
color.clay: #DCCDB0
color.celadon: #93AD9C
color.ame: #7B4A22
color.shinsha: #8F2B2B
font.display: "Yuji Syuku", serif
font.body: "Zen Kaku Gothic New", sans-serif
type.base: 16px
type.ratio: 1.25
space.base: 8px
radius.default: 6px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/bg, accent/surface, text/clay
```

## Patterns

- Buttons: 呉須ベタ+白釉文字、角6px、押下で scale(0.97)。二次ボタンは呉須の線のみ。
- Inputs and forms: なし(予約は別ページ)。
- Cards / panels: 「試験片」= 上角6px・下角3px の縦長板、吊り穴、壁に落ちる実影(box-shadow 1段)。比較できる項目の集まり(釉薬、開催回)にだけ使う。
- Tables: なし。
- Navigation: ロゴ+4リンク+予約ボタン。固定しない。
- Motion: なし(ホバーの色変化と押下のみ、reduced-motion で無効化)。

## Page overrides

なし。

## Looks used

- index.html — mid(聚楽土の壁 #C4B08C, 黄土 hue ~40°)/ accent 呉須(hue ~225°)/ 筆文字ディスプレイ+角ゴシック本文 / 実物の板(試験片)に実影、テクスチャ素材系。

## Learnings

- 2026-10-31: 却下「窯の灯」(夜の窯・暗地+炎色)= R04b に寄りやすい。却下「窯焚き帳」(記録帳・罫線・等幅数字)= ハウスルック R04d に寄る。アクセント候補の辰砂は警告色に見え、黄土地と暖色同士で行動色が沈むため不採用。青磁は黄土地上でコントラストが足りず行動色にならないため、試験片の一色として使用。
- 2026-10-31: 仕上げで削った装飾:ヒーローのキャプション前の呉須の四角。行動色を予約ボタンだけに残すため。ナビは 320px で1行に収めるため「教室の日程」を「日程」に短縮。
