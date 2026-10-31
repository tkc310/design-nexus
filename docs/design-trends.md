# デザイン手法・トレンド リファレンス

このファイルは、必要なときだけ引く参照用データベースです。design-nexus のスキルが普段から読むものではありません。AGENTS.md、CLAUDE.md、スキル定義、エージェント向けのルールからは参照しません。

取得日: 2026-10-31（JST）。X の反応数は同日 12:45 JST 頃のスナップショットです。日時は JST に変換済みで、変換していないものは（UTC）と書いています。

## 引き方

ファイル内を ID（例: `T08`）、名前（例: 分解図）、タグ（例: `#motion`）で検索します。タグから ID へは下のタグ索引、ID から本文へは索引表です。確度が「低」「低〜中」、または「未確認」の項目は、根拠が弱いので採用の前提にしません。T11、T12、T18 はとくにその旨を本文に残しています。

各項目の書式は同じです。ID、タグ、概要、特徴・適用方法、向く場面、避ける場面、代表例、ソース、トレンド時期、確度。

## 検証方法

- X は公開投稿のアーカイブ検索（2026-07 / 08 以降、relevancy 順、`min_faves` で絞り込み）と、投稿 ID を指定した本文・URL の展開です。2026-10-31 12:39〜12:48 JST に実行し、403 は出ていません。
- Web は、業界レポート、公式ドキュメント、論文を確認しています。
- L はいいね、RT はリポスト、V は表示回数、BM はブックマークです。根拠の弱いものは確度を下げ、確認できなかったものは「未確認」と書いています。

## タグ索引

| タグ | 意味 | ID |
|---|---|---|
| `#workflow` | 制作プロセス | T02 T03 T04 T05 T16 |
| `#visual` | 見た目のスタイル | T01 T08 T09 T10 T11 T13 T18 |
| `#motion` | 動き | T06 T07 |
| `#typography` | 文字 | T12 |
| `#layout` | 配置 | T12 T17 |
| `#color` | 色 | T11 T18 |
| `#interaction` | 操作とフィードバック | T07 T13 T14 T15 |
| `#ai-agent` | エージェントと一緒に作るときに関係する | T01 T02 T03 T05 T06 T08 T14 T15 |
| `#system` | デザインシステム | T02 T16 |
| `#anti-pattern` | 避けたいもの | T01 |
| `#mature` | 定番化・沈静化している | T17 |

## 索引

| ID | 名前 | タグ | 時期 | 確度 |
|---|---|---|---|---|
| T01 | アンチ AI スロップ／"taste" | #anti-pattern #ai-agent #visual | 2026-08〜（10 月がピーク） | 高 |
| T02 | DESIGN.md／エージェントが読めるデザインシステム | #system #ai-agent #workflow | 2026-04 仕様公開、8〜10 月に普及 | 高 |
| T03 | Vibe design（プロンプト駆動デザイン） | #workflow #ai-agent | 2026-08〜 | 中〜高 |
| T04 | Design in code／デザインエンジニアリング | #workflow | 継続中（2026 下期に Code Layers が登場） | 高 |
| T05 | リファレンス駆動デザイン | #workflow #ai-agent | 2026-08〜 | 中〜高 |
| T06 | エージェントによるモーションデザイン（HTML→動画） | #motion #ai-agent | 2026-10 上旬に急拡散 | 高 |
| T07 | 「情報としてのモーション」と CSS ネイティブの動き | #motion #interaction | 2026 通年（Interop 2026） | 高 |
| T08 | 技術イラスト／分解図・アイソメトリック | #visual #ai-agent | 2026-10 中旬〜 | 高 |
| T09 | ディザ／ASCII／シェーダーのテクスチャ | #visual | 2026-08〜10 | 中 |
| T10 | Liquid Glass／グラスモーフィズム | #visual | 2025-06 発表、2026 年に各 OS へ波及 | 高 |
| T11 | ライトモード回帰 | #color #visual | 2025〜2026 | 中 |
| T12 | エディトリアルな密度と、差別化手段としてのタイポグラフィ | #typography #layout | 2025〜2026 | 中 |
| T13 | 3D／WebGL の没入型サイト | #visual #interaction | 2026 通年 | 中〜高 |
| T14 | エージェント UX パターン（意図プレビュー・承認ゲート） | #interaction #ai-agent | 2026 下期 | 高 |
| T15 | Generative UI | #interaction #ai-agent | 2026 下期 | 中 |
| T16 | Spec 駆動のデザイン受け渡し | #workflow #system | 2026-10〜 | 中 |
| T17 | Bento grid | #layout #mature | 2023〜（定番化） | 中 |
| T18 | ビビッド配色、レトロ・Y2K・レトロフューチャー | #color #visual | 2026（レポート上） | 低〜中 |

---

## T01. アンチ AI スロップ／"taste"

- **タグ**: #anti-pattern #ai-agent #visual
- **概要**: AI が生成した UI に共通して出る既定値の組み合わせを「AI スロップ」と呼び、意図的に避ける動き。2026 年のデザイン界の合言葉は「taste（審美眼）」になった。
- **特徴・適用方法**:
  - 典型的な兆候（tells）: インディゴ〜紫のグラデーション、何も指定しない Inter、同じ形の 3 枚のフィーチャーカード、角丸と影が 1 種類だけ、全体の中央揃え、見出しの上の eyebrow ラベル、カードの中のカード、絵文字アイコン、中身のない見出しコピー。
  - 対処は次の順です。まずフォントを決める。色は装飾ではなく意味で使う（primary、warning など）。角丸に階層をつける。フォーカス状態をデザインする。同じ形のカードを並べない。
  - 紫や Inter 自体が悪いわけではありません。Stripe は紫、Linear は Inter を使っています。問題は、決めずに既定値のまま使うことです。単一のスコアに最適化しすぎると、今度は別の形で均質化します。
  - 日本語圏では「AI 感」ではなく「テンプレート感」として捉えるほうが有用だ、という指摘もあります。
- **向く場面**: AI で生成した LP、SaaS の UI、プロトタイプの仕上げとレビュー。
- **避ける場面**: チェックリストを機械的に当てはめるだけになるとき。ブランドがすでに紫や Inter を体系的に使っているとき。
- **代表例**: Impeccable（検出器）、Hallmark（ブラウザで lint）、Taste Skill（frame check）、hankimis/ai-design-tells（Tell Score）
- **ソース**:
  - [X: @AIHighlight 2026-08-12](https://x.com/AIHighlight/status/2087213301130236311) L57 / V15,801
  - [X: @rajanndube 2026-08-10「2026: taste」](https://x.com/rajanndube/status/2086531125338685715) L9
  - [X: @masaru21 2026-09-05「AI 感よりテンプレート感」](https://x.com/masaru21/status/2096028491628355669) L102 / V16,085
  - [X: @kazm_n18 2026-10-09](https://x.com/kazm_n18/status/2108392512989925715) L14
  - [X: Hallmark が Trending、2026-10-27](https://x.com/trending_repos/status/2115052997134741743) L338
  - [Spot the slop](https://www.mania.design/blog/spot-the-slop-a-ui-designers-guide-to-fixing-ai-defaults/)
  - [AI slop design tells](https://www.925studios.co/blog/ai-slop-design-tells)
  - [27 tells と、202 サイトによる較正](https://labs.iovstudio.kr/papers/ai-design-tells.pdf)
- **トレンド時期**: 2026-08 から増え、2026-10 下旬（Hallmark、Impeccable、Taste が GitHub Trending 入り）がピーク。
- **確度**: 高

## T02. DESIGN.md／エージェントが読めるデザインシステム

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

## T03. Vibe design（プロンプト駆動デザイン）

- **タグ**: #workflow #ai-agent
- **概要**: vibe coding のデザイン版。自然言語でエージェントに画面を作らせ、対話しながら詰めていく。
- **特徴・適用方法**: 典型的な流れは次のとおりです。Refero などでパターンを調べる。Paper、Stitch、Figma agent、Claude Design などでモックを作る。スキル（Impeccable など）で磨く。コーディングエージェントで実装する。「eyebrow」のように、vibe design を通じて広まった語彙もあります。
- **向く場面**: 個人開発や小規模チームでの探索、短期間の LP 制作、方向案を素早く量産したいとき。
- **避ける場面**: 確立したデザインシステムがあるプロダクト（Figma とシステム準拠のほうが強い）。「考えること」まで委ねてしまうリスクがある場合。
- **代表例**: Paper MCP、Google Stitch（MCP と CLI）、Claude Design（2026-04-17 公開）、Open Design（★105,063、2026-10-31 12:45 JST 頃）
- **ソース**:
  - [X: @robj3d3 2026-08-11](https://x.com/robj3d3/status/2086883206301925800) L1,750 / V204,368 / BM4,093
  - [X: @sanketnadhani 2026-10-29](https://x.com/sanketnadhani/status/2115497477189337236) L5
  - [X: Figma、Pen、Paper の比較、2026-10-26](https://x.com/daniildesigns/status/2114718514581786764) L41
  - [X: Claude Design と Figma MCP の違い、2026-09-23](https://x.com/dotey/status/2102509523684479377) L20 / V11,709
  - [Claude Design の報道（2026-04-17）](https://www.macrumors.com/2026/04/17/anthropic-claude-design/)
- **トレンド時期**: 2026-08〜（継続中）
- **確度**: 中〜高。「vibe design」という語自体の投稿は反応が小さめです。ワークフロー投稿のほうがよく伸びています。

## T04. Design in code／デザインエンジニアリング

- **タグ**: #workflow
- **概要**: デザイナーがコードを素材として直接扱う働き方。Figma の Code Layers（2026-10-15 にオープンベータ）で、キャンバス上にもコードが載るようになった。
- **特徴・適用方法**:
  - アイデアを言葉で説明し、Figma に移して調整し、Claude に戻して実装する。動きをつけて公開する。
  - デザイナーの開発参加は 41% に倍増し、開発者のデザイン参加は 44% から 60% に増えた（Figma 2026 AI report）。
  - 反論として「Design engineering is a trap」があります。エージェントに思考まで委ねがちになるので、Paper や Figma で先に考えてからコードに行くべきだ、という意見です。
- **向く場面**: インタラクションが重要な UI、デザインシステムのコンポーネント制作、小さなチーム。
- **避ける場面**: 大規模な情報設計やブランド探索など、手を動かす前に考えることが要るとき。
- **代表例**: Figma Code Layers と Figma Make、Mode（@modeinspect）、onlook
- **ソース**:
  - [X: @adriankuleszo 2026-10-28](https://x.com/adriankuleszo/status/2115194369909445069) L338 / V17,160
  - [X: @MichaelFilipiuk 2026-09-25、反論](https://x.com/MichaelFilipiuk/status/2103480474832166978) L352 / V19,436
  - [X: @figma、Code Layers、2026-10-23](https://x.com/figma/status/2113330876407054503) L335
  - [X: Senior Product Design Engineer の採用、2026-09-23（UTC）](https://x.com/uixmat/status/2102696698258559200) L218
  - [Figma 2026 AI report](https://www.figma.com/blog/2026-ai-report/)
  - [Figma Config 2026](https://quartr.com/events/figma-fig-config-2026_FV2VF7Z3)
- **トレンド時期**: 継続中。2026-06 の Config から 2026-10 の Config India で加速。
- **確度**: 高

## T05. リファレンス駆動デザイン

- **タグ**: #workflow #ai-agent
- **概要**: AI が出す「平均値」から抜け出すために、実在の優れたサイトやデザイナー自身の作品集をエージェントに参照させる手法。
- **特徴・適用方法**: Refero や Mobbin を MCP で検索させる。Taste Skill の 247 サイトのように、厳選した参照集から方向を 3 つ提示させる。自分の Pinterest コレクションをスキル化する。方向案を複数出して選ぶ形式（huashu の「6 候補 → 3 方向」、Taste の「20 方向 → 3 つ」）とよく組み合わせる。
- **向く場面**: ブランドの方向づけ、LP、ポートフォリオ。
- **避ける場面**: 参照元をそのまま写してしまう場合（模倣、著作権）。社内のシステム準拠が最優先の業務 UI。
- **代表例**: Refero、Mobbin、Taste Skill の 247 サイト、huashu-design の「6 候補 → 3 方向」、Pinterest コレクションのスキル化。個別の完成サイト名はソースにありません。
- **ソース**:
  - [X: @inspiredDZN 2026-10-19](https://x.com/inspiredDZN/status/2111868813507473437) L180
  - [X: mobbin MCP と Figma MCP、2026-10-07](https://x.com/Lord_Rex2/status/2107801171951812638) L3
  - [X: Taste の 247 サイト、2026-10-24](https://x.com/AskPerplexity/status/2113654262052098312) L105
- **トレンド時期**: 2026-08〜
- **確度**: 中〜高

## T06. エージェントによるモーションデザイン（HTML→動画）

- **タグ**: #motion #ai-agent
- **概要**: ローンチ動画、説明アニメ、UI のモーションを、HTML と JS のコードとして書かせて動画に書き出す。
- **特徴・適用方法**: HyperFrames（HTML→MP4）や Remotion で描画し、GSAP、Motion、Lottie で動きをつける。スキルで「動きの原則」（タイミング、easing、振り付け、ディズニーの 12 原則）を教え、出力したフレームを自分で見直させる。音もコードで生成する。絵コンテを先に作ってから制作に入る。
- **向く場面**: プロダクトのローンチ動画、SNS の短尺動画、グラフのアニメーション、Web 上のマイクロインタラクション。
- **避ける場面**: 実写中心の映像、ブランドの映像トーンが厳格に決まっている案件、性能予算が厳しい画面。
- **代表例**: heygen-com/hyperframes（★76,109）、greensock/gsap-skills（★17,602）、remotion-dev/skills（★5,921）、LottieFiles/motion-design-skill（★2,629）、Figma のアニメーションスタイル（MCP と skills で適用）。スターは 2026-10-31 12:45 JST 頃。
- **ソース**:
  - [X: @N01ennn 2026-10-08](https://x.com/N01ennn/status/2108182955671580771) L5,996 / V509,569。出自の主張は未確認
  - [X: @Voxyz_ai 2026-10-10](https://x.com/Voxyz_ai/status/2108905392776360333) L532 / V155,878
  - [X: @Mnilax 2026-10-12](https://x.com/Mnilax/status/2109314840057565345) L716
  - [X: @figma 2026-10-01](https://x.com/figma/status/2105329949548912914) L917 / V1,533,714
  - [LottieFiles/motion-design-skill](https://github.com/LottieFiles/motion-design-skill)
- **トレンド時期**: 2026-10 上旬に急拡散（現在も継続中）
- **確度**: 高。まとめ投稿にある出自の主張（「Netflix engineers」など）は未確認です。

## T07. 「情報としてのモーション」と CSS ネイティブの動き

- **タグ**: #motion #interaction
- **概要**: 装飾としてのスクロールアニメから、状態変化を伝える機能としてのモーションへ移っている。実装も JS ライブラリから CSS ネイティブへ寄っている。
- **特徴・適用方法**: scroll-driven animations（`animation-timeline`、`view-timeline`）、View Transitions（クロスドキュメントを含む）、anchor positioning はいずれも Interop 2026 の対象。アニメーションでは width、height、left ではなく transform を動かす（レイアウト計算を避けて、カクつきを防ぐ）。エージェントは CSS で書けるものまで JS で書きがちなので、明示的に指示する。
- **向く場面**: カルーセル、ページ遷移、ローディング、操作のフィードバック。
- **避ける場面**: `prefers-reduced-motion` に対応していないとき。意味のない「ふわっと出る」演出。
- **代表例**: scroll-driven animations、View Transitions、anchor positioning（いずれも Interop 2026）。個別のプロダクト名はソースにありません。
- **ソース**:
  - [X: @jh3yy 2026-08-29、scroll-driven のカルーセル](https://x.com/jh3yy/status/2093465874321563782) L1,191 / V44,449
  - [X: @jakubkrehel 2026-10-23、transform の tip](https://x.com/jakubkrehel/status/2113292054151270727) L983 / V45,551
  - [X: @bug_d3v 2026-09-29](https://x.com/bug_d3v/status/2104862326859985005) L8
  - [Interop 2026](https://web.dev/blog/interop-2026)
  - [Kairo の 2026 トレンドレポート（Trend 3: Motion as Information）](https://www.kairocreations.com/kairo-tools/articles/2026-web-design-trends-report)
- **トレンド時期**: 2026 通年
- **確度**: 高

## T08. 技術イラスト／分解図・アイソメトリック

- **タグ**: #visual #ai-agent
- **概要**: 物体やアプリを「分解図（exploded view）」「カットアウェイ」「アイソメトリック図」として描く表現が、スキルによって誰でも作れるようになった。
- **特徴・適用方法**: パーツごとの色分けとラベルを付け、インタラクティブにして SVG、PNG、PDF で書き出す。アプリを層ごとに分解して見せる使い方もある。teenage engineering の分解イラストのような美学。
- **向く場面**: プロダクトの機能説明、ハードウェア、アーキテクチャ図、LP のヒーローや解説セクション。
- **避ける場面**: 情報量が少ない UI。正確さが要る工学図面（AI 生成の精度には限界がある）。
- **代表例**: jakubkrehel/skills の /teardown、wheresryan22/anatomy（★23,066、2026-10-31 12:45 JST 頃）、/mechanica、cathrynlavery/diagram-design
- **ソース**:
  - [X: @jakubkrehel 2026-10-26](https://x.com/jakubkrehel/status/2114379959263502712) L6,083 / V238,657
  - [X: @RoundtableSpace 2026-10-17](https://x.com/RoundtableSpace/status/2111234483139510507) L493
  - [X: @LunarResearcher 2026-10-21](https://x.com/LunarResearcher/status/2112902873000349735) L128
  - [X: @AskPerplexity 2026-10-30](https://x.com/AskPerplexity/status/2115828571742875737) L57 / V20,428
- **トレンド時期**: 2026-10 中旬〜（新しい流れ）
- **確度**: 高

## T09. ディザ／ASCII／シェーダーのテクスチャ

- **タグ**: #visual
- **概要**: ディザリング、ASCII アート、ハーフトーン、シェーダーのグラデーション、グレイン（粒子感）で、フラットな画面に質感と個性を足す表現。
- **特徴・適用方法**: 背景やヒーローにシェーダーを敷く（Paper Shaders など）。画像をディザ化する。ASCII アニメーションを使う。グレインのある背景にする。
- **向く場面**: 開発者向けツール、AI プロダクト、クリエイティブ系の LP、ポートフォリオ。
- **避ける場面**: 可読性が最優先の業務画面。低スペック端末（GPU 負荷が高い）。
- **代表例**: paper-design/shaders、Ascii Magic MCP
- **ソース**:
  - [X: @basit_designs 2026-08-14「custom Dither + ASCII vibe」](https://x.com/basit_designs/status/2088268079935688847) L50
  - [X: @kail_designs 2026-10-08](https://x.com/kail_designs/status/2108135428767596922) L55
  - [X: Ascii Magic MCP、2026-10-06](https://x.com/kail_designs/status/2107408508450939122) L96
  - [X: グラデーション、グラス、グレイン背景の素材、2026-08-16](https://x.com/ImranUxi/status/2088951277782970449) L1,212 / V61,331
- **トレンド時期**: 2026-08〜10
- **確度**: 中

## T10. Liquid Glass／グラスモーフィズム

- **タグ**: #visual
- **概要**: Apple が WWDC 2025 で発表した、半透明で光を屈折させる素材表現。2026 年には Android 系の各 OS にも「Liquid Glass 風」として広がった。
- **特徴・適用方法**: 半透明、ぼかし、光沢のある縁、動的なハイライト。背景のコントラストを確保して可読性を保つ。
- **向く場面**: iOS ネイティブのアプリ、OS 風のオーバーレイ、ウィジェット。
- **避ける場面**: 情報が密な Web の業務 UI、アクセシビリティ（コントラスト）要件が厳しい画面。AI スロップの「3 つのグラスボタン」のような安易な使い方。
- **代表例**: Apple の Liquid Glass（WWDC 2025）。2026 年の Android 系 OS への「Liquid Glass 風」。個別のアプリ名はソースにありません。
- **ソース**:
  - [X: @Vaibhav51552614 2026-08-11](https://x.com/Vaibhav51552614/status/2087184870816788963) L606 / V60,397
  - [X: UI kit、2026-10-27（UTC）](https://x.com/HorizonxSo/status/2115071025964568941) L87
  - [X: 解説、2026-09-13（UTC）](https://x.com/BabuBahlerao/status/2099000909279985750) L9
- **トレンド時期**: 2025-06 に発表され、2026 年に各 OS へ波及（Web ではすでに定番化しつつある）。
- **確度**: 高

## T11. ライトモード回帰

- **タグ**: #color #visual
- **概要**: 「高級感のある既定値」としてのダークモードがピークを過ぎ、ライトを既定にするプロダクトが増えている、という見方。
- **特徴・適用方法**: ライトを既定にし、ダークは選択肢として残す。エンタープライズのデモ環境（明るい会議室）では、ライトのほうが信頼感を出しやすい、という説明がある。
- **向く場面**: B2B、エンタープライズ、長時間使う業務アプリ。
- **避ける場面**: メディアや映像のビューア、夜間に使うアプリ、開発者向けツール（ダークの需要が根強い）。
- **代表例**: 個別のプロダクト名はソースにありません。数値の根拠は Kairo のレポート（400 サイト中 58% がライト既定。2024 年は 31%）です。
- **ソース**:
  - [X: @jakubkrehel 2026-10-27「Light mode >>> dark mode」](https://x.com/jakubkrehel/status/2114737256044871707) L202 / V14,384
  - [Kairo の 2026 トレンドレポート](https://www.kairocreations.com/kairo-tools/articles/2026-web-design-trends-report)
  - 反対の見方: Figma の 2026 年トレンド記事はダークモードを「標準」として挙げている（[Figma のトレンド記事](https://www.figma.com/resource-library/web-design-trends/)）。
- **トレンド時期**: 2025〜2026
- **確度**: 中。単一レポートに依存しています。反対の見方（Figma はダークを標準と書いている）も残しています。

## T12. エディトリアルな密度と、差別化手段としてのタイポグラフィ

- **タグ**: #typography #layout
- **概要**: 「ミニマルのためのミニマル」から、雑誌や新聞のような情報密度と、文字組みによる差別化へ移る動き。
- **特徴・適用方法**: 豊かな見出しの階層、多段組、カスタムフォントやセミカスタムフォント、可変フォント、オプティカルサイズ、ウェイトのコントラスト。セリフとサンセリフを組み合わせ、クリーム系の配色を使う。
- **向く場面**: メディア、ブランドサイト、ドキュメント、意欲の高い訪問者向けの製品ページ。
- **避ける場面**: タスク集中型のモバイル UI、初心者向けの単純なフロー。
- **代表例**: ソースに挙がるのはスタイルスキルの名前（minimalist-ui、industrial-brutalist-ui）と、レポート上の「Bold typography」「kinetic typography」です。個別の完成サイト名はありません。
- **ソース**:
  - [X: @OnePageLove 2026-09-13、エディトリアルデザインとセリフの事例](https://x.com/OnePageLove/status/2099107914522718443) L9
  - [X: @Shahporan_Razu 2026-10-28、スタイルスキル](https://x.com/Shahporan_Razu/status/2115126383999623462) L3
  - Kairo の Trend 1 と 4、Figma の Trend 4「Bold typography」（[Figma のトレンド記事](https://www.figma.com/resource-library/web-design-trends/)）、Lounge Lizard「kinetic typography」（[Lounge Lizard の 2026 トレンド](https://www.loungelizard.com/news/lounge-lizard-unveils-the-future-of-digital-experiences-2026-web-design-trends/)）
- **トレンド時期**: 2025〜2026
- **確度**: 中。X での反応は小さく、主にレポートが根拠です。

## T13. 3D／WebGL の没入型サイト

- **タグ**: #visual #interaction
- **概要**: Three.js、WebGL、シェーダーによる 3D 体験が、AI 支援で以前より低コストになっている、という見方。
- **特徴・適用方法**: スクロール連動の 3D、パーティクル、製品を回転して見せる、AR プレビュー。性能予算と、通常の 2D 版へのフォールバックを用意する。
- **向く場面**: 高単価のブランド、不動産、ハードウェア、キャンペーンサイト。
- **避ける場面**: SEO、速度、アクセシビリティを重視するコンテンツサイト、業務アプリ。
- **代表例**: Three.js、WebGL。個別のプロダクト名はソースにありません。
- **ソース**:
  - [X: @RealMarvelX 2026-08-16](https://x.com/RealMarvelX/status/2088868098199687465) L109
  - [X: @RoundtableSpace 2026-08-08（UTC）](https://x.com/RoundtableSpace/status/2086229720534806937) L145 / V60,551。逸話系の投稿
  - [Figma のトレンド記事（Trend 1: 3D and immersive）](https://www.figma.com/resource-library/web-design-trends/)
- **トレンド時期**: 2026 通年
- **確度**: 中〜高。「1 プロンプトで高額受注」といった誇張された投稿が多い点に注意。

## T14. エージェント UX パターン（意図プレビュー・承認ゲート）

- **タグ**: #interaction #ai-agent
- **概要**: AI が代わりに行動するプロダクト向けの UI パターン。「誰が、なぜ、どの権限で」動いたかを見えるようにする。
- **特徴・適用方法**:
  - 意図のプレビュー（計画の提示）と、活動の記録。
  - 権限の境界: 読み取り、提案、実行、継続実行を区別する。
  - 段階的な承認ゲート: 読み取りは灰色で確認なし、書き込みは青で 1 回確認、破壊的な操作は赤で毎回確認。
  - 承認をまとめて行えるようにする。一時停止、引き継ぎ、ロールバックの手段を用意する。
  - 結果に「検証したこと／仮定したこと／できなかったこと」を添える。
- **向く場面**: AI エージェント機能、自動化ツール、コーディングエージェント、業務の代行。
- **避ける場面**: 単純な生成機能（過剰な確認は疲れを生む）。
- **代表例**: 個別のプロダクト名はソースにありません。パターン名は意図のプレビュー、活動の記録、段階的な承認ゲートです。
- **ソース**:
  - [X: @yyogeshwar 2026-10-22（UTC）](https://x.com/yyogeshwar/status/2113255359426998402) L1
  - [X: @mack_designer 2026-09-21（UTC）、エージェントが提示する情報源の見せ方](https://x.com/mack_designer/status/2101926939334210041) L5
  - [When systems act for users（ACM Interactions、2026年9-10月）](https://interactions.acm.org/archive/view/september-october-2026/when-systems-act-for-users)
  - [AI agent UI design patterns](https://www.setproduct.com/blog/ai-agent-ui-design-patterns)
  - [ACM 論文](https://dl.acm.org/doi/10.1145/3776591.3832499)
- **トレンド時期**: 2026 下期
- **確度**: 高。根拠は Web と論文です。X 上の話題量は小さいです。

## T15. Generative UI

- **タグ**: #interaction #ai-agent
- **概要**: AI が文脈に合わせて UI 部品をその場で生成・提示する。
- **特徴・適用方法**: 質問フォームを GUI にしただけの浅い実装と、人とエージェントが協働する適応的な GUI とを区別する。派手なデモより「小さな動的要素」が効く。コマンドパレットや会話入力をワークフローの中心に置く。
- **向く場面**: アシスタント、ダッシュボード、メール、CRM のように文脈が大きく変わる画面。
- **避ける場面**: 学習コストを抑えたい初心者向け UI（発見しやすさが落ちる）。
- **代表例**: CopilotKit のテンプレート。ほかに個別のプロダクト名はソースにありません。
- **ソース**:
  - [X: @realWeZZard 2026-10-10](https://x.com/realWeZZard/status/2108895961171075408) L8
  - [X: @leeadkins 2026-09-20（UTC）](https://x.com/leeadkins/status/2101730129890197600) L2
  - [X: CopilotKit のテンプレート、2026-10-04](https://x.com/ataiiam/status/2106731156691615978) L171
  - Kairo の Trend 2「AI-Contextual Interfaces」（[Kairo の 2026 トレンドレポート](https://www.kairocreations.com/kairo-tools/articles/2026-web-design-trends-report)）
- **トレンド時期**: 2026 下期
- **確度**: 中

## T16. Spec 駆動のデザイン受け渡し

- **タグ**: #workflow #system
- **概要**: 画面の受け渡しから、Spec（PRD や受け渡しの文脈）をキャンバス上で作り、MCP 経由でコーディングエージェントへ送る形に変わりつつある。
- **特徴・適用方法**: Figma Specs で、ラフなアイデアから詳細な仕様を作り、MCP でエージェントへ送り、Code Layer で仕上げる。Guidelines（ライブラリの使い方の規約）を併用する。
- **向く場面**: PM、デザイナー、エンジニアの協働、エージェントへの実装委任。
- **避ける場面**: 探索の初期段階。
- **代表例**: Figma Specs、Guidelines、Code Layer。社内事例として挙がっているのは Reddit の AI プロトタイプ環境（投稿の主張）です。
- **ソース**:
  - [X: @figma 2026-10-21](https://x.com/figma/status/2112669039009104059) L353
  - [X: @figma 2026-10-15](https://x.com/figma/status/2110618179982749940) L981 / V7,224,396
  - [X: Reddit 社内の AI プロトタイプ環境、2026-10-26（UTC）](https://x.com/clairevo/status/2114748638065049799) L63
- **トレンド時期**: 2026-10〜
- **確度**: 中

## T17. Bento grid（定番化）

- **タグ**: #layout #mature
- **概要**: 大きさの違うタイルを格子状に並べる構成。すでに定番で、AI の既定レイアウトとも重なりやすい。
- **特徴・適用方法**: 情報の重要度に合わせてタイルのサイズに差をつけ、スムーズな動きを加える。
- **向く場面**: 機能紹介、ダッシュボード、ポートフォリオ。
- **避ける場面**: タイルの大きさがすべて同じになるとき（AI スロップの「同じ形のカード」と同じになる）。
- **代表例**: レイアウト名としての bento。ソースに挙がる制作ツールは Framer です。
- **ソース**:
  - [X: @rcharl03 2026-09-21（UTC）、Framer](https://x.com/rcharl03/status/2102043925900939541) L88
  - [X: スタイル一覧、2026-09-04（UTC）](https://x.com/Keot_jem/status/2095814237197045962) L17
- **トレンド時期**: 2023〜（2026 年は定番）
- **確度**: 中

## T18. ビビッド配色、レトロ・Y2K・レトロフューチャー

- **タグ**: #color #visual
- **概要**: 彩度の高い「ドーパミン」配色、Y2K への郷愁、レトロフューチャーやフルーティガーエアロの再評価。
- **特徴・適用方法**: ネオングラデーション、高コントラストの組み合わせ、クロームや光沢の質感。
- **向く場面**: ライフスタイル、美容、若年層向けブランド、音楽、ゲーム。
- **避ける場面**: B2B や金融など、信頼感が重要な領域。
- **代表例**: 個別のプロダクト名はソースにありません。名前が挙がっているのはレトロフューチャー、フルーティガーエアロ、ビビッド配色です。
- **ソース**:
  - [Figma のトレンド記事（Trend 3: Vibrant color palettes）](https://www.figma.com/resource-library/web-design-trends/)
  - [X: レトロフューチャー、2026-08-11（UTC）](https://x.com/m_hamza_saleem/status/2087111507540893871) L21
  - [X: フルーティガーエアロの議論、2026-09-16（UTC）](https://x.com/guywiththepie/status/2100263241393827955) L21
- **トレンド時期**: 2026（主にレポート上の話）
- **確度**: 低〜中。X での反応は小さいです。UI 実務での普及は未確認です。

---

## 調べたが採用を見送った・保留したもの

同じ書式の項目には入れていません。確度が低い、または期間内の根拠が足りないためです。

- **ブルータリズム、スイススタイル**: 指定期間の X で高エンゲージメントの投稿を確認できなかった（スタイルスキルの名前として出てくる程度）。未確認。
- **空間 UI（visionOS）**: 作品投稿はあるが反応が小さい（L4〜5）。確度は低い。
- **会話型 UI を「2027 年の言葉」とする予測**: [@rajanndube の投稿](https://x.com/rajanndube/status/2086531125338685715)（L9）のみ。未確認。
- **日本語圏の背景観察**: [@sigekun（2026-10-30）](https://x.com/sigekun/status/2115978083048243685) が「UI のトレンドは数年おきに変わるので、手を入れないと古く見える」と投稿。L1,175 / V43,330。個別の手法ではなく、背景の観察として記録する。
