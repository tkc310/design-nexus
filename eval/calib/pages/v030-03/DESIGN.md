# DESIGN.md

## Subject

- Subject: 小規模クリニック(スタッフ15〜40名)向け給与計算SaaS。
- Audience: 事務長や院長。給与の専門家ではなく、月に一度、診療の合間か診療後に給与を締める。間違いと振込遅れを恐れている。
- Job of the main surface: 締め日までに勤怠を承認し、今月の給与を確定する。
- Surface type: product

## Direction

「締め日ルーラー」。クリニックの勤務表(休診日に斜線の入った月間表)と給与カレンダー(計算期間 → 締め日 → 支給日)を借り、計算期間から支給日までの1日1マスの帯を画面上部に置く。今日はワイン色のマス、締め日まで残りの日は淡いワイン、締め日は枠、支給日は緑の枠、休診日は斜線。その左に「あと4日」。下に承認待ち、合計と前月比、スタッフ別の台帳を並べる。色はスクラブ(ナース服)のワイン色を唯一のアクセントにし、状態色は承認待ち(琥珀)・確定済み(緑)・エラー(赤)だけに使う。

## Tokens

```tokens
color.bg: #F4F3F1
color.surface: #FFFFFF
color.text: #221C26
color.muted: #615A66
color.accent: #7B2D52
color.on-accent: #FFFFFF
color.border: #DEDAE0
color.warn: #8A5300
color.ok: #23663F
color.danger: #A8261F
font.display: "Zen Kaku Gothic New", sans-serif
font.body: "BIZ UDPGothic", sans-serif
font.utility: "IBM Plex Sans", sans-serif
type.base: 15px
type.ratio: 1.25
space.base: 4px
radius.default: 8px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/bg, accent/surface, warn/surface, ok/surface, danger/surface
```

Tints and the hover shade (accent-deep, accent-tint, warn-tint, ok-tint, danger-tint, past) are `color-mix()` of existing tokens (tints with surface, the hover shade with text), not separate colors.

Sources: bg = 診察室の壁と白衣(ほぼ無彩色); surface = 給与明細の用紙; text = ワインに寄せた墨; accent = ワイン色のスクラブ; warn = 未承認のタイムカードに貼る付箋; ok = 振込済みの印; danger = エラー専用。

Type sizes: 13 / 15 / 18 / 23 / 29 / 56(カウントダウンの数字のみ)。

## Patterns

- Buttons: 高さ40px、角6px。主ボタンはワイン地に白。1画面に主ボタンは1つ:承認待ちがある間は「勤怠を承認する」、なくなると「給与を確定する」が主ボタンになる。確定できない間は `aria-disabled` の破線ボタンで、理由を `aria-describedby` で添える(フォーカスは可能)。
- Inputs and forms: ラベルは上、枠は muted(3:1以上)。
- Cards / panels: 白、角8px、薄い2段の影。パネル内の区切りは1pxの罫線。
- Tables: 数字は IBM Plex Sans の tabular-nums、右揃え、折り返さない。見出しは固定、列見出しはボタンで並べ替え(`aria-sort`)。前月比が±8%以上の行に「要確認」。コンテナ幅760px以下で行をカードに組み替え(480px以下は2列)。
- Navigation: 1024px以上は左サイドバー、未満は横スクロールのタブ列。現在地はワインの線。
- Motion: ボタン押下 scale(0.97)、ダイアログ 220ms の浮き上がり、トースト 200ms。reduced-motion では移動を外し不透明度のみ。

## Page overrides

なし。

## Looks used

- 今月の給与ダッシュボード: light / ほぼ無彩色の地(#F4F3F1)・ワイン(#7B2D52)のアクセント / 和文ゴシック(BIZ UDPGothic + Zen Kaku Gothic New)、数字は IBM Plex Sans / 影のある白いパネル、角8px。

## Learnings

- 2026-10-31: 締め日を勤怠の締めと解釈すると、締め日前は給与を確定できず画面の主アクションと矛盾する。そこで締め日を「給与を確定する期限(振込データ送信の締め)」と定義し、勤怠の計算期間は9/16〜10/15で集計済みとした。
- 2026-10-31: 却下: マス目に日付を常時表示(320pxで1マス約7pxになり読めない)。日付は900px以上だけ装飾として表示し、意味はマス下の凡例リストで伝える。
- 2026-10-31: 却下: 0件見本の破線アイコン枠(情報がなく、最後に外した装飾)。
- 2026-10-31: 却下案: 給与明細の帳票そのものを模した罫線レイアウト(エージェントの定番の見た目に近い)、診療後の事務室を想定した暗色・等幅中心の案。
