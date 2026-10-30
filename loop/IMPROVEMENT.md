# 改善ループ

design-nexus 自体を「評価 → フィードバック → 更新」で少しずつ良くするための手順です。人が回しても、エージェント(Claude Code / Codex / Cursor)に回させても同じ手順です。

```
 ┌──────────── 1. 評価 ────────────┐
 │ prepare → 生成 → score → judge │
 └───────────────┬────────────────┘
                 ▼
 ┌────────── 2. フィードバック ───────────┐
 │ feedback.md(自動集計)               │
 │ loop/feedback.md(人・利用現場の声)   │
 └───────────────┬───────────────────────┘
                 ▼
 ┌────────── 3. 仮説と更新 ──────────┐
 │ 仮説を1つだけ選び、最小の変更   │
 │ loop/experiments.md に記録       │
 └───────────────┬──────────────────┘
                 ▼
 ┌────────── 4. 再評価と判定 ─────────┐
 │ 同じケースで再実行 → compare     │
 │ ACCEPT なら版を上げ、REJECT なら戻す │
 └──────────────────────────────────┘
```

## 0. ベースラインを作る(初回のみ)

```bash
node eval/run.mjs prepare --label baseline
# 各ケースの PROMPT.md をエージェントに実行させる(下の「生成のやり方」)
node eval/run.mjs score --run <run>     # lint・レンダー・スクリーンショット
node eval/run.mjs judge --run <run>     # 審査用プロンプトを作る(--cmd で自動実行も可)
# 各ケースの judge.json を保存したら、もう一度
node eval/run.mjs score --run <run>
```

採点が揃った run を `eval/runs/baseline/` にコピーしてコミットします(`.gitignore` で baseline だけ追跡対象)。

### 生成のやり方

- **Claude Code**: `node eval/run.mjs generate --run <run> --cmd "claude -p --permission-mode acceptEdits"`、または対話中に `/improve-design-nexus` を使う。
- **Codex**: `--cmd "codex exec --full-auto -"`
- **Cursor**: CLI がない場合は、各ケースのフォルダを開いて PROMPT.md をエージェントに貼る。
- 審査(judge)は**生成とは別のセッション**で行う。同じ会話で採点させない。

## 1. 評価

ケースは `eval/cases/` にあります(マーケ2、プロダクト2、モバイル1、リデザイン1。日本語3、英語3)。現場で失敗したパターンが見つかったら、ケースを追加します。ケースを増減したらベースラインを取り直します。

## 2. フィードバックを集める

二つの入口があります。

- **自動**: `node eval/run.mjs feedback --run <run>` が、多発したチェックID、弱い次元、審査エージェントの `rule_suggestion` を `feedback.md` にまとめます。
- **人・利用現場**: プロジェクトで使っていて気づいたこと(retro モードの出力を含む)を `loop/feedback.md` に追記します。

## 3. 仮説を1つ選んで更新する

- **1イテレーション1仮説。** 複数を同時に変えると何が効いたか分からなくなります。
- 優先順位: Floor 不合格 > 審査で最低の次元 > 多発する Reflex > 人のフィードバック。
- 変更先の選び方:

| 症状 | 変更先 |
|---|---|
| 決定的に検出できる失敗 | `scripts/lint.mjs` や `render-check.mjs` にチェックを追加し、`references/checks.md` にIDを登録 |
| 判断の誤り(方向性、階層、コピー) | `references/` の該当ファイルに具体的なルールを追加 |
| 手順の抜け | `SKILL.md` のビルドループ |
| 誤検知 | チェックの条件を絞り、`eval/fixtures/` に誤検知例を追加 |

- `SKILL.md` は短く保つ(目安 150 行以内)。詳細は references に置く。
- 変更前に `loop/experiments.md` に仮説・変更内容・期待する効果を書く。

## 4. 再評価して判定する

```bash
node eval/run.mjs prepare --label exp-<番号>
# 生成 → score → judge → score
node eval/run.mjs compare --base baseline --run <run>
```

判定基準は `eval/rubric.md` の「採用判定」。

- **ACCEPT**: `VERSION` を上げ(ルール追加は minor、修正は patch)、`CHANGELOG.md` に記録、`node scripts/build.mjs` でアダプターを再生成、新しい run を baseline に置き換える。
- **NEUTRAL**: 狙った次元・チェックが改善していれば採用、そうでなければ戻す。
- **REJECT**: 変更を戻し、`loop/experiments.md` に結果と理由を残す(同じ失敗を繰り返さないため)。

## 審査のゆらぎへの対処

- 審査エージェントのスコアは揺れます。差が小さいときは、同じ run を2回 judge して平均を取る。
- 自動スコア(40点)は決定的なので、回帰の検知はまずこちらを見る。
- 月に1度程度、人が数ケースを採点し、審査エージェントとの差が大きい次元はルーブリックの基準文を具体化する。
