# 改善計画の見直し(M-009)

`node eval/run.mjs plateau` が `STALLED` を返したら(終了コード 3)、次の仮説に進む前にこの見直しを行います。

## 誰が行うか

- 仮説を立ててきたセッションとは**別の、新しいコンテキスト**で行う。これまでの仮説に引きずられないため。
- **Opus を最大の推論量(max)**で使う。Claude Code ではサブエージェントを `model: opus`、`effort: max` で起動する。Codex・Cursor では、使える最も強いモデルと最大の推論設定を使う。
- 見直し役はスキル(`skills/`)・評価の仕組み(`eval/run.mjs`、`eval/rubric.md`、`eval/judge-prompt.md`)を直接書き換えない。書くのは `loop/plan.md` だけ。変更はメインのセッションが、通常の手順(1仮説ずつ、`compare` と規則6で判定)で行う。

## 見直し役に渡すプロンプト

以下をそのまま渡す(`<…>` は埋める)。

```
あなたは design-nexus の改善ループの計画を見直す、独立したレビュアーです。これまでの仮説は別のセッションが立てました。ループは頭打ちです(<plateau の出力を貼る>)。

読むもの(この順で):
1. /home/claude/design-nexus/AGENTS.md と loop/IMPROVEMENT.md(手順と制約)
2. loop/experiments.md(全実験。仮説・変更・結果・判定)と loop/method.md(評価手法の変更)
3. eval/rubric.md(採点と採用判定)と eval/judge-prompt.md、eval/pair-prompt.md
4. skills/design-nexus/SKILL.md と references/(いまのスキル)
5. 直近の学習用 run の審査(eval/runs/<最新の候補 run と base run>/*/judge.*.json の top_issues と reasons)と、対比較の決め手(各 run の _pairs/*/pair.*.json の deciding_issue)
6. 仮説の材料として、必要なら docs/design-trends/ を読んでよい(スキルの本文から参照させる変更は提案しない)

読まないもの: 検証用(07〜12)の審査結果。

考えること:
- なぜ頭打ちなのか。仮説の選び方、変更の粒度、評価の感度、生成のばらつき、審査の癖のどれが効いているかを、実験の記録を根拠に診断する。
- 却下された仮説に共通する失敗の型(例: 狙った欠陥は消えたが審査は同じ次元の次の欠陥を見つけた、変更が別の崩れを生んだ)。
- 同じ型を繰り返さない次の打ち手。1つの欠陥を消す規則ではなく、生成の手順や判断の順序を変える案も含める。
- 評価手法そのものの改善案(判定の感度、費用、偏り)。

`loop/plan.md` に次の形で書く(日本語。既存の内容は置き換える):

reviewed-after: EXP-<最後に判定した実験の番号>
reviewed-at: <日付>

## 診断
(頭打ちの原因。experiments.md の実験番号を根拠に挙げる)

## やめること
(繰り返している失敗の型と、それを避ける規則)

## 次の仮説(優先順、最大5件)
各件に: 仮説(1文)、狙う次元とチェック、対象ケース(学習用から)、変更先のファイル、効果を確かめる方法、予想される失敗と回避策

## 評価手法の改善案
(あれば。method.md に M- として記録する前提で、理由と費用)

最後に、plan.md の要約を5行以内で返す。
```

## 見直しのあと

- メインのセッションは `loop/plan.md` を読み、上から順に仮説を試す。採るかどうかはメインが判断し、採らない理由は `loop/experiments.md` に残す。
- 評価手法の改善案を採るときは `loop/method.md` に M- として記録する。
- `plan.md` の `reviewed-after` が更新されるので、`plateau` はそこから数え直す。
