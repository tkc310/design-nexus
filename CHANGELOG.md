# Changelog

## 0.2.0 — 2026-10-31

- `docs/design-trends.md` を月次更新のディレクトリ `docs/design-trends/` に分割した。T01–T18 の ID、ソース、数値、留保は残している。見送りと保留は `monthly/2026-10.md`。
- ヒアリングで流行を取り入れると分かったときだけ、スキルが `latest.md` → `index.md` → 該当項目を読む。採用前に、目的・読者・ブランド、アクセシビリティと性能、確度、fading / dropped / アンチパターン / 定番、避ける場面を評価する。どれも通らなければ採用しない。求められていなければ DB は開かない。AGENTS.md と CLAUDE.md からは読み込まない。
- 月次の収集手順と、X をクラウドエージェントが直接開かず `x-findings-YYYY-MM.md` で受け取る形式を `COLLECTING.md` に書いた。
- `scripts/build.mjs` が DB をスキルの隣へコピーする。install.sh 経由でも同じパスを読める。

## 0.1.0 — 2026-10-30

- 初版。frontend-design、UI/UX Pro Max、Taste、Impeccable、Hallmark、Vercel web-design-guidelines、ui-skills、interface-design、Emil Kowalski skills、elayadesign/ai-design-skills の長所を統合(比較は `docs/comparison.md`)。
- モード: build / redesign / audit / steer / system / retro。予算: quick / standard / deep。
- 依存ゼロの lint(Floor 12 / Reflex 15 / Finish 8 のチェックID)、トークン検査、Playwright によるレンダーチェック(任意)。
- 評価ケース6件、ルーブリック、評価ランナー、改善ループの手順。
- Claude Code / Cursor / Codex 用のビルドとインストーラ。
