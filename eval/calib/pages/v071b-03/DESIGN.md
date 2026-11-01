# DESIGN.md

## Subject

- Subject: 小規模クリニック(スタッフ15〜40名)向け給与計算SaaS。月ごとの「勤怠締め → 承認 → 給与確定 → 振込」の流れを扱う。
- Audience: 事務長・院長夫人・医療事務のリーダーなど、本業の合間に毎月の給与を締める人。経理の専門家ではなく、締め日と振込期限を落とすことを一番恐れている。
- Job of the main surface: 今月の給与を期限までに確定させる(承認 → 確定)。
- Surface type: product

## Direction

「勤務表の帯」。ナースステーションに貼られた勤務表(日付のマス、休診日の斜線)と、承認印の朱肉を借りる。画面の先頭は対象期間のマスを一列に並べた給与カレンダー帯で、今日・勤怠締め日・確定期限・支給日が旗で立ち、未承認の申請はその日のマスに付箋色の点で載る。同じ「日付のマス」が承認待ちの申請カードの先頭と読み込み中のスケルトンにも使われる。朱は「承認する」「確定する」と確定印だけに使う。

## Tokens

```tokens
color.bg: #F4F4F1
color.surface: #FFFFFF
color.text: #1D2023
color.muted: #565B60
color.accent: #B23A1E
color.on-accent: #FFFFFF
color.border: #D3D4D0
color.note: #FBEBC4
color.note-ink: #6B4500
color.danger: #A01F43
font.display: "Zen Maru Gothic", sans-serif
font.body: "BIZ UDPGothic", sans-serif
font.utility: "IBM Plex Sans", sans-serif
type.base: 16px
type.ratio: 1.25
space.base: 4px
radius.default: 6px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/bg, accent/surface, note-ink/note, danger/surface
```

## Patterns

- Buttons: 主ボタンは朱(`--accent`)地に白、1画面に1つ。状態で主が入れ替わる(未承認がある間は「勤怠を承認する」、ゼロになったら「給与を確定する」)。副ボタンは白地に `--muted` の枠。押下で `scale(.97)`。
- Inputs and forms: ラベルは上、枠は `--muted`、フォーカスは 2px の `--text` アウトライン + 2px オフセット。
- Cards / panels: 白地 + `--border` の罫線1本。影なし。角丸 6px。
- Tables: 数字は IBM Plex Sans の等幅数字で右寄せ、ヘッダは sticky、並べ替え可能な列は `aria-sort`。行の高さ 40px。
- Navigation: 上部バーにクリニック名と月の切替(前月/翌月)。
- Motion: トーストとダイアログの出入りだけ(200ms ease-out)。スケルトンは点滅なし。reduced-motion では移動を外す。
- Day cell(日付のマス): 日付の数字 + 曜日。休診日(日曜・祝日)は `--border` の斜線、今日は `--text` 塗り、経過日は `--bg` 地、未承認の申請がある日は付箋色、節目(締め・期限・支給)は 2px の `--text` 枠。
- 給与カレンダー帯: 1151px 以上は対象期間を1列に並べ、下に節目の旗。1150px 以下は日曜始まりの週の段に折り、旗の代わりにマスの中へ「今日/締め/期限/支給」を書く。
- Dialog: 画面の上に浮くものだけ影を1段(`--text` 22%)。パネルは影なし。
- 支給日: 25日が土日祝なら前の営業日へ繰り上げ。

## Page overrides

なし。

## Looks used

- 今月の給与ダッシュボード — light、ground: 無彩色に近い紙(わずかに暖)/ accent: 朱(約12°)、type: 丸ゴシック display + UDゴシック body + grotesk 数字、surface: flat hairlines + 斜線テクスチャ(休診日)。

## Learnings

- 2026-10-31: 医療=ティール/スクラブブルーは却下(どの医療SaaSにもある)。明細書風の明朝・罫線は R04d に寄るので却下。
- 2026-10-31: 帯を横スクロールにすると、狭い幅で締め日・支給日が画面外に消えて帯の意味がなくなった。週の段に折る形に変更。
- 2026-10-31: 未承認のマスの下線(inset shadow)は付箋色と枠で足りていたので外した。
