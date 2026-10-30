# design-nexus

話題のデザイン系エージェントスキル10種の長所を1つにまとめ、短所(検証がない、重い、一貫しない、改善できない)を補ったデザインスキルです。Claude Code、Cursor、Codex で使えます。

- **方向性**: 主題に根ざした3案 → トークン計画 → シグネチャ要素(frontend-design、Taste、UI/UX Pro Max 由来)
- **検証**: 依存ゼロの lint と、任意のレンダーチェック(Floor / Reflex / Finish の3段階。Impeccable、Hallmark、Vercel 由来)
- **一貫性**: `DESIGN.md` を唯一の真実として、トークンのコントラストまで自動検査(interface-design、UI/UX Pro Max 由来)
- **領域**: マーケ / プロダクトUI / モバイル を切り替え、和文組版にも対応
- **改善ループ**: 評価ケース・ルーブリック・自動採点・審査エージェント・採用判定で、スキル自体を更新し続けられる

調査と比較は [docs/comparison.md](docs/comparison.md)、2026年10月下旬の X 上の話題は [docs/design-skills.md](docs/design-skills.md) にあります。

## インストール

Node 18 以上が必要です(チェックスクリプトに使います)。

```bash
git clone https://github.com/tkc310/design-nexus && cd design-nexus

./install.sh claude --global          # Claude Code: ~/.claude/skills/design-nexus
./install.sh claude ~/work/my-app     # Claude Code: プロジェクトの .claude/skills/
./install.sh codex  ~/work/my-app     # Codex: .agents/skills/ + AGENTS.md にブロックを追記
./install.sh codex  --global          # Codex: ~/.agents/skills/ + ~/.codex/AGENTS.md
./install.sh cursor ~/work/my-app     # Cursor: .cursor/rules/design-nexus.mdc + .cursor/design-nexus/
./install.sh all    ~/work/my-app     # 3つまとめて
```

Claude Code はプラグインとしても入れられます: `/plugin marketplace add tkc310/design-nexus` → `/plugin install design-nexus@design-nexus`

AGENTS.md への追記は `<!-- design-nexus:start -->` 〜 `end` のブロックで行うので、再実行しても重複しません。

レンダーチェックを使う場合はプロジェクトに Playwright を入れてください(`npm i -D playwright && npx playwright install chromium`)。無ければ自動でスキップし、lint だけで動きます。

## 使い方

普段どおり UI の作成やレビューを頼むだけで発動します。明示したいときは「design-nexus で」と添えてください。

| やりたいこと | 例 |
|---|---|
| 新規作成(build) | 「design-nexus で、このCLIツールのLPを作って」 |
| リデザイン | 「この設定画面をリデザインして。レイアウトは維持」 |
| 監査(audit) | 「このページのデザインをレビューして」 |
| 調整(steer) | 「もっと bolder に」「quieter」「densify」「harden」 |
| デザインシステム(system) | 「このプロジェクトの DESIGN.md を作って」 |
| 振り返り(retro) | 「さっきの案は情報が多すぎた。次から気をつけて」 |

予算は quick / standard(既定)/ deep。「deep で」と言えば、ヒーローの単独レビューや別コンテキストでの講評まで行います。

### チェックを単体で使う

```bash
node <skill>/scripts/lint.mjs src/ --design DESIGN.md     # 静的チェック(依存なし)
node <skill>/scripts/render-check.mjs index.html            # 320/768/1280/1920px でスクショ+実測チェック
node <skill>/scripts/tokens-check.mjs DESIGN.md             # 配色トークンのコントラストと整合性
```

`<skill>` は導入先(例: `.claude/skills/design-nexus`、`.agents/skills/design-nexus`、`.cursor/design-nexus`)。Floor が残ると終了コード 2 になるので、CI やフックにもそのまま使えます。チェックID一覧は [references/checks.md](skills/design-nexus/references/checks.md)。

Reflex を意図的に残す場合は、ファイル内に理由を書きます: `/* design-nexus: keep R02 because ブランド規定のグラデーション */`

## 改善ループ

```bash
node eval/run.mjs prepare --label baseline   # 6ケースの作業フォルダを作る
#   各 PROMPT.md をエージェントに実行させる(generate --cmd "claude -p" なども可)
node eval/run.mjs score --run <run>          # lint+レンダー+スクショ → 自動点(40点)
node eval/run.mjs judge --run <run>          # 別コンテキストの審査 → judge.json(60点)
node eval/run.mjs score --run <run>          # 合計100点で集計
node eval/run.mjs feedback --run <run>       # 多発チェック・弱い次元・改善案を集約
node eval/run.mjs compare --base baseline --run <run>   # 採用/不採用を判定
```

Claude Code では、このリポジトリで `/improve-design-nexus` を実行すると1イテレーションを通しで回します。手順と判定基準は [loop/IMPROVEMENT.md](loop/IMPROVEMENT.md) と [eval/rubric.md](eval/rubric.md)、利用中に気づいたことは [loop/feedback.md](loop/feedback.md) に書きます。

## 構成

```
skills/design-nexus/      正本(ここだけ編集)
  SKILL.md                モード・予算・ビルドループ・Floor
  references/             方向性、クラフト、チェック、監査、リデザイン、調整語彙、振り返り、
                          サーフェス別(marketing/product/mobile)、モーション、和文組版
  scripts/                lint.mjs / render-check.mjs / tokens-check.mjs / lib.mjs
  templates/DESIGN.md     プロジェクト用の真実の源
eval/                     ケース6件、ルーブリック、審査プロンプト、fixtures、run.mjs
loop/                     改善手順、フィードバックログ、実験ログ
scripts/build.mjs         Claude Code / Codex / Cursor 用に dist/ を生成
scripts/test.mjs          チェックの回帰テスト
install.sh                インストーラ
docs/comparison.md        調査・比較レポート
docs/design-skills.md     X上の話題（2026年10月下旬）
```

## クレジット

設計は以下のスキルを調査して組み立てました(文章のコピーではなく、考え方の統合です): anthropics/skills の frontend-design、nextlevelbuilder/ui-ux-pro-max-skill、Leonxlnx/taste-skill、pbakaus/impeccable、nutlope/hallmark、vercel-labs/agent-skills、ibelick/ui-skills、Dammyjay93/interface-design、emilkowalski/skills、elayadesign/ai-design-skills。
