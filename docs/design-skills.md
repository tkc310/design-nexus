# Xで話題のデザイン系エージェントスキル（2026年8月〜10月）

確認日: 2026-10-31。X の検索は同日 12:39〜12:48 JST。スター数は同日 12:45 JST 頃に GitHub API の `stargazers_count` を取得した値で、リポジトリ全体の数です。スキル単体のインストール数ではありません。反応数（L=いいね、RT=リポスト、V=表示回数、BM=ブックマーク）も同じ頃のスナップショットで、今後も変動します。投稿日時は API の UTC を JST（UTC+9）に変換しています。変換していないものは本文に（UTC）と書いています。

[comparison.md](comparison.md) は、2026-10-30 にリポジトリページで見たスターと、README から読んだ仕組みの比較です。スターの取得日が違うので、同じリポジトリでもこの文書の数と一致しません。仕組みの長所・短所・design-nexus への取り込みは comparison.md を見てください。この文書は、X の投稿を検証できた範囲で、話題・日付・反応を記録します。

手法そのもののデータベースは [design-trends/](design-trends/README.md) です。ヒアリングで流行を取り入れたいと分かったときだけスキルが引きます。AGENTS.md と CLAUDE.md からは読み込みません。

## 調査方法と限界

- 対象期間はおおむね 2026-08-01〜2026-10-31 です。起点として 2026-07 の投稿も書いています。対象は、UI やビジュアル、デザインシステム、Figma、Canva、モーション、図版を扱うエージェントスキル（Claude Code / Cursor / Codex の skills、plugins、MCP 連携）です。
- X は公開投稿のアーカイブ検索（`start_time` 指定、relevancy 順、最大 25 件／回）と、投稿 ID を指定した本文・展開 URL の取得です。2026-10-31 12:39〜12:48 JST に実行し、403 は出ていません。話題性を確認できなかった項目は、判定にその旨を書いています。
- 本文がリンクだけの X 記事（`x.com/i/article/...`）は、中身を API から取れません。該当は「本文未確認」です。
- 判定は次の三つです。**検証済み**: 投稿を取得し、リポジトリの存在も GitHub API で確認した。**一部検証**: X 上の言及はあるが、作者本人の告知が見つからない、または話題量が小さい。**未確認**: 該当する投稿や事実を確認できなかった。
- 入れ方や短所のうち、前回文書が README・公式ヘルプから写している手順は、各節に残しています。今回の検証は投稿とスターの確認で、画面を生成させる動作確認はしていません。

## 総合表

| # | 名前 | 作者 / 正本 | ★（10/31 12:45 JST 頃） | 代表的な X（JST） | 判定 |
|---|---|---|---|---|---|
| 1 | **Figma MCP skills** | [figma/mcp-server-guide](https://github.com/figma/mcp-server-guide) | 2,131 | [@figma 2026-08-14](https://x.com/figma/status/2087944862272459214) L410／[2026-10-01](https://x.com/figma/status/2105329949548912914) L917 | 検証済み |
| 2 | **Canva skills** | [canva-sdks/canva-skills](https://github.com/canva-sdks/canva-skills) | 141 | スキル単体の告知は見つからず。[Claude Duet 2026-10-22](https://x.com/canva/status/2113032486569775465) L171 | 一部検証 |
| 3 | **shadcn/ui skill** | [@shadcn](https://x.com/shadcn) / [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | 127,003 | [2026-10-10](https://x.com/shadcn/status/2108574564586332615) L4,115 | 検証済み |
| 4 | **Superdesign** | [superdesign-skill](https://github.com/superdesigndev/superdesign-skill) | 923（旧拡張 7,559） | [@RoundtableSpace 2026-10-14](https://x.com/RoundtableSpace/status/2110255627704455591) L3,703 | 検証済み（注意あり） |
| 5 | **21st.dev** | [magic-mcp](https://github.com/21st-dev/magic-mcp) / [skill](https://github.com/21st-dev/skill) | 6,323 / 32 | [@21st_dev 2026-09-19](https://x.com/21st_dev/status/2101077375765086588) L9 | 一部検証 |
| 6 | **Taste Skill v2.1** | [@LexnLin](https://x.com/LexnLin) / [taste-skill](https://github.com/Leonxlnx/taste-skill) | 106,415 | [2026-10-21](https://x.com/LexnLin/status/2112674349132194185) L1,519 | 検証済み |
| 7 | **Jakub Krehel skills** | [jakubkrehel/skills](https://github.com/jakubkrehel/skills) | 9,395 | [/teardown 2026-10-26](https://x.com/jakubkrehel/status/2114379959263502712) L6,083 | 検証済み（日付を訂正） |
| 8 | **huashu-design 3.0** | [alchaincyf/huashu-design](https://github.com/alchaincyf/huashu-design) | 28,237 | [3.0 告知 2026-10-17](https://x.com/AlchainHust/status/2111447668652220768) L257 | 検証済み（日付を訂正） |
| 9 | **Stitch skills** と **DESIGN.md** | [stitch-skills](https://github.com/google-labs-code/stitch-skills) / [design.md](https://github.com/google-labs-code/design.md) | 8,642 / 28,667 | [@hisevenih 2026-08-19](https://x.com/hisevenih/status/2089902672107217206)／[@Mnilax 2026-10-14](https://x.com/Mnilax/status/2110382356028686598) | 検証済み |
| 10 | **pstack** の principles | [@poteto](https://x.com/poteto) | 公式 URL は未確認。移植版 3,667 | [2026-10-15](https://x.com/poteto/status/2110496830429839869) L3,434 | 検証済み（デザインスキルではない） |
| 11 | **Hallmark** | [@nutlope](https://x.com/nutlope) / [Nutlope/hallmark](https://github.com/Nutlope/hallmark) | 43,079 | [@trending_repos 2026-10-27](https://x.com/trending_repos/status/2115052997134741743) L338 | 検証済み |
| 12 | **Impeccable** | [@pbakaus](https://x.com/pbakaus) / [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | 97,207 | まとめ投稿が複数。下の節 | 検証済み |
| 13 | **UI UX Pro Max** | [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | 143,070 | [@Mnilax 2026-10-14](https://x.com/Mnilax/status/2110382356028686598) L408 | 検証済み |
| 14 | **Emil Kowalski skills** | [emilkowalski/skills](https://github.com/emilkowalski/skills) | 52,060 | [@nett0eth 2026-08-18](https://x.com/nett0eth/status/2089669588543840460) L185 | 一部検証 |
| 15 | **モーション系スキル群** | LottieFiles、GSAP、Remotion、HeyGen ほか | 下の節 | [@Voxyz_ai 2026-10-10](https://x.com/Voxyz_ai/status/2108905392776360333) L532 | 検証済み |
| 16 | **Anatomy／図解系** | [wheresryan22/anatomy](https://github.com/wheresryan22/anatomy) ほか | 23,066 | [@RoundtableSpace 2026-10-17](https://x.com/RoundtableSpace/status/2111234483139510507) L493 | 検証済み |
| 17 | **ai-design-skills** | [@elayadesigns](https://x.com/elayadesigns) / [elayadesign/ai-design-skills](https://github.com/elayadesign/ai-design-skills) | 12,906 | [@designertom 2026-10-27](https://x.com/designertom/status/2114786186250379759) L176 | 検証済み |
| 18 | **awesome-design-md** | [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) | 124,721 | [@RoundtableSpace 2026-10-22](https://x.com/RoundtableSpace/status/2113106821091143750) L248 | 検証済み |
| 19 | **Open Analytics DESIGN-SKILL** | [@uaghazadae](https://x.com/uaghazadae) | 未確認 | [2026-08-21](https://x.com/uaghazadae/status/2090525353940820049) L603 | 一部検証 |
| 20 | **Paper MCP + Refero** | Paper / Refero | — | [@robj3d3 2026-08-11](https://x.com/robj3d3/status/2086883206301925800) L1,750 | 検証済み（ワークフロー） |
| 21 | **Open Design** | [nexu-io/open-design](https://github.com/nexu-io/open-design) | 105,063 | まとめ投稿での言及のみ | 一部検証 |

## Figma の MCP スキル

Figma 公式の MCP サーバー向けスキル群です。`figma/mcp-server-guide`（★2,131）の `skills/` には、GitHub API で確認した範囲で `figma-use`、`figma-generate-design`、`figma-generate-library`、`figma-design-to-code`、`figma-code-connect`、`figma-implement-motion`、`figma-shaders`、`figma-spec`、`figma-swiftui`、`figma-use-figjam`、`figma-use-slides`、`figma-use-motion` などがあります。これとは別に、Figma の中でスキルを作り、Community に公開し、`/` コマンドで呼ぶ機能もあります。参考として GLips/Figma-Context-MCP は ★16,125 です。

**入れ方。** 前回文書が公式ヘルプから写した手順は、プラグイン同梱です。Claude Code は `claude plugin install figma@claude-plugins-official`。Cursor はチャットで `/add-plugin figma` のあと、MCP の Figma を接続します。リモートサーバは `https://mcp.figma.com/mcp`。スキル単体は [mcp-server-guide](https://github.com/figma/mcp-server-guide) からも取れます。

**確認したX。** 前回「未確認」だった投稿を、今回取得しています。

- [2026-08-14 01:50 JST、@figma](https://x.com/figma/status/2087944862272459214)「You can now create and use skills without leaving Figma」 L410 / RT53 / V50,600
- [2026-10-01 01:12 JST、@figma](https://x.com/figma/status/2105329949548912914)。アニメーションスタイルを Figma agent と MCP 経由で適用し、skills から参照できる。L917 / RT78 / V1,533,714
- [2026-10-15 15:26 JST、@figma](https://x.com/figma/status/2110618179982749940)。Config India で Code Layers、Specs、Guidelines、Code Sources を発表。L981 / RT69 / V7,224,396
- [2026-10-06 23:03 JST、@figma](https://x.com/figma/status/2107471912704327937)。Figma agent が正式版に。L1,615 / RT117 / V1,430,859
- [2026-10-13、@ChuckHTF](https://x.com/ChuckHTF/status/2109736095575634020)「figma's agent now reads library guidelines and custom skills」 L9
- [2026-09-03（UTC）、@adityamuttur](https://x.com/adityamuttur/status/2095476645062983840)。Figma 側の担当者とみられる人物が「figma-use skill」の slots API に言及。L1

[@Mnilax のまとめ（2026-10-14、L408）](https://x.com/Mnilax/status/2110382356028686598) にも、`figma/mcp-server-guide`、`Figma-Context-MCP`、`grab/cursor-talk-to-figma-mcp`、Penpot 公式 MCP が並んでいます。

**強いところ。** 公開済みのコンポーネントと変数を再利用して画面を組み立てる、と `figma-generate-design` が書いてあります。コード側の `DESIGN.md` とは別に、Figma ファイルが成果物のときの手順です。

**注意。** 前回文書がヘルプから写した制約は、キャンバスへの書き込みがベータで、対応プランとシートに制限がある、というものです。Starter や View / Collab はツール呼び出しが月6回まで、という記載もあります。書き込み結果は手直しが要ることがある、とも書いてあります。Figma アカウントとファイルが無いと動きません。

**design-nexus との関係。** 画面の方向性と Floor は design-nexus のままにします。Figma スキルは、採用した方向を Figma の編集可能なレイヤーとして残すときに足します。スクリーンショットを成果物の全面に貼ることは、`figma-generate-design` 自身が禁止しています。

**判定。** 検証済み。前回の「未確認」は解消しています。

## Canva のスキル

[canva-sdks/canva-skills](https://github.com/canva-sdks/canva-skills)（★141、作成 2025-12-12、最終 push 2026-10-24 03:21 JST）は、Canva Connector（MCP）を使う公式スキル集です。`plugins/canva/` という一つのプラグインパッケージで、Claude、Cursor、Codex、Antigravity のマーケットプレイスに対応します。README には `resize-for-social-media` などが載っています。前回文書が有効としていた六つは次のとおりです。

| スキル | 役割 |
|---|---|
| `edit-design` | 承認してからコミットする編集 |
| `resize-for-social-media` | Facebook / Instagram / LinkedIn 向けのリサイズ |
| `bulk-create` | 表の1行につき1デザイン。オートフィルは Canva Enterprise |
| `brand-check` | ブランドキットとの差分。色・書体・ロゴ・トーン |
| `get-design-feedback` | 階層、コピー、余白、コントラストの読み取り専用講評 |
| `implement-feedback` | コメントスレッドを読んで、API が可能な変更を適用 |

**入れ方。** ホストは `https://mcp.canva.com/mcp` に接続して Canva にサインインします。Claude Code は `/plugin marketplace add canva-sdks/canva-skills` のあと `/plugin install canva@canva-skills`。Codex は `codex plugin marketplace add canva-sdks/canva-skills` から。Cursor はリポジトリの `.cursor-plugin` をマーケットプレイスとして使う、と README にあります。

**確認したX。** 「canva-skills」「canva skill(s)」で検索しても、スキル単体の告知や話題投稿は見つかりませんでした。関連として取れたのは次です。

- [2026-10-22 07:19 JST、@canva](https://x.com/canva/status/2113032486569775465)「Connect Canva to Claude Duet」 L171 / RT26 / V14,169
- [2026-10-23、@canva](https://x.com/canva/status/2113389030851375442)。Brush（新しいエージェント）について「Available via public API. MCP coming soon!」 L4
- [2026-10-11（UTC）、@TheEmma101](https://x.com/TheEmma101/status/2109371628606091357)。ChatGPT の Canva プラグインで、デザインを Canva 上で編集できる、という投稿。L58
- [2026-09-08（UTC）、@vinitj888](https://x.com/vinitj888/status/2097157906726883391)「Does anyone even use the canva connector in claude or codex?」 L2

**強いところ。** 編集が承認ゲート付きです。品牌チェックは「オブランド / オフブランド / 検証できない」を分けます。フロントのコード生成とは別の成果物（ソーシャル画像、デッキ）を扱います。

**注意。** スターは 141 で、この一覧のなかでは小さいです。X 上で「デザインスキル」として話題になっている証拠は弱いです。話題の中心はコネクタとプラグイン連携のほうです。`bulk-create` は Enterprise のオートフィルが要ります。API ができない変更は人手のチェックリストに残ります。

**design-nexus との関係。** ランディングやプロダクト UI の代替にはなりません。ブランドキットとソーシャル書き出しが成果物に含まれる仕事で、design-nexus の画面検査の隣に置くスキルです。

**判定。** 一部検証。リポジトリは確認済みです。スキル単体が X で話題、という判定には根拠が足りません。

## shadcn/ui のスキル

shadcn/ui 公式のエージェントスキルです。リポジトリの `skills/` には `shadcn` と `migrate-radix-to-base` があります。[shadcn-ui/ui](https://github.com/shadcn-ui/ui) は ★127,003 で、これはコンポーネント集全体の数です。2026-10-10 の更新で DESIGN.md の生成に対応しました。デザインシステムを頼むとプリセットを選び、カラー、トークン、タイプスケール、エレベーション、プリミティブとブロックのスタイルまで一式を生成します。

公式ドキュメント（[ui.shadcn.com/docs/skills](https://ui.shadcn.com/docs/skills)、前回文書が開いた版）は、`components.json` を読み、`shadcn info --json` でフレームワーク、エイリアス、導入済みコンポーネント、アイコンを注入し、CLI とレジストリと MCP の使い方をエージェントに教える、と説明しています。

**入れ方。** ドキュメントの pnpm の例は `pnpm dlx skills add shadcn/ui` です。npm / yarn / bun のタブは同じページにあります。前回の調査でコマンド文として確認したのは pnpm の例だけです。

**確認したX。** 前回「未確認」だった作者の投稿を、今回取得しています。

- [2026-10-10 00:05 JST、@shadcn](https://x.com/shadcn/status/2108574564586332615)「I've made the shadcn/ui skills really good at DESIGN.md」 L4,115 / RT187 / V242,051 / BM4,571
- [2026-07-18、@shadcn](https://x.com/shadcn/status/2078142090177806773)。React Aria 対応（skills も更新）。L2,105
- [2026-09-17、@iamncdai](https://x.com/iamncdai/status/2100246002062278750)。`migrate-radix-to-base` で Base UI へ移行。L79
- [2026-10-24（UTC）、@ctatedev](https://x.com/ctatedev/status/2114058153604137386)。json-render v0.21.3「Better shadcn skill compatibility」 L127

**強いところ。** プロジェクトに既にある shadcn の設定に合わせてコンポーネントを足します。2026-10-10 以降は、DESIGN.md の一式を生成する使い方もあります。

**注意。** `components.json` が無いプロジェクトでは、ドキュメントの説明どおりには起動条件を満たしません。コンポーネントの見た目のデフォルト（角丸、ニュートラルなカード）を、題材の方向性より優先すると、comparison.md が言う「定番ルック」に寄ります。

**design-nexus との関係。** shadcn を採用しているアプリでは、部品の API とファイル配置をこのスキルに任せ、色・書体・密度・シグネチャは `DESIGN.md` と design-nexus に残します。二つのスキルを同格のアートディレクターとして読ませない、という [SKILL.md](../skills/design-nexus/SKILL.md) の規則のままです。

**判定。** 検証済み。前回の「未確認」は解消しています。

## Superdesign

superdesign.dev のデザインエージェントとスキルです。現行のスキルは [superdesigndev/superdesign-skill](https://github.com/superdesigndev/superdesign-skill)（★923、最終 push 2026-08-21、「The design skill for Claude Code, Cursor and any coding agent. Stop shipping AI-slop UI」）です。入れ方は `npx skills add superdesigndev/superdesign-skill`。元の IDE 拡張 [superdesigndev/superdesign](https://github.com/superdesigndev/superdesign)（★7,559、最終 push 2026-06-29）は、歴史として残っていて、現在はメンテされていない、と紹介されています。作者は superdesigndev（@SuperDesignDev）です。

**確認したX。** 前回は 10 月の status URL が未確認でした。今回、拡散したリスト投稿を取得しています。ただしリンク先は旧リポジトリです。

- [2026-10-14 15:25 JST、@RoundtableSpace](https://x.com/RoundtableSpace/status/2110255627704455591)「10 github repos that turn claude code and codex into elite ui designers」の 1 位が「Superdesign Skill」。L3,703 / RT387 / V373,343 / BM9,013。リンク先は旧リポジトリ `superdesigndev/superdesign` でした。同じリストの他項目は、marvkr/better-design、madebymustafa/design-taste、DavidHDev/canvas-ui、paper-design/shaders、ui-layouts、Hyperiux、ibelick/motion-primitives、cursify、trickle です。
- [2026-10-13 18:48 JST、@heyrimsha](https://x.com/heyrimsha/status/2109944361408659650)。同趣旨のリストの 1 位。L645 / RT66 / V56,295
- [2026-08-03、@DanKornas](https://x.com/DanKornas/status/2084181464812261829)。旧拡張はメンテ終了、という紹介。L19
- [2026-07-20（UTC）、@SuperDesignDev](https://x.com/SuperDesignDev/status/2079175488548053241)。デザインシステムを先に読ませる方針。L209

公式アカウントは最近、別プロダクトの treg（★6,709）を中心に投稿しています。

**design-nexus との関係。** 話題の記録にとどめ、同格のアートディレクターとしては読みません。拡散投稿が指しているのは、メンテ終了と紹介されている旧拡張です。

**判定。** 検証済み。現行スキルと、投稿がリンクしている旧拡張を取り違えないでください。

## 21st.dev（21st MCP と 21st-dev/skill）

1 万 2,000 点以上のコンポーネント、テンプレート、テーマのカタログを、MCP 経由でエージェントに検索・導入させます。旧 Magic MCP は現在「21st MCP」です。セットアップは `npx @21st-dev/cli@latest init` と `npx skills add 21st-dev/skill`。Claude Code 用と Codex 用のプラグインもあります。作者は 21st.dev（@21st_dev、@serafimcloud）です。

リポジトリは [21st-dev/magic-mcp](https://github.com/21st-dev/magic-mcp)（★6,323）、[21st-dev/skill](https://github.com/21st-dev/skill)（★32）、claude-code-plugin（★21）、codex-plugin（★12）です。

**確認したX。**

- [2026-09-19 07:34 JST、@21st_dev](https://x.com/21st_dev/status/2101077375765086588)「We've built a MCP that gives Claude Code, Cursor, and Codex design superpowers」 L9 / RT1 / V1,470
- [@Mnilax の 2026-10-14 の「15 repos」](https://x.com/Mnilax/status/2110382356028686598) の 12 番目が magic-mcp（L408）
- そのほかは「featured on @21st_dev」系の、コンポーネント作者の投稿（L0〜4）が中心です。

**design-nexus との関係。** 存在は確認できています。直近 3 か月の X の反応は小さいので、先に試す読書順には入れていません。

**判定。** 一部検証。前回の「status URL 未確認」は、公式告知（L9）まで確認できました。話題量は小さいままです。

## Taste Skill v2.1（その後の v2.5 言及）

コーディングエージェントに審美眼を与えるスキルです。作者は Leon Lin（@LexnLin）、リポジトリは [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)（★106,415）です。GitHub のリリースは v2.1.1（2026-10-19 08:13 JST）から v2.1.5（2026-10-25 08:44 JST）までを確認しています。仕組みの比較は [comparison.md の Taste の行](comparison.md) です。

v2 は、247 の厳選サイト（Awwwards、One Page Love）をもとに 20 のデザイン方向から 3 つを提示し、オープン画像ライブラリの実画像を使い、ブラウザで確認します。v2.1 ではダッシュボードとアプリに対応しました。ほかに次の変更があります。

- ソフトウェアのランディングページは、偽のモックではなく実際の画面を見せる。
- frame check を追加し、ファーストビューに明確なタイトルがあるか、余白が均等か、整列が揃っているか、空白が空きすぎていないかを点検する。
- モーションのレシピを追加した。
- スキルを 1 本に統合し、旧スタイルは taste-skill-classics、画像系は imagegen-skills に分離した。

**確認したX。** 前回、本文を確認できたのは 10 月 13 日の v2 発表だけで、v2.1（ダッシュボード対応）の URL は未確認でした。今回確認できた作者の告知は v2.1 です。10 月 13 日の URL は、今回の検索結果には含まれておらず、再確認していません。

- [2026-10-21 07:36 JST、@LexnLin](https://x.com/LexnLin/status/2112674349132194185)「TasteSkill v2.1 is out!」 L1,519 / RT62 / V56,947 / BM1,659
- [同日の変更点スレッド](https://x.com/LexnLin/status/2112674354802876906) L16
- [2026-10-24、@AskPerplexity](https://x.com/AskPerplexity/status/2113654262052098312)。Perplexity Computer のスキルマーケットに採用（10/31 まで無料）。L105 / V35,623
- [2026-10-29 08:09 JST、@LexnLin](https://x.com/LexnLin/status/2115581850907480546)「Website made with Sonnet 5.5 using TasteSkill v2.5」 L151。v2.5 は投稿上の言及だけで、GitHub のリリースはまだ確認できません。
- [2026-10-01、@TheUltronAi](https://x.com/TheUltronAi/status/2105552329747656943)。週間トレンドスキルの 1 位が「ui-taste +278K installs」 L13。taste-skill と同一かは未確認です。

**design-nexus との関係。** comparison.md の 10 件に含まれ、build ループが受けている範囲です。横に足すと指示が衝突します。

**判定。** v2.1 の告知は検証済みです。v2.5 のリリースと、「ui-taste」が同一かは未確認のままです。

## Jakub Krehel skills

[jakubkrehel/skills](https://github.com/jakubkrehel/skills)（★9,395）は、デザインエンジニア Jakub Krehel（@jakubkrehel、Interfaces 誌、Interfere）のスキル集です。リポジトリには 14 のスキルがあります。入れ方は `npx skills add jakubkrehel/skills`。前回文書が README から写した Claude Code の手順は、`/plugin marketplace add jakubkrehel/skills` のあと `/plugin install interfaces@interfaces` です。

| 区分 | スキル |
|---|---|
| 領域 | `better-ui`、`better-typography`、`better-colors`、`better-accessibility`、`better-layout`、`better-writing`、`better-interface` |
| 工程 | `interface-review`、`explain-interface`、`break`、`variant`、`state-machine`、`build-design` |
| 図版 | `teardown`。任意の物体を分解図・カットアウェイの技術イラストにする。パーツ、色、注記を調整でき、SVG／PNG で書き出せる |

前回文書が README から写した役割は次のとおりです。`better-interface` は分野別スキルを束ねて画面全体を一つの報告にまとめる。`better-ui` は角丸、影、アイコン、モーションの具体値。`better-typography` はスケール、折り返し、省略、約物。`better-colors` はパレット、意味トークン、コントラスト。`better-layout` はグルーピング、リサイズ、翻訳、RTL。`better-accessibility` はキーボード、ARIA、フォーム、WCAG 2.2。`better-writing` はラベル、エラー、空状態。`interface-review` はブランチや差分が壊した界面。`build-design` は Figma または画像を、プロジェクトのトークンとコンポーネントで実装する。`variant` / `break` / `state-machine` はバリアント、ストレス、状態の列挙です。`explain-interface` は、投稿では Chrome DevTools MCP と組み合わせる使い方が紹介されています。

**日付の訂正。** better-* の初出は 2026-07-13 JST（`/better-ui`、`/better-typography`、`/better-colors`）で、4 スキルの追加が 07-25 です。前回文書は 2026-10-25 の投稿を `/teardown` とし、`better-*` の個別スレは未確認としていました。`/teardown` の公開日時は JST で 2026-10-26 00:34 です。

**確認したX。**

- [2026-10-26 00:34 JST](https://x.com/jakubkrehel/status/2114379959263502712)「Added a new skill: /teardown」 L6,083 / RT282 / V238,657 / BM7,060
- [同日](https://x.com/jakubkrehel/status/2114388628885705087)。teenage engineering の店舗の分解イラストに着想を得た。L85
- [2026-07-13 JST](https://x.com/jakubkrehel/status/2076328529604612467)。`/better-ui` `/better-typography` `/better-colors` を公開。L2,892 / V241,233
- [2026-07-25 JST](https://x.com/jakubkrehel/status/2080683435153117488)。4 スキルを追加。L2,292 / V675,929
- [2026-08-12 JST](https://x.com/jakubkrehel/status/2087200943729164298)。`/interface-review`。L1,726
- [2026-09-04 JST](https://x.com/jakubkrehel/status/2095536111804150211)。16 万インストールを突破。L3,918
- [2026-10-28 JST](https://x.com/jakubkrehel/status/2115113306440491365)。`/explain-interface` を Chrome DevTools MCP と組み合わせる。L845
- [2026-10-30 JST、@AskPerplexity](https://x.com/AskPerplexity/status/2115828571742875737)。`/teardown` が Perplexity Computer に採用。L57 / V20,428
- [2026-09-04 JST、@shao__meng](https://x.com/shao__meng/status/2095691784500506793)。中国語圏での紹介。L327 / V30,523

**強いところ。** 分野が分かれていて、数値で指摘する書き方です。`build-design` は Figma MCP が無い状態で値を推測して実装することを禁じています。

**注意。** 2026-10-26 に広がった `/teardown` は、物体の分解図です。同じリポジトリを丸ごと常時読み込むと、design-nexus の方向性と指示が重なります。スター 9,395 はリポジトリ全体です。

**design-nexus との関係。** 最初に読む価値があるのは `better-colors`、`better-typography`、`better-layout`、`better-accessibility` です。チェック ID の次の仮説（[references/checks.md](../skills/design-nexus/references/checks.md)）の材料にできます。スキルとしてはインストールせず、1仮説ずつ [loop/IMPROVEMENT.md](../loop/IMPROVEMENT.md) に載せるのがこのリポジトリの手順です。

**判定。** 検証済み。日付を上のとおり訂正しています。

## huashu-design

花叔（[@AlchainHust](https://x.com/AlchainHust)）の [huashu-design](https://github.com/alchaincyf/huashu-design)（★28,237）は、一文から Web ページ、App の原型、編集できる PPTX、アニメ、情報図を出すスキルです。手順は「6 候補を出し、3 方向に絞る」です。84 種類の見本付きスタイルライブラリがあり、外観の記録帳とデザインの健康診断もあります。HTML ネイティブで、Claude Code / Cursor / Codex などの特定のエージェントに依存しません。入れ方は `npx skills add alchaincyf/huashu-design`。

前回文書が README から写している点は、本文が中国語であること、成果物が HTML の視覚納品で本番の Web アプリやバックエンド付きシステムを対象外にしていること、デザイン検査が同梱の Python スクリプトであること、ライセンスが 2026-05-14 以降 MIT であること、です。design-nexus の lint とはランタイムが違います。

**日付の訂正。** V3.0 の公開告知は 2026-10-17 22:22 JST です。前回文書が 3.0 の発表としていた 2026-10-23 頃の URL は、10-24 00:15 JST の X 記事（本文未確認）です。GitHub Trending 入りは 10-27 前後の投稿です。

**確認したX。**

- [2026-10-17 22:22 JST](https://x.com/AlchainHust/status/2111447668652220768)「Huashu Design V3.0版本发布！」（スタイルの拡充、動きの表現の強化、DeepSeek-V4.1-flash への対応） L257 / RT35 / V20,881
- [2026-10-18 22:28 JST](https://x.com/AlchainHust/status/2111811721471897618)。X 記事（本文未確認）。L948 / RT171 / V247,086 / BM1,844
- [2026-10-24 00:15 JST](https://x.com/AlchainHust/status/2113650413170049529)。X 記事（本文未確認）。L484 / RT51 / V85,367
- [2026-10-27、@FReza1984](https://x.com/FReza1984/status/2114985890661720521)「Huashu Design 3.0 is trending on GitHub today (+251 stars)」 L3
- [2026-10-27（UTC では 10-26）、@Ryrenz](https://x.com/Ryrenz/status/2114774081438351470) L6

**強いところ。** 方向をユーザーが選ぶまで実装に進まない、というゲートが残ります。前回文書が README から拾った、東アジアの組版がスタイル庫に入っている、という点は、今回の X 検証の対象外です。

**design-nexus との関係。** スキルごと重ねないでください。読むならスタイル庫と、成果物の見た目を記録帳に残して次で避ける、という考え方です。後者は [retro](../skills/design-nexus/references/retro.md) と [loop/feedback.md](../loop/feedback.md) に近いです。和文の規則を取り込むなら、見本をそのまま採用せず、[references/japanese.md](../skills/design-nexus/references/japanese.md) 向けの1仮説にします。

**判定。** 検証済み。告知日を 2026-10-17 JST に訂正しています。10-18 と 10-24 の X 記事は本文未確認です。

## Google Stitch のスキルと DESIGN.md

二つに分かれます。

- [google-labs-code/design.md](https://github.com/google-labs-code/design.md)（★28,667、仕様の状態は `alpha`）は、エージェント向けの視覚仕様です。YAML のトークン（colors、typography、rounded、spacing、components）と、Markdown で書くデザイン意図を一つの `DESIGN.md` に書きます。仕様の公開は 2026-04-21 です。検証コマンドは、前回文書が README から写した `npx @google/design.md lint DESIGN.md` です。
- [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills)（★8,642、最終 push 2026-08-17）は Stitch MCP 用の Agent Skills 集です。画面生成、既存の React／Vue ページを Stitch に戻すこと、デザインシステムの整理、DESIGN.md の維持、React への変換を扱います。前回文書が README から写したスキル名には、`design-md` と `taste-design` が含まれます。`taste-design` は comparison.md の Taste Skill とはリポジトリが違います。Stitch には CLI（`@google/stitch`）もあります。

**入れ方。** 前回文書の例では、Claude Code に `npx plugins add google-labs-code/stitch-skills --scope project --target claude-code`、Cursor に `--scope workspace --target cursor` です。個別なら `npx skills add google-labs-code/stitch-skills --skill design-md`。Stitch の画面生成は Stitch 側のプロジェクトが要ります。

**確認したX。** 前回、10 月の新しい告知 URL は未確認としていました。今回取得できたのは次です。2026-03 の公式スレは、今回の検索結果には含まれておらず、再確認していません。

- [2026-08-19 11:30 JST、@hisevenih](https://x.com/hisevenih/status/2089902672107217206)。Stitch Skills の紹介。L14 / V4,487
- [2026-10-14 23:48 JST、@Mnilax](https://x.com/Mnilax/status/2110382356028686598)「15 github repos…」の 2 番目。L408 / RT42 / V36,592 / BM748
- [2026-10-01、@TheUltronAi](https://x.com/TheUltronAi/status/2105552329747656943)。週間トレンドで stitch-skills（4 スキル）が 7 位、+8.5K インストール。L13
- [2026-10-04、@peesamac](https://x.com/peesamac/status/2106625510419968365)。Stitch CLI。L18
- [2026-10-28、@shaderdotmd](https://x.com/shaderdotmd/status/2115455547357204734)。DESIGN.md に従っていても Stitch がパレット外の色を 47 色足した、という検証の紹介。L1

参考: [Stitch と DESIGN.md の記事（2026-04-21）](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/)。

**強いところ。** トークンが機械可読で、コントラストを lint が JSON で返します。design-nexus が `DESIGN.md` を唯一の真実にしているのと同じ問題を、別のファイル形式で解いています。

**注意。** 形式は alpha です。design-nexus のテンプレートは、[tokens-check.mjs](../skills/design-nexus/scripts/tokens-check.mjs) が読む `tokens` フェンスです。Google の形式は YAML のフロントマターです。Stitch の画面生成スキルは、Stitch 上のプロジェクトに対して動きます。

**design-nexus との関係。** テンプレートを Google 形式に置き換えないでください。突き合わせるなら、トークン名と「散文で理由を残す」層です。コントラストの決定的検査は既に [tokens-check.mjs](../skills/design-nexus/scripts/tokens-check.mjs) にあります。

**判定。** 検証済み。

## pstack の principles

Lauren Tan（[@poteto](https://x.com/poteto)）の個人スキル集で、Cursor プラグインです。Claude Code などへの移植版もあります。依頼の文脈で「design principles」とあったものは、UI デザインではなくエンジニアリング上の設計原則です。`principle-*` は 10〜20 行程度の短いスキルで、foundational-thinking、boundary-discipline、prove-it-works、experience-first などがあります。UI に関係するのは principle-experience-first と principle-exhaust-the-design-space くらいです。

前回文書がプラグイン README から写した、その二つの内容は次のとおりです。

- `experience-first`: 実装の都合と使う人の体験が衝突したら体験を取る。機能は少なく、磨いて出す。
- `exhaust-the-design-space`: コードベースに先例がない UI のインタラクションでは、2〜3 個の試作品を並べてから採用する。

`/unslop` は文章から AI の言い回しを除くスキルです。画面の見た目は扱いません。

**入れ方。** 前回文書の手順は、Cursor では `/add-plugin pstack`。Claude Code では `/plugin marketplace add cursor/plugins` のあと `/plugin install pstack@cursor-plugins`。入り口は `/poteto-mode` です。公式リポジトリの URL は、今回の検索では確認できていません（poteto/pstack はヒットせず）。移植版は [michael-denyer/pstack-claude](https://github.com/michael-denyer/pstack-claude)（★3,667）です。前回文書が正本にしていた cursor/plugins の pstack README は、今回のスター取得の対象外です。

**確認したX。**

- [2026-10-15 07:23 JST、@poteto](https://x.com/poteto/status/2110496830429839869)「perhaps one of the most durable parts of pstack are its engineering principles: very concise skills (~10-20 loc)…」 L3,434 / RT124 / V262,248
- [2026-10-16 JST、@poteto](https://x.com/poteto/status/2110757066709356851)「try pstack!」 L4,913 / V324,320
- [2026-10-27 JST、@0xChaseTM](https://x.com/0xChaseTM/status/2114845884890435917)「30 selected skills… 24 principle references guide design decisions…」 L265

**注意。** プラグインは Cursor のモデル名やサブエージェントに依存する手順を含みます。視覚の品質チェック（コントラスト、幅、スロップ検出）はありません。UI デザインの話題ではないので、[design-trends/](design-trends/README.md) とは分けています。

**design-nexus との関係。** 併用して視覚の権威を二つにしないでください（[SKILL.md の優先順位](../skills/design-nexus/SKILL.md)）。読むなら `exhaust-the-design-space` が、build の 3 案と deep のヒーロー単独レビューに抜けがないかの照合材料になります。

**判定。** 投稿は検証済みです。公式リポジトリ URL は未確認です。デザインスキルとしては扱いません。

## Hallmark

Together AI（@nutlope）の「アンチ AI スロップ」デザインスキルです。[Nutlope/hallmark](https://github.com/Nutlope/hallmark) は ★43,079 です。48 テーマ（素材）から選ばせて毎回違うページを作り、実ブラウザで AI っぽさの兆候（tells）を lint してから納品します。`/hallmark audit` はレポートだけを出します。755 点のオープンライセンス写真を、クレジット付きで使います。仕組みの比較は [comparison.md](comparison.md) です。

**確認したX。**

- [2026-10-27 21:08 JST、@trending_repos](https://x.com/trending_repos/status/2115052997134741743)。24 時間で +2,859★。L338 / V28,051
- [2026-10-26、@sakatayasha](https://x.com/sakatayasha/status/2114579635833016421) L48

**design-nexus との関係。** comparison.md の 10 件に含まれ、Floor / Reflex / Finish の出典の一つです。同格の権威として重ねて読ませません。この節は 2026-10-31 の X 検証の記録です。

**判定。** 検証済み。

## Impeccable

Paul Bakaus（@pbakaus）の「コーディングエージェントのためのデザイン語彙」です。[pbakaus/impeccable](https://github.com/pbakaus/impeccable) は ★97,207 です。polish、bolder、critique、audit など 24 コマンドと、AI っぽい UI を検出する 59 ルールの検出器を持ちます。impeccable live で、ブラウザ上の修正を即座に反映できます。59 は 2026-10-31 の検証メモの数です。comparison.md は 2026-10-30 時点で 62 ルールと数えています。数え方が違う可能性があるので、仕組みの比較は [comparison.md](comparison.md) を見てください。

**確認したX。** 作者本人の単発告知を、この期間の代表投稿としては特定できていません。確認できたのはまとめと併用の投稿です。

- [2026-10-30、@Aykutuces](https://x.com/Aykutuces/status/2116215203591258123)。検出器が紫グラデーション、横タブ線、バウンスする easing などを検出する。L28
- [2026-10-08、@flexdinesh](https://x.com/flexdinesh/status/2108026418110267613)。Impeccable と Paper MCP を組み合わせると、コードとデザインを双方向に行き来できる。L3
- [@Mnilax の 15 リポジトリ（2026-10-14）](https://x.com/Mnilax/status/2110382356028686598) の 4 番目。L408 / RT42 / V36,592 / BM748

**design-nexus との関係。** comparison.md の 10 件に含まれ、操作語彙と決定的検出器の出典です。横に足すと指示が衝突します。

**判定。** 検証済み。リポジトリと、期間内の言及投稿は確認しています。この期間の作者本人の告知 URL は、添付の結果にはありません。

## UI UX Pro Max と「15 repos」

[nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)（★143,070）は、192 のカラーパレットと 74 のフォントペアリングを検索できるデザインインテリジェンス系スキルです。仕組みの比較は [comparison.md](comparison.md) です。

**確認したX。** [2026-10-14 23:48 JST、@Mnilax](https://x.com/Mnilax/status/2110382356028686598)。L408 / RT42 / V36,592 / BM748。掲載順は次の 15 件です。スターを書いているものは、同じ 2026-10-31 12:45 JST 頃の取得です。

1. anthropics/skills の frontend-design（★185,402）
2. stitch-skills
3. ui-ux-pro-max
4. impeccable
5. vercel-labs/agent-skills（★33,272）
6. excalidraw-mcp
7. tldraw
8. figma/mcp-server-guide
9. Figma-Context-MCP
10. cursor-talk-to-figma-mcp
11. penpot
12. shadcn/ui
13. magic-mcp
14. storybook
15. onlook

frontend-design の公開告知として前回文書が挙げていた 2025-11-13 の URL は、今回の検索結果には含まれておらず、再確認していません。

**design-nexus との関係。** UI UX Pro Max、frontend-design、Impeccable、Vercel agent-skills は comparison.md の 10 件です。長所は折り込み済みなので、同格では読ませません。

**判定。** 検証済み。

## Emil Kowalski skills

アニメーションのタイミング、easing、ボタンのフィードバックなど、インタラクションの磨き込みを扱うスキル集です。Jakub のスキル群と並べて紹介されることが多いです。[emilkowalski/skills](https://github.com/emilkowalski/skills) は ★52,060 です。仕組みの比較は [comparison.md](comparison.md) です。

**確認したX。**

- [2026-08-18 20:03 JST、@nett0eth](https://x.com/nett0eth/status/2089669588543840460) L185 / V24,819
- [2026-10-18、@thehypekevin](https://x.com/thehypekevin/status/2111505348666532029) L11
- [2026-09-14、@GitHub_Daily](https://x.com/GitHub_Daily/status/2099287056929460296)。Emil と Jakub の比較。L62

**未確認。** 期間内の、本人（@emilkowalski）によるスキル告知投稿。

**design-nexus との関係。** comparison.md の 10 件に含まれ、モーション原則の出典です。同格では読ませません。

**判定。** 一部検証。リポジトリと第三者の紹介は確認しています。本人の告知は未確認です。

## エージェント向けモーションデザインスキル群

2026-10 上旬に、「Opus 5.5 をモーションスタジオにする 15〜20 リポジトリ」というまとめ投稿が拡散しました。公式のものとして確認できた四つは次です。

| リポジトリ | ★（10/31 12:45 JST 頃） | この検証で分かった範囲 |
|---|---|---|
| [LottieFiles/motion-design-skill](https://github.com/LottieFiles/motion-design-skill) | 2,629 | タイミング、easing、振り付け、ディズニーの原則 |
| [greensock/gsap-skills](https://github.com/greensock/gsap-skills) | 17,602 | GSAP のスキル |
| [remotion-dev/skills](https://github.com/remotion-dev/skills) | 5,921 | Remotion のスキル |
| [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) | 76,109 | HTML を MP4 に変換 |

**確認したX。**

- [2026-10-10 22:00 JST、@Voxyz_ai](https://x.com/Voxyz_ai/status/2108905392776360333) L532 / RT50 / V155,878
- [2026-10-12 01:07 JST、@Mnilax](https://x.com/Mnilax/status/2109314840057565345)。「ex-Figma Design Lead」のリストとして紹介。L716 / V113,345
- [2026-10-08 22:09 JST、@N01ennn](https://x.com/N01ennn/status/2108182955671580771)「Netflix engineers posted…」 L5,996 / RT661 / V509,569 / BM14,251。誰が作ったリストか、という主張はまとめ系アカウントに多い誇張の可能性が高く、未確認です。
- [2026-10-21、@LunarResearcher](https://x.com/LunarResearcher/status/2112902873000349735)。`/mechanica`（メカの分解アニメーション）。L128

**注意。** 「Netflix engineers」「ex-Anthropic」「ex-Figma Design Lead」といった出自の主張は、未確認のままです。

**design-nexus との関係。** 話題の記録です。モーションの原則自体は、comparison.md が Emil Kowalski skills から取り込んだ範囲と [references/motion.md](../skills/design-nexus/references/motion.md) に既にあります。これらのリポジトリを同格で読ませる判断は、この文書ではしていません。

**判定。** 四つのリポジトリと、まとめ投稿の存在は検証済みです。リストの出自の主張は未確認です。

## Anatomy と図解・技術イラスト

実在の機械や複雑なシステムを、詳細でインタラクティブなアイソメトリック図にするスキルです。`/teardown` と同系統で、分解図と技術イラストの流れを作っています。[wheresryan22/anatomy](https://github.com/wheresryan22/anatomy) は ★23,066 です。ほかに cathrynlavery/diagram-design、tt-a1i/archify が挙がっています。この二つのスター数は、今回の取得値にはありません。

**確認したX。** [2026-10-17 08:15 JST、@RoundtableSpace](https://x.com/RoundtableSpace/status/2111234483139510507)「8 open-source repos that turn your AI agent into a creative studio」 L493 / V72,562。`/teardown` 自体の投稿は Jakub Krehel の節、`/mechanica` はモーションの節にあります。

**design-nexus との関係。** 分解図は Floor の材料にしません。Jakub の節と同じ扱いです。

**判定。** 検証済み。

## elayadesign/ai-design-skills

デザイナーが作ったスキル 2 本です。[elayadesign/ai-design-skills](https://github.com/elayadesign/ai-design-skills) は ★12,906、作者は @elayadesigns です。`landing-page-design` はヒアリングの質問をしてから、独自の文字組み、余白、モーションの体系でランディングページを作ります。`design-to-motion` は静止デザインを動きのあるショーケースにし、MP4／GIF で書き出します。仕組みの比較は [comparison.md](comparison.md) です。comparison.md の表は 2026-10-30 時点の記述なので、スキル本数とスターはこちらの 10-31 の値を見てください。

**確認したX。** [2026-10-27 03:28 JST、@designertom](https://x.com/designertom/status/2114786186250379759)「Designer-made agent skills are everywhere this week」 L176 / BM339。インストール前のチェックリストとして、SKILL.md を読む、クレジットを確認する、実行するコマンドを確認する、捨てブランチで試す、テイスト部分を自分のものに差し替える、が挙がっています。

**design-nexus との関係。** comparison.md の 10 件に含まれ、着手前のヒアリングの出典です。同格では読ませません。

**判定。** 検証済み。

## awesome-design-md と DESIGN.md 系サービス

[VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) は ★124,721 です。

**確認したX。**

- [2026-10-22 12:15 JST、@RoundtableSpace](https://x.com/RoundtableSpace/status/2113106821091143750)。83 ブランドの DESIGN.md。L248 / V51,183
- [2026-09-23、@AK956043](https://x.com/AK956043/status/2102460845527892450)。Refero Styles、designmd.me、designmd.supply、Hyperbrowser DESIGNMD、getdesign.md、open-design.ai、ui-skills.com、typeui.sh。L2

**design-nexus との関係。** 形式の突き合わせは Stitch の節と同じで、テンプレートの置き換えはしません。他社ブランドの DESIGN.md をそのまま使う判断は、この文書ではしていません。

**判定。** 検証済み。

## Open Analytics の DESIGN-SKILL

[2026-08-21 04:44 JST、@uaghazadae](https://x.com/uaghazadae/status/2090525353940820049)。自社プロダクトのデザイン言語（色、squircle、7 種類のスプリング、12 のコンポーネントレシピ）を DESIGN-SKILL.md として MIT で公開した、という投稿です。L603 / BM911。

**未確認。** リポジトリの URL。投稿本文に URL がありません。

**判定。** 一部検証。投稿は取れています。正本の所在は未確認です。

## Paper MCP と Refero

スキル単体ではなく、画面を作るときの流れとしての投稿です。

- [2026-08-11 03:31 JST、@robj3d3](https://x.com/robj3d3/status/2086883206301925800)「I 100% vibedesign all my websites now. > Paper MCP (it's Figma for agents) > Refero to avoid AI slop feel > … skills for polishing」 L1,750 / RT69 / V204,368 / BM4,093
- [2026-10-26、@daniildesigns](https://x.com/daniildesigns/status/2114718514581786764)。Figma、Pen、Paper の比較。L41

スター数は、この検証では取っていません。手法としてのメモは [T03](design-trends/trends/T03-vibe-design.md) と [T05](design-trends/trends/T05-reference-driven.md) にあります。

**判定。** 検証済み（ワークフローの投稿として）。

## Open Design

[nexu-io/open-design](https://github.com/nexu-io/open-design)（★105,063）は、Claude Design のオープンソースでローカルファーストな代替、として紹介されています。

**確認したX。** 大きな告知投稿は見つかりませんでした。[2026-09-20、@techwith_ram](https://x.com/techwith_ram/status/2101522227258945835)（L3）など、少数です。

**判定。** 一部検証。リポジトリは確認済みです。X 上の話題量は小さいです。

## このリポジトリで先に試すもの

ここでの「試す」は、メンテナが次の1仮説を選ぶときの読書順です。[SKILL.md](../skills/design-nexus/SKILL.md) は、他のデザインスキルを同格の権威として読まない、と書いています。

1. **Jakub Krehel の `better-colors` / `better-typography` / `better-layout` / `better-accessibility`。** better-* の初出は 2026-07-13 JST で、値が測定できる書き方です。チェックを増やすなら、この四つのどれか一つを仮説にして [eval](../eval/rubric.md) にかけてください。2026-10-26 00:34 JST に広がった `/teardown` は分解図なので、Floor の材料にはしません。
2. **Google の DESIGN.md 仕様。** [templates/DESIGN.md](../skills/design-nexus/templates/DESIGN.md) とトークンの名前を突き合わせる対象です。ファイル形式の置き換えは、lint が読んでいる `tokens` ブロックを壊します。仕様は alpha です。
3. **huashu-design のスタイル見本と、外観の記録帳。** 方向を絞ってから形にするゲートと、プロジェクトをまたいで同じ顔に寄る問題の読書材料です。スキル本体は HTML 納品用なので、design-nexus に同居させません。東アジアの組版がスタイル庫にある、という前回の README メモは、今回の X 検証では再確認していません。

pstack の二つの原則は、既にある「3案」と「ブリーフが勝つ」の抜け確認に使います。UI デザインのスキルとしては扱いません。Figma スキルは、成果物が Figma ファイルである仕事にだけ足します。Canva は、リポジトリは実在しますが、X でスキルとして話題になっている証拠は弱いです。ソーシャルとブランドキットの仕事にだけ足します。shadcn スキルは、そのコンポーネント集を既に使っているリポジトリで、部品の入れ方と DESIGN.md 生成として足します。

Taste、frontend-design、Impeccable、Hallmark、UI UX Pro Max を含む comparison.md の 10 件は、長所を既に折り込み済みです。この文書に足したのは、2026-10-31 に確認できた投稿とスターです。横に足すと指示が衝突します。

## 未確認・根拠が弱いもの

1. **Canva skills** はリポジトリが実在します。X で「話題のスキル」と言える投稿は確認できていません。
2. **21st.dev** はスキルと MCP が実在します。X の反応は小さいです（公式告知 L9）。
3. **Taste Skill v2.5** は作者の投稿に言及があるだけで、GitHub のリリースは v2.1.5 までです。
4. **「ui-taste」（週間トレンド 1 位）と taste-skill が同一か**は未確認です。
5. **huashu-design** の 10-18 と 10-24 の X 記事は、本文を取得できていません。
6. **pstack の公式リポジトリ URL** は未確認です。中身はエンジニアリング原則で、UI デザインスキルではありません。
7. **Emil Kowalski 本人**による、期間内の告知投稿は未確認です。
8. **Open Analytics DESIGN-SKILL** のリポジトリ URL は未確認です。
9. モーション系のまとめにある「Netflix engineers」「ex-Anthropic」「ex-Figma Design Lead」という出自の主張は未確認です。
10. **Impeccable** はリポジトリと言及投稿は確認済みです。この期間の作者本人の告知 URL は、結果にありません。
11. **Open Design** はリポジトリが実在します。X 上の大きな告知は見つかっていません。
12. **diagram-design** と **archify** は名前が挙がっています。スター数は今回取っていません。
13. 前回文書が挙げていた、Taste の 2026-10-13 の v2 投稿、frontend-design の 2025-11-13 の告知、Stitch の 2026-03-18 の公式スレは、今回の検索結果に含まれておらず、再確認していません。

## 出典

投稿 URL、投稿者、日時、反応数は各節にあります。取得は 2026-10-31 12:39〜12:48 JST（反応数とスターは 12:45 JST 頃）です。

- [figma/mcp-server-guide](https://github.com/figma/mcp-server-guide)
- [Figma skills for MCP](https://help.figma.com/hc/en-us/articles/39166810751895-Figma-skills-for-MCP)（入れ方は前回文書がヘルプから写したもの）
- [canva-sdks/canva-skills](https://github.com/canva-sdks/canva-skills)
- [shadcn/ui Skills](https://ui.shadcn.com/docs/skills)
- [shadcn-ui/ui](https://github.com/shadcn-ui/ui)
- [superdesigndev/superdesign-skill](https://github.com/superdesigndev/superdesign-skill)
- [21st-dev/magic-mcp](https://github.com/21st-dev/magic-mcp)
- [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)
- [jakubkrehel/skills](https://github.com/jakubkrehel/skills)
- [alchaincyf/huashu-design](https://github.com/alchaincyf/huashu-design)
- [google-labs-code/design.md](https://github.com/google-labs-code/design.md)
- [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills)
- [Stitch と DESIGN.md（2026-04-21）](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/)
- [michael-denyer/pstack-claude](https://github.com/michael-denyer/pstack-claude)
- [Nutlope/hallmark](https://github.com/Nutlope/hallmark)
- [pbakaus/impeccable](https://github.com/pbakaus/impeccable)
- [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- [emilkowalski/skills](https://github.com/emilkowalski/skills)
- [elayadesign/ai-design-skills](https://github.com/elayadesign/ai-design-skills)
- [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)
- [nexu-io/open-design](https://github.com/nexu-io/open-design)
- 仕組みの比較: [comparison.md](comparison.md)（スターは 2026-10-30 にリポジトリページで見た値）
- 手法の参照用データベース: [design-trends/](design-trends/README.md)
