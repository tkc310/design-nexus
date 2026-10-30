# Xで話題のデザイン系エージェントスキル（2026年10月下旬）

確認日: 2026-10-31。スター数は 2026-10-30 23時台 UTC に GitHub API の `stargazers_count` を取得した値。リポジトリ全体の数であり、スキル単体のインストール数ではない。

[comparison.md](comparison.md) は、スター数と技術記事で繰り返し名前が出る10スキルの仕組み比較です。この文書は、その10件を繰り返さず、2026年10月下旬に X で話題になっているもの、および同時期に公式配布が確認できる Figma / Canva / デザインシステム系をまとめます。10件の中身・短所・design-nexus への取り込みは comparison.md を見てください。

## 調査方法と限界

- 対象は、UI・フロントの見た目か、デザインシステム、Figma、Canva を扱う Agent Skill（`SKILL.md` または公式プラグイン）。コードの書き味だけを直すスキルは対象外です。
- x.com は直接開くと 403 でした。投稿 URL は、公開ミラーで本文の日付と文言を確認できたものだけを「確認したX」に書いています。ミラーは nitter.gq、unrollnow、rattibha です。いいね数やリポスト数は載せていません。
- SkillsMP が「Xに投稿がある」と索引していても、status URL の本文を確認できなかったものは未確認です。
- フォローやリポストを条件に DM で配る、という投稿は、公開リポジトリを確認できなかったので載せていません。
- 短所は README・公式ドキュメントに書いてある制約から取っています。動作確認（実際に画面を生成させること）はしていません。

## 総合表

| スキル | 作者 / 正本 | リポジトリ★ | 確認したX | 種別 |
|---|---|---|---|---|
| **pstack** の experience-first / exhaust-the-design-space | [Lauren Tan（poteto）](https://github.com/cursor/plugins/tree/main/pstack) | 14,714（[cursor/plugins](https://github.com/cursor/plugins) 全体。pstack 単体は不明） | [2026-05-25 の記事](https://x.com/poteto/status/2058975157503570132)。10月の新スレは未確認 | 原則（UIの探索を含む） |
| **Jakub Krehel skills** | [jakubkrehel/skills](https://github.com/jakubkrehel/skills) | 9,351 | [2026-10-25 `/teardown`](https://x.com/jakubkrehel/status/2114379959263502712) | 界面の測定・レビュー（同梱の teardown は図版） |
| **huashu-design** | [alchaincyf/huashu-design](https://github.com/alchaincyf/huashu-design) | 28,225 | [2026-10-23 の 3.0 発表](https://x.com/AlchainHust/status/2113650413170049529) | HTML 成果物（原型・スライド・情報図） |
| **Stitch skills** と **DESIGN.md** | [stitch-skills](https://github.com/google-labs-code/stitch-skills) / [design.md](https://github.com/google-labs-code/design.md) | 8,641 / 28,664 | [2026-03-18 の Stitch スレ](https://x.com/stitchbygoogle/status/2034332847893574080)。10月の新スレは未確認 | デザインシステム仕様と Stitch 連携 |
| **Figma MCP skills** | [figma/mcp-server-guide](https://github.com/figma/mcp-server-guide) | 2,131 | 未確認 | デザインファイルの読み書き |
| **Canva skills** | [canva-sdks/canva-skills](https://github.com/canva-sdks/canva-skills) | 140 | 未確認 | Canva 上の編集・品牌・書き出し |
| **shadcn/ui skill** | [公式](https://ui.shadcn.com/docs/skills)（リポジトリは [shadcn-ui/ui](https://github.com/shadcn-ui/ui)） | 126,994（コンポーネント集全体） | 未確認 | 既存コンポーネントの入れ方 |

comparison.md にある10件のうち、10月に本文を確認できた X は Taste Skill の v2 発表だけです。[2026-10-13](https://x.com/LexnLin/status/2110122106537050584)。中身は [comparison.md の Taste の行](comparison.md) を見てください。frontend-design の公開告知は [2025-11-13](https://x.com/trq212/status/1989061937590837678) で、10月の新しい告知スレは未確認です。10月に読めたのは技術記事側です。

## pstack（UIに関係する原則だけ）

pstack は Lauren Tan（[@poteto](https://x.com/poteto)）が Cursor で使っている作業手順のプラグインです。UIに関係するのは次の二つです。

- `experience-first`: 実装の都合と使う人の体験が衝突したら体験を取る。機能は少なく、磨いて出す。
- `exhaust-the-design-space`: コードベースに先例がない UI のインタラクションでは、2〜3個の試作品を並べてから採用する。

`/unslop` は文章から AI の言い回しを除くスキルです。画面の見た目は扱いません。

**入れ方。** Cursor では `/add-plugin pstack`。Claude Code では `/plugin marketplace add cursor/plugins` のあと `/plugin install pstack@cursor-plugins`。入り口は `/poteto-mode` です。出典は [pstack の README](https://github.com/cursor/plugins/blob/main/pstack/README.md)。

**強いところ。** 方向を一つに決め打ちする前に、並んだ案を比べる、という手順がスキルに書いてあります。design-nexus の build が「3案から選ぶ」のと同じ種類の制約です。

**注意。** 2026-05-25 の X 記事（[status/2058975157503570132](https://x.com/poteto/status/2058975157503570132)）が公開の起点です。本文の全文は x.com が 403 のため未取得で、URL と日付は LinkedIn の同日投稿と公開ミラーの引用で確認しました。中身の確認は README です。プラグインは Cursor のモデル名やサブエージェントに依存する手順を含みます。視覚の品質チェック（コントラスト、幅、スロップ検出）はありません。

**design-nexus との関係。** 併用して視覚の権威を二つにしないでください（[SKILL.md の優先順位](../skills/design-nexus/SKILL.md)）。読むなら `exhaust-the-design-space` が、build の3案と deep のヒーロー単独レビューに抜けがないかの照合材料になります。

## Jakub Krehel skills

[jakubkrehel/skills](https://github.com/jakubkrehel/skills) は、界面を分野ごとに測るスキル集です。README（2026-10-25 更新）にある主な名前は次のとおりです。

| スキル | 役割 |
|---|---|
| `better-interface` | 分野別スキルを束ねて、画面全体を一つの報告にまとめる |
| `better-ui` | 角丸、影、アイコン、モーションの具体値 |
| `better-typography` | スケール、折り返し、省略、約物 |
| `better-colors` | パレット、意味トークン、コントラスト |
| `better-layout` | グルーピング、リサイズ、翻訳、RTL |
| `better-accessibility` | キーボード、ARIA、フォーム、WCAG 2.2 |
| `better-writing` | ラベル、エラー、空状態 |
| `interface-review` | ブランチや差分が壊した界面 |
| `build-design` | Figma または画像を、プロジェクトのトークンとコンポーネントで実装する |
| `variant` / `break` / `state-machine` | バリアント、ストレス、状態の列挙 |
| `teardown` | 物体の分解図。SVG / PNG |

**入れ方。** `npx skills add jakubkrehel/skills`。Claude Code では `/plugin marketplace add jakubkrehel/skills` のあと `/plugin install interfaces@interfaces`。

**確認したX。** 2026-10-25 の投稿は `/teardown` の追加です。「Added a new skill: /teardown」。インストールコマンドも本文にあります（[status/2114379959263502712](https://x.com/jakubkrehel/status/2114379959263502712)、nitter.gq で本文を確認）。拡散したのは分解図の方で、`better-*` の個別スレは未確認です。

**強いところ。** 分野が分かれていて、数値で指摘する書き方です。`build-design` は Figma MCP が無い状態で値を推測して実装することを禁じています。

**注意。** 10月25日の投稿が広めている `/teardown` は、物体の分解図です。同じリポジトリを丸ごと常時読み込むと、design-nexus の方向性と指示が重なります。スター 9,351 はリポジトリ全体です。

**design-nexus との関係。** 最初に読む価値があるのは `better-colors`、`better-typography`、`better-layout`、`better-accessibility` です。チェック ID の次の仮説（[references/checks.md](../skills/design-nexus/references/checks.md)）の材料にできます。スキルとしてはインストールせず、1仮説ずつ [loop/IMPROVEMENT.md](../loop/IMPROVEMENT.md) に載せるのがこのリポジトリの手順です。

## huashu-design

花叔（[@AlchainHust](https://x.com/AlchainHust)）の [huashu-design](https://github.com/alchaincyf/huashu-design) は、一言から HTML の原型、編集できる PPTX、情報図、アニメを出すスキルです。2026-10-23 の投稿が 3.0 の発表です（[status/2113650413170049529](https://x.com/AlchainHust/status/2113650413170049529)、nitter.gq で「huashu-design 3.0发布！」を確認）。

README が説明する 3.0 の流れは、六つのサムネイルから三方向を実物にし、84種のスタイル見本（App と、中文・東アジアの区分を含む）を持ち、参照作品はスクリーンショットを見てから借り、見た目の台帳で過去の成果と被るのを避ける、というものです。

**入れ方。** `npx skills add alchaincyf/huashu-design`。README は Claude Code、Cursor、Codex を含む、`SKILL.md` を読むエージェント向けと書いています。ライセンスは 2026-05-14 以降 MIT。

**強いところ。** 方向をユーザーが選ぶまで実装に進まない、というゲートがファイルとして残ります。東アジアの組版がスタイル庫に入っています。design-nexus の和文指針が「欧文スキルには無い」と書いた穴に、公開のスキル側から近い記述があります。

**注意。** 本文は中国語です。成果物は HTML の視覚納品で、README は本番の Web アプリやバックエンド付きシステムを対象外にしています。デザイン検査は同梱の Python スクリプトです。design-nexus の依存ゼロの lint とはランタイムが違います。スター 28,225 は 2026-10-30 の API 値で、同日の README 表示や SkillsMP の索引とは一致しません。この文書は API の値だけを使います。

**design-nexus との関係。** スキルごと重ねないでください。読むならスタイル庫の東アジア区分と、成果物の見た目を台帳に残して次で避ける、という考え方です。後者は [retro](../skills/design-nexus/references/retro.md) と [loop/feedback.md](../loop/feedback.md) に近いです。和文の規則を取り込むなら、中国語の見本をそのまま採用せず、[references/japanese.md](../skills/design-nexus/references/japanese.md) 向けの1仮説にします。

## Google Stitch のスキルと DESIGN.md

二つに分かれます。

- [google-labs-code/design.md](https://github.com/google-labs-code/design.md)（★28,664、最終 push 2026-10-16）は、エージェント向けの視覚仕様です。YAML のトークンと、散文の理由を一つの `DESIGN.md` に書きます。検証は `npx @google/design.md lint DESIGN.md`。仕様の状態は README 上 `alpha` です。
- [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills)（★8,641、最終 push 2026-08-17）は Stitch MCP 用のスキル集です。画面生成、コードからの `DESIGN.md` 抽出、デザインシステムの適用、`design-md`、`taste-design` などを含みます。

**入れ方。** 仕様の lint は上記の `npx` です。スキル集は README の例では、Claude Code に `npx plugins add google-labs-code/stitch-skills --scope project --target claude-code`、Cursor に `--scope workspace --target cursor` です。個別なら `npx skills add google-labs-code/stitch-skills --skill design-md`。Stitch の画面生成は Stitch 側のプロジェクトが要ります。

**確認したX。** 公式アカウントの 2026-03-18 のスレ（[status/2034332847893574080](https://x.com/stitchbygoogle/status/2034332847893574080)）が、デザインシステムと `DESIGN.md` の書き出し・読み込みを機能として紹介しています。本文は rattibha のスレ写しで確認しました。10月の新しい告知 URL は未確認です。10月に動いているのは `design.md` リポジトリの push です。

**強いところ。** トークンが機械可読で、コントラストを lint が JSON で返します。design-nexus が `DESIGN.md` を唯一の真実にしているのと同じ問題を、別のファイル形式で解いています。

**注意。** 形式は alpha です。design-nexus のテンプレートは、[tokens-check.mjs](../skills/design-nexus/scripts/tokens-check.mjs) が読む `tokens` フェンスです。Google の形式は YAML のフロントマターです。Stitch の画面生成スキルは、Stitch 上のプロジェクトに対して動きます。`taste-design` の所在は stitch-skills で、comparison.md の Taste Skill とはリポジトリが違います。

**design-nexus との関係。** テンプレートを Google 形式に置き換えないでください。突き合わせるなら、トークン名と「散文で理由を残す」層です。コントラストの決定的検査は既に [tokens-check.mjs](../skills/design-nexus/scripts/tokens-check.mjs) にあります。

## Figma の MCP スキル

Figma 公式のスキルは、Figma MCP のツールの使い方をエージェントに教える Markdown です。ヘルプが列挙している名前は、`figma-use`（キャンバスへの書き込みの基礎）、`figma-use-figjam`、`figma-use-slides`、`figma-swiftui`、`figma-code-connect`、`figma-create-new-file`、`figma-generate-diagram`、`figma-code-workflows`、`figma-spec`、例として `figma-generate-design` と `figma-generate-library` です。`figma-generate-design` の `SKILL.md` は 2026-10-28 に更新されています（[ファイル](https://github.com/figma/mcp-server-guide/blob/main/skills/figma-generate-design/SKILL.md)）。

**入れ方。** ヘルプはプラグイン同梱を勧めています。Claude Code は `claude plugin install figma@claude-plugins-official`。Cursor はチャットで `/add-plugin figma` のあと、MCP の Figma を接続します。リモートサーバは `https://mcp.figma.com/mcp`。スキル単体は [mcp-server-guide](https://github.com/figma/mcp-server-guide) からも取れます。

**確認したX。** 未確認です。10月の根拠は公式ヘルプと、10月28日のリポジトリ更新です。

**強いところ。** 公開済みのコンポーネントと変数を再利用して画面を組み立てる、と `figma-generate-design` が書いてあります。コード側の `DESIGN.md` とは別に、Figma ファイルが成果物のときの手順です。

**注意。** ヘルプは、キャンバスへの書き込みがベータで、対応プランとシートに制限があると書いています。Starter や View / Collab はツール呼び出しが月6回まで、という記載もあります。書き込み結果は手直しが要ることがある、とも書いてあります。Figma アカウントとファイルが無いと動きません。

**design-nexus との関係。** 画面の方向性と Floor は design-nexus のままにします。Figma スキルは、採用した方向を Figma の編集可能なレイヤーとして残すときに足します。スクリーンショットを成果物の全面に貼ることは、`figma-generate-design` 自身が禁止しています。

## Canva のスキル

[canva-sdks/canva-skills](https://github.com/canva-sdks/canva-skills)（★140、最終 push 2026-10-23、Apache-2.0）は、Canva MCP 経由で既存デザインを扱うプラグインです。README が有効としているスキルは六つです。

| スキル | 役割 |
|---|---|
| `edit-design` | 承認してからコミットする編集 |
| `resize-for-social-media` | Facebook / Instagram / LinkedIn 向けのリサイズ |
| `bulk-create` | 表の1行につき1デザイン。オートフィルは Canva Enterprise |
| `brand-check` | ブランドキットとの差分。色・書体・ロゴ・トーン |
| `get-design-feedback` | 階層、コピー、余白、コントラストの読み取り専用講評 |
| `implement-feedback` | コメントスレッドを読んで、API が可能な変更を適用 |

**入れ方。** ホストは `https://mcp.canva.com/mcp` に接続して Canva にサインインします。Claude Code は `/plugin marketplace add canva-sdks/canva-skills` のあと `/plugin install canva@canva-skills`。Codex は `codex plugin marketplace add canva-sdks/canva-skills` から。Cursor はリポジトリの `.cursor-plugin` をマーケットプレイスとして使う、と README にあります。

**確認したX。** スキル発表の status URL は未確認です。Canva MCP の一般提供は、2026-10-07 の開発者コミュニティ投稿で確認しました。[コミュニティ告知](https://community.canva.dev/t/the-wait-list-is-over-canva-mcp-server-is-now-generally-available/8942)。

**強いところ。** 編集が承認ゲート付きです。品牌チェックは「オブランド / オフブランド / 検証できない」を分けます。フロントのコード生成とは別の成果物（ソーシャル画像、デッキ）を扱います。

**注意。** スターは 140 で、この一覧のなかでは小さいです。話題性は X の本文では確認できていません。`bulk-create` は Enterprise のオートフィルが要ります。API ができない変更は人手のチェックリストに残ります。

**design-nexus との関係。** ランディングやプロダクト UI の代替にはなりません。ブランドキットとソーシャル書き出しが成果物に含まれる仕事で、design-nexus の画面検査の隣に置くスキルです。

## shadcn/ui のスキル

公式ドキュメント（[ui.shadcn.com/docs/skills](https://ui.shadcn.com/docs/skills)、この調査で開いた版）は、`components.json` を読み、`shadcn info --json` でフレームワーク、エイリアス、導入済みコンポーネント、アイコンを注入し、CLI とレジストリと MCP の使い方をエージェントに教える、と説明しています。視覚の方向性は決めません。

**入れ方。** ドキュメントの pnpm の例は `pnpm dlx skills add shadcn/ui` です。npm / yarn / bun のタブは同じページにあります。この調査でコマンド文として確認したのは pnpm の例だけです。`shadcn/ui` は GitHub 上 [shadcn-ui/ui](https://github.com/shadcn-ui/ui) に解決し、スター 126,994 はそのコンポーネント集全体です。

**確認したX。** 未確認です。10月の根拠は公式ドキュメントと、リポジトリの 2026-10-30 の push、および同月の技術記事がインストール例に挙げていることです。

**強いところ。** プロジェクトに既にある shadcn の設定に合わせてコンポーネントを足します。存在しない部品をゼロから描く前に、レジストリを探す手順です。

**注意。** `components.json` が無いプロジェクトでは、ドキュメントの説明どおりには起動条件を満たしません。コンポーネントの見た目のデフォルト（角丸、ニュートラルなカード）を、題材の方向性より優先すると、comparison.md が言う「定番ルック」に寄ります。

**design-nexus との関係。** shadcn を採用しているアプリでは、部品の API とファイル配置をこのスキルに任せ、色・書体・密度・シグネチャは `DESIGN.md` と design-nexus に残します。二つのスキルを同格のアートディレクターとして読ませない、という [SKILL.md](../skills/design-nexus/SKILL.md) の規則のままです。

## 本文を確認できなかったもの

次はリポジトリか索引までは見ましたが、10月の X 本文は未確認なので、詳細な推奨からは外しています。

| 名前 | 確認できたこと | X |
|---|---|---|
| [superdesigndev/superdesign-skill](https://github.com/superdesigndev/superdesign-skill) | ★923。最終 push は 2026-08-21。キャンバス上で方向を探して UI を反復する、と README にある | 10月の status URL は未確認 |
| [21st-dev/magic-mcp](https://github.com/21st-dev/magic-mcp) の `21st-ui` | ★6,322。最終 push は 2026-09-09。カタログから React / Tailwind の部品を探す | SkillsMP は 2026-10-16 の投稿を索引している。status URL は未確認。プラグイン用 [claude-code-plugin](https://github.com/21st-dev/claude-code-plugin) は ★21 |
| Taste Skill v2.1（ダッシュボード対応） | リポジトリ README が、v2.1 でアプリ画面を別ルートにしたと書いている。push は 2026-10-30、★106,291 | 確認できた投稿は 10月13日の v2 発表。10月20日分として SkillsMP が要約している投稿の URL は未確認。仕組みの比較は [comparison.md](comparison.md) |

## このリポジトリで先に試すもの

ここでの「試す」は、メンテナが次の1仮説を選ぶときの読書順です。[SKILL.md](../skills/design-nexus/SKILL.md) は、他のデザインスキルを同格の権威として読まない、と書いています。

1. **Jakub Krehel の `better-colors` / `better-typography` / `better-layout` / `better-accessibility`。** 10月25日にリポジトリが動いていて、値が測定できる書き方です。チェックを増やすなら、この四つのどれか一つを仮説にして [eval](../eval/rubric.md) にかけてください。同日の X で広がった `/teardown` は分解図なので、Floor の材料にはしません。
2. **Google の DESIGN.md 仕様。** [templates/DESIGN.md](../skills/design-nexus/templates/DESIGN.md) とトークンの名前を突き合わせる対象です。ファイル形式の置き換えは、lint が読んでいる `tokens` ブロックを壊します。仕様は alpha です。
3. **huashu-design の東アジアの見本と、見た目の台帳。** 和文組版と、プロジェクトをまたいで同じ顔に寄る問題の読書材料です。スキル本体は中国語の HTML 納品用なので、design-nexus に同居させません。

pstack の二つの原則は、既にある「3案」と「ブリーフが勝つ」の抜け確認に使います。Figma スキルは、成果物が Figma ファイルである仕事にだけ足します。Canva はソーシャルとブランドキットの仕事にだけ足します。shadcn スキルは、そのコンポーネント集を既に使っているリポジトリで、部品の入れ方として足します。

Taste、frontend-design、Impeccable を含む comparison.md の10件は、長所を既に折り込み済みです。10月の Taste v2 発表は「方向、実素材、ブラウザ確認」を改めて公にしたもので、design-nexus の build ループが受けている範囲です。横に足すと指示が衝突します。

## 出典

- [cursor/plugins pstack README](https://github.com/cursor/plugins/blob/main/pstack/README.md)
- [Lauren Tan、2026-05-25](https://x.com/poteto/status/2058975157503570132)
- [jakubkrehel/skills](https://github.com/jakubkrehel/skills)
- [Jakub Krehel、2026-10-25](https://x.com/jakubkrehel/status/2114379959263502712)
- [alchaincyf/huashu-design](https://github.com/alchaincyf/huashu-design)
- [花叔、2026-10-23](https://x.com/AlchainHust/status/2113650413170049529)
- [google-labs-code/design.md](https://github.com/google-labs-code/design.md)
- [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills)
- [Stitch by Google、2026-03-18](https://x.com/stitchbygoogle/status/2034332847893574080)
- [Figma skills for MCP](https://help.figma.com/hc/en-us/articles/39166810751895-Figma-skills-for-MCP)
- [figma/mcp-server-guide](https://github.com/figma/mcp-server-guide)
- [canva-sdks/canva-skills README](https://github.com/canva-sdks/canva-skills/blob/main/README.md)
- [Canva MCP 一般提供、2026-10-07](https://community.canva.dev/t/the-wait-list-is-over-canva-mcp-server-is-now-generally-available/8942)
- [shadcn/ui Skills](https://ui.shadcn.com/docs/skills)
- [Leon Lin、TasteSkill v2、2026-10-13](https://x.com/LexnLin/status/2110122106537050584)
- [Thariq、frontend-design、2025-11-13](https://x.com/trq212/status/1989061937590837678)
- スター数と仕組みの比較: [comparison.md](comparison.md)
