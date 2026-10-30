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
