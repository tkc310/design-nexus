# Changelog

## 0.2.0 — 2026-10-31

- 方向性: 作例が「淡い紙色+インクブルー+mono+罫線」という定番ルックそのものだったので外した。3案を構造・明度・書体ジャンル・質感・密度の軸で振り分け、手癖外の1案を必須にした。定番ルックを R04(d) として明記(EXP-001、83.5 → 86.4)。
- DESIGN.md テンプレート: 値を空欄にし、*Looks used* 台帳を追加(huashu-design の「見た目の台帳」の考え方)。Google 形式の DESIGN.md も読める。
- 新チェック: R16(宣言したのに読み込まれないフォント)、R17(容器からのはみ出し、切り取り、数字の途中での折り返し)。R14 の行間判定はレンダー側に移し、数字・ラベル・見出しでの誤検知をなくした。集計系の R06・R07・R08・R16 で keep 指定が効くようにした。
- handoff.md: shadcn/ui などのコンポーネント集や Figma・Canva と組むときの分担。
- 評価: 複数モデルでの審査に対応(judge.<model>.json を平均し、ばらつきを表示)。スキルを run ごとにスナップショットする。見た目の多様性(地の明度、影、角丸、書体)を計測。

## 0.1.0 — 2026-10-30

- 初版。frontend-design、UI/UX Pro Max、Taste、Impeccable、Hallmark、Vercel web-design-guidelines、ui-skills、interface-design、Emil Kowalski skills、elayadesign/ai-design-skills の長所を統合(比較は `docs/comparison.md`)。
- モード: build / redesign / audit / steer / system / retro。予算: quick / standard / deep。
- 依存ゼロの lint(Floor 12 / Reflex 15 / Finish 8 のチェックID)、トークン検査、Playwright によるレンダーチェック(任意)。
- 評価ケース6件、ルーブリック、評価ランナー、改善ループの手順。
- Claude Code / Cursor / Codex 用のビルドとインストーラ。
