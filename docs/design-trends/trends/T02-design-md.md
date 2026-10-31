# T02. DESIGN.md／エージェントが読めるデザインシステム

[索引](../index.md) · [2026-10 のスナップショット](../monthly/2026-10.md)

- **ID**: T02
- **タグ**: #system #ai-agent #workflow
- **概要**: デザインシステムを「人間向けのドキュメント」から「エージェントが実行できる仕様」に変える動き。中心にあるのが Google Stitch 発の DESIGN.md。
- **特徴・適用方法**:
  - DESIGN.md は、YAML トークン（colors、typography、rounded、spacing、components、`{colors.primary}` 形式の参照）と、Markdown の意図説明（Overview → Colors → Typography → Layout → Elevation → Shapes → Components → Do's and Don'ts）を組み合わせる。
  - エージェントに渡すものは、名前付きトークン、明示的なコンポーネント API、承認済みの使用例、禁止パターン、アクセシビリティのルール、違反を検出するコマンド。
  - 進め方は、まず準拠を固めることです。目に見える判断はすべてトークンまで遡れるようにし、未定義の値は却下する。taste はそのあとで加える。
  - 生成物にパレット外の色が混ざっていないかを機械的にチェックする。Stitch で 47 色が追加された事例が報告されている。
- **向く場面**: 複数のエージェントやツールでブランドの一貫性を保ちたいとき。既存のデザインシステムを AI に使わせたいとき。
- **避ける場面**: 探索段階で方向がまだ決まっていないとき（DESIGN.md が早すぎる固定化になる）。他社ブランドの DESIGN.md をそのまま流用すること（模倣になり、商標の問題もある）。
- **代表例**: google-labs-code/design.md（★28,667）、VoltAgent/awesome-design-md（★124,721）、shadcn/ui skills の DESIGN.md 対応、Figma Guidelines と Code Sources。スターは 2026-10-31 12:45 JST 頃。
- **ソース**:
  - [X: @shadcn 2026-10-10](https://x.com/shadcn/status/2108574564586332615) L4,115 / V242,051
  - [X: @nykdotdev 2026-08-29「The next design system has two users」](https://x.com/nykdotdev/status/2093588858307043437) L43 / V7,050
  - [X: @RoundtableSpace 2026-10-22](https://x.com/RoundtableSpace/status/2113106821091143750) L248 / V51,183
  - [X: @shaderdotmd 2026-10-28](https://x.com/shaderdotmd/status/2115455547357204734) L1
  - [Google の記事（2026-04-21）](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/)
  - [google-labs-code/design.md](https://github.com/google-labs-code/design.md)
- **トレンド時期**: 2026-04 に仕様公開。2026-08〜10 にツールと周辺サービスが急増。
- **確度**: 高

- **状態**: rising

## 更新履歴

- 2026-10: 初収録。本文は 2026-08〜10 の普及と書いているので、状態は rising。確度は高。
