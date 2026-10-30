# フィードバックログ

スキルを使っていて気づいたことを追記します。retro モードの出力もここに貼ります。改善ループで扱ったら status を更新します。

## テンプレート

```
### YYYY-MM-DD 短いタイトル
- status: open | in-experiment | resolved | wontfix
- source: human | judge | lint | production
- case / project:
- what happened:
- expected:
- which rule should have prevented it (ID or file):
- applies beyond one project because:
```

## エントリ

### 2026-10-30 表を含むグリッドが 320px で横スクロールする
- status: open
- source: lint(render F08)
- case / project: eval 03-dash-clinic(スモークテスト)
- what happened: `grid-template-columns: 1fr` の子にテーブルがあり、min-content で列が広がってページ全体が 718px になった。
- expected: テーブルだけが `.table-wrap` 内で横スクロールする。
- which rule should have prevented it: craft.md の Layout に「表や長いコードを含むグリッド/フレックスの子には `min-width: 0`」を追加する案。
- applies beyond one project because: CSS Grid/Flex の既定の min-width:auto による定番の崩れで、ダッシュボード全般で起きる。

### 2026-10-30 ラベル付きラジオが F09 で誤検知される
- status: resolved
- source: lint(render F09)
- case / project: eval 03-dash-clinic
- what happened: `<label>` で包んだ 13px のラジオがタップ領域不足と判定された。
- expected: ラベルがクリック領域を広げるので合格。
- which rule should have prevented it: render-check.mjs の F09 判定。`el.labels` の矩形を考慮するよう修正済み。
- applies beyond one project because: フォーム全般。

### 2026-10-30 数値表示(.big)の行間が R14 で誤検知される
- status: resolved
- source: lint(R14)
- case / project: eval 03-dash-clinic
- what happened: 大きな数値表示の line-height: 1.2 が「和文本文の行間が狭い」と判定された。
- expected: 見出し・数値表示は対象外。
- which rule should have prevented it: lint.mjs の R14。セレクタに big/stat/kpi/figure/number/metric を含む場合は除外するよう修正済み。
- applies beyond one project because: KPI 表示はプロダクトUI全般にある。

### 2026-10-30 ベースラインで3モデルの審査がそろって指摘した定番ルック
- status: in-experiment (EXP-001)
- source: judge(Opus・Fable・Sonnet)
- case / project: baseline 01・02・03・04・06
- what happened: 淡い紙色、インクブルー1色と蛍光黄、mono の小ラベル、罫線、角丸2〜4px、影なし、濃い締めの帯がほぼ全ケースで共通していた。
- expected: 題材ごとに明度・書体ジャンル・質感が変わる。
- which rule should have prevented it: direction.md の作例が、この見た目そのものだった。
- applies beyond one project because: スキルを使う全プロジェクトの出力が同じ顔に寄る。

### 2026-10-30 タブレット幅(768px)の崩れが D7 の最低点
- status: open
- source: judge
- case / project: baseline 03(金額が数字の途中で折り返す)、04(マトリクスがパネルからはみ出す)、02(ヒーローの SVG が 650px)、06(320px で図版の文字が約6px)
- which rule should have prevented it: render-check に R17 を追加済み(はみ出し・切り取り・数字の折り返し)。craft 側のルールはまだない。
- applies beyond one project because: 中間幅の確認が抜けるのは汎用的な傾向。

### 2026-10-30 宣言したフォントが読み込まれていない
- status: resolved(lint R16 を追加)
- source: judge(Fable・Opus)、lint
- case / project: baseline 01、04
