# Xで話題のデザイン系エージェントスキル（2026年10月下旬）

checked on 2026-10-31（JST）。GitHub API のスター数と、下に挙げる X 投稿の本文・公開カウンタは 2026-10-30 22時台 UTC に取得した。

仕組みの長所短所を10スキル分比較した正本は [comparison.md](comparison.md)。あちらはスター数と技術記事を根拠にしており、X の投稿は直接測っていない。本文はそれを繰り返さず、次の3つだけを足す。

1. 個別の status URL から取り直せた X の会話。
2. その会話、公式ドキュメント、インストール数の掲載で名前が出るが、[comparison.md](comparison.md) の表に無いスキル。
3. インストール数の代理指標（Skillselion の表示）。スター数は同日の GitHub API を使い、Skillselion の★列は使わない。

## 調査方法と限界

- X のキーワード検索はログイン壁で網羅できない。本文の「確認できた投稿」は、status URL を [fxtwitter](https://github.com/FixTweet/FixTweet) の公開 API で取り直し、本文とカウンタが返ったものだけ。
- 二次ダイジェスト [UI design skills (2026-10-14)](https://nuts.nvirellia.im/digests/2026-10-14-ui-design-skills) は Ibrahim Elkamali の投稿 URL に「687 likes / 782 bookmarks」を付けている。同じ URL の実測は likes 2、bookmarks 0。ダイジェストのいいね数は採用しない。届いているのは別 URL の Leon Lin 本人の発表投稿。
- スター数はリポジトリ単位。`anthropics/skills` の 185,266 は frontend-design 単体の人気ではない。
- インストール数は [Skillselion のデザインハブ](https://skillselion.com/design)（ページ表記 Updated October 30, 2026）が表示した値。skills.sh レジストリ由来とページが説明している。再集計はしていない。同ページの★は同日の GitHub API とずれている（例: taste-skill を 84.6k と表示、API は 106,290）。
- このハブの上位には React 性能ルールやスライドショーも混ざる。「デザイン」の境界は掲載側の分類。
- コミュニティ製の Figma 向けスキルは、Figma の解説ページに名前があるだけで、個別リポジトリは未確認。表には入れない。

## 確認できた X の投稿

| 日時 (UTC) | 投稿 | 確認したカウンタ | 内容 |
|---|---|---|---|
| 2026-10-13 21:34 | [Leon Lin @LexnLin](https://x.com/LexnLin/status/2110122106537050584) | likes 4,720 / bookmarks 8,868 / reposts 234 / replies 103 / quotes 51 / views 575,415 | Taste Skill を一から作り直し、v2 はアートディレクション、素材、ブラウザ検証を持つ、と発表。導入は `npx skills add Leonxlnx/taste-skill` |
| 2026-10-13 00:19 | [greco @greco_dev](https://x.com/greco_dev/status/2109801175629660208) | likes 440 / bookmarks 616 / replies 25 / views 29,157 | AI の癖を直すデザインスキルを募集 |
| 2026-10-13 03:45 | [Mauro Edgar @tuxito](https://x.com/tuxito/status/2109852951153885597)（上記への返信） | likes 1 / bookmarks 2 / views 543 | `/impeccable` は良いが、Claude の `/design` には敵わない |
| 2026-10-13 23:42 | [Ibrahim Elkamali](https://x.com/IbrahimElkamali/status/2110154182485217578) | likes 2 / bookmarks 0 / replies 1。views はこの取得では未取得 | Fable 5.1 で「スキルなし / frontend-design / Taste v1 / Taste v2」を比較し、v2 が一番だったと書いている。到達は小さい |
| 2026-10-13 13:00 | [Julian Oczkowski](https://x.com/JulianOczkowski/status/2109992612782321919) | likes 1 / views 46 | デザイナー向け5つとして `/design`、自分の Designer Skills、Taste Skill、frontend-design、theme-factory を列挙。作者本人の紹介で、到達は小さい |
| 2026-10-12 19:37 | [Yucong @yucong1006](https://x.com/yucong1006/status/2109730246983647728) | likes 0 / views 6 | ボトルネックは審美眼より検証、と書き、webapp-testing などを挙げている。本文は確認できたが、話題量の証拠にはならない |

10月下旬（10/20 以降）の status URL は、今回の検索では取り直せなかった。下旬の公開面で動いていたのは Skillselion の順位（10/30 更新）、Taste Skill のパッチ（v2.1.5 は 2026-10-25）、huashu-design と Impeccable の push（どちらも 2026-10-30）である。

## 総合表

★は 2026-10-30 UTC の GitHub API。インストール数は Skillselion の表示（無いものは unknown）。詳細比較は [comparison.md](comparison.md)。

| # | スキル | 作者 / リポジトリ | ★ | インストール数 | 今回の位置づけ |
|---|---|---|---|---|---|
| 1 | frontend-design | [anthropics/skills](https://github.com/anthropics/skills) | 185,266（リポジトリ全体） | 1M | 公式の軽い方向づけ。Skillselion 1位。X でも比較対象になる |
| 2 | Taste Skill（`design-taste-frontend`） | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | 106,290 | 703k | 今回確認した X でいちばん届いている発表（v2、10/13） |
| 3 | web-design-guidelines | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | 33,261（リポジトリ全体） | 803k | 見た目の方向ではなく監査。comparison の Vercel 行 |
| 4 | UI/UX Pro Max | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | 143,019 | 424k | 知識ベース検索。確認した X 投稿には名前が無い |
| 5 | Impeccable | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | 96,975 | unknown | greco スレで名前が出た。インストール数は未取得 |
| 6 | Claude `/design` | Anthropic（プロプライエタリ） | unknown | unknown | tuxito が Impeccable より上、と返信。オープンなスキルではない |
| 7 | theme-factory | [anthropics/skills の theme-factory](https://github.com/anthropics/skills/blob/main/skills/theme-factory/SKILL.md) | 185,266（同じリポジトリ） | unknown | Julian の5つのうち1つ。到達は小さい |
| 8 | designer-skills | [julianoczkowski/designer-skills](https://github.com/julianoczkowski/designer-skills) | 595 | unknown | 同上。最終 push は 2026-07-06 |
| 9 | webapp-testing | [anthropics/skills の webapp-testing](https://github.com/anthropics/skills/blob/main/skills/webapp-testing/SKILL.md) | 185,266（同じリポジトリ） | unknown | Yucong の投稿が言及。その投稿の views は 6 |
| 10 | huashu-design | [alchaincyf/huashu-design](https://github.com/alchaincyf/huashu-design) | 28,225 | unknown | comparison の表に無い。X の status は未確認 |
| 11 | Figma 公式スキル一式 | [figma/mcp-server-guide](https://github.com/figma/mcp-server-guide) | 2,131 | unknown | 公式ドキュメントとリポジトリで実在を確認。X の status は未確認 |
| 12 | Canva Agent Skills | [canva-sdks/canva-skills](https://github.com/canva-sdks/canva-skills) | 140 | unknown | 公式リポジトリ。最終 push 2026-10-23。X の status は未確認 |
| 13 | pstack の体験・設計原則 | [cursor/plugins の pstack](https://github.com/cursor/plugins/tree/main/pstack) | 14,714（plugins 全体）。ミラー [backnotprop/pstack](https://github.com/backnotprop/pstack) は 3,225 | unknown | UI 生成スキルではない。X の status は未確認 |

Skillselion は同じ taste-skill リポジトリに `high-end-visual-design`（459k）、`redesign-existing-projects`（459k）、`minimalist-ui`（425k）も出している。2026-10-30 時点の GitHub 上 `skills/` は `taste-skill` ディレクトリだけだった。分割後の実体は未追跡なので、この3行は表に入れない。

## comparison.md にあるスキル（X と導入だけ）

長所・短所・design-nexus への取り込みは [comparison.md](comparison.md) の表と「統合スキルへの反映」。ここには 10 月の会話で足せる事実だけを書く。

### frontend-design

- **何をするか:** 新しい UI や作り直しの前に、主題に根ざした見た目の方向、タイポグラフィ、定番ルックの回避を指示する単一の `SKILL.md`。[SKILL.md](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md)。
- **入れ方:** Claude Code は `/plugin install frontend-design@claude-plugins-official`（[マーケットプレイス](https://claude.com/marketplace/plugins/frontend-design)）。Skillselion は `npx skills add https://github.com/anthropics/skills --skill frontend-design` と書いている。Cursor / Codex も Agent Skills の配置先に同じフォルダを置ける。
- **長所 / 注意:** 軽く、インストール数の表示では先頭。検証も永続化も無い。詳細は comparison の1行目。
- **design-nexus:** 方向づけの元になっている。このリポジトリに重ねて常時読み込ませる対象ではない。

### Taste Skill v2

- **何をするか:** コーディングエージェントにアートディレクション、参照画像、ブラウザ検証を渡す。[README](https://github.com/Leonxlnx/taste-skill) と [v2.1.0 リリース](https://github.com/Leonxlnx/taste-skill/releases/tag/v2.1.0)（2026-10-18）では、ダッシュボードとアプリ画面をページと分け、3幅の検査と修正ラウンドを持つ。v2.1.5 は 2026-10-25。
- **入れ方:** `npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"`。README は Node 22+ と Chrome / Edge / Chromium を要求し、API キーは不要と書いている。
- **長所 / 注意:** 今回の X では唯一、万単位の views を確認できた発表。コストと依存は comparison の3行目（1ビルド 30〜45 分、ランディング寄り）。v2.1 でアプリ画面を足した、というリリースノートは comparison 執筆時点の要約より新しい。
- **design-nexus:** 「3案 → 3幅で見て直す」の元。ブラウザ検証を足した点が、X 上で v1 との差として語られている。

### Impeccable

- **何をするか:** `polish` / `bolder` で方向を足し、`critique` / `audit` でレビューし、AI スロップを検出する語彙。[README](https://github.com/pbakaus/impeccable)。
- **入れ方:** プロジェクトルートで `npx impeccable install`。エージェント側は `/impeccable init`（Codex は `$impeccable init`）。Claude Code、Cursor、Codex を README が名指ししている。
- **長所 / 注意:** greco スレで名前が出た。tuxito は `/design` の方が上、と書いている（返信自体の views は 543）。検出器と `DESIGN.md` は comparison の4行目。
- **design-nexus:** 操作語彙と決定的検出の元。

### UI/UX Pro Max と Vercel web-design-guidelines

どちらも確認した6投稿の本文には出てこない。Skillselion では web-design-guidelines が 803k、UI/UX Pro Max が 424k。役割は comparison の2行目と7行目（知識ベース検索、コード品質の監査）。見た目の話題の中心は frontend-design と Taste 側にある。

## comparison.md の表に無いスキル

### Claude Code の `/design`

- **作者:** Anthropic。オープンな `SKILL.md` ではない。[Claude Code のコマンド一覧](https://code.claude.com/docs/en/commands) と、2026-08-17 週の [リリースノート](https://code.claude.com/docs/en/whats-new/2026-w34)。製品ページは [Claude Design](https://claude.com/product/design)。
- **何をするか:** ブリーフから UI モック、画面フロー、ランディング、ポスターを1枚のキャンバス上のアートボードとして出し、ブラウザで編集してから実装に戻す。2026-08 の初出は Pro / Max / Team / Enterprise、Claude Code v2.1.234 以降。2026-10-30 に取得したコマンド一覧では v2.1.265 以降、アーティファクトが使えるセッション、Design テンプレートが有効なアカウント、と書いてある。
- **入れ方:** プラグインインストールではない。条件を満たす Claude Code で `/design [brief]`。同意は `/design consent`。リポジトリの React デザインシステムをアップロードする `/design-sync` は、スタンドアロンの claude.ai/design が 2026-12-14 までに閉じる、とコマンド一覧が書いている。
- **長所:** X では「オープンなスキルより `/design`」という返信がある（tuxito）。複数案を見てから実装する流れは、Taste や design-nexus の3案と目的が近い。
- **注意:** プロプライエタリで、改変して design-nexus に取り込めない。Bedrock 等、アーティファクトが無い環境ではコマンドが無い、とコマンド一覧が書いている。利用上限の共有は comparison の注記を参照（本文では再計測していない）。
- **design-nexus:** 統合の対象外、という comparison の判断はそのまま。利用者が Claude Code 上で案を見る手段としては別物。

### theme-factory

- **作者:** Anthropic。[SKILL.md](https://github.com/anthropics/skills/blob/main/skills/theme-factory/SKILL.md)。
- **何をするか:** スライド、文書、HTML などに、10個の既製テーマ（色とフォントの組）を当てる。`theme-showcase.pdf` を見せて選ばせ、選んだテーマファイルを読む。どれも合わなければその場でテーマを作る、と SKILL.md が書いている。
- **入れ方:** `anthropics/skills` の `skills/theme-factory` を Agent Skills のディレクトリに置く。Claude Code なら example-skills 経由でも配られる（frontend-design と同じリポジトリ）。
- **長所:** 既存の成果物を短時間で揃えたいときに、選ぶメニューがある。
- **注意:** 既製パレットであり、主題から方向を起こすスキルではない。X での言及は Julian の投稿（views 46）で確認した範囲に限る。
- **design-nexus:** 役割が違う。`DESIGN.md` のトークンを、10テーマのどれかで上書きする用途には向かない。

### canvas-design

- **作者:** Anthropic。[SKILL.md](https://github.com/anthropics/skills/blob/main/skills/canvas-design/SKILL.md)。
- **何をするか:** ポスターや静止画を、デザイン哲学のメモのあと PNG または PDF で出す。Web UI の実装手順ではない。
- **入れ方:** `skills/canvas-design` を配置する。
- **長所 / 注意:** 公式パックの視覚スキルとして実在する。確認した X 投稿には名前が無い。
- **design-nexus:** 対象外（プロダクト UI / マーケページの実装と検査）。

### designer-skills

- **作者:** Julian Oczkowski。[julianoczkowski/designer-skills](https://github.com/julianoczkowski/designer-skills)。★595、最終 push 2026-07-06、Apache-2.0。
- **何をするか:** README の流れは `/design-flow` が `/grill-me` → `/design-brief` → `/information-architecture` → `/design-tokens` → `/brief-to-tasks` → `/frontend-design` → `/design-review` を順に案内する。`/design-review` はブリーフとコードに加え、動いている画面のスクリーンショットを必須にしている。
- **入れ方:** `npx skills add julianoczkowski/designer-skills`。Claude Code は `/plugin marketplace add julianoczkowski/designer-skills` のあと `/plugin install designer-skills@designer-skills`。README は Claude Code、Cursor、Codex を含む、と書いている。
- **長所:** 着手前の質問、トークン、レビューが分業されている。スクリーンショット無しのレビューを禁止している点は、検証不足への反論と方向が同じ。
- **注意:** 10月の X での確認は作者の投稿（views 46）だけ。リポジトリは7月以降 push が無い。同名の `/frontend-design` は Anthropic 公式とは別ファイル。
- **design-nexus:** grill → brief → tokens → review は、build / system / audit に既に畳んである。プロセスの参考にはなる。中身を二つ同時に読むと指示が衝突する。

### webapp-testing

- **作者:** Anthropic。[SKILL.md](https://github.com/anthropics/skills/blob/main/skills/webapp-testing/SKILL.md)。
- **何をするか:** ローカル Web アプリを Python の Playwright で開き、動作確認、スクリーンショット、ブラウザログを取る。見た目の方向は持たない。
- **入れ方:** `skills/webapp-testing` を配置する。SKILL.md は同梱の `scripts/with_server.py` を `--help` から使う、と書いている。
- **長所:** 「作ったあとに自分で開く」を公式スキルにしている。
- **注意:** 言及元の X 投稿は views 6。Python Playwright が要る。
- **design-nexus:** レンダーチェック（`render-check.mjs`、Playwright があれば実行、無ければ lint のみ）と役割が重なる。両方を常時スキルとして読む必要はない。

### huashu-design

- **作者:** [alchaincyf/huashu-design](https://github.com/alchaincyf/huashu-design)。★28,225、push 2026-10-30、MIT（README は 2026-05-14 から MIT、と書いている）。
- **何をするか:** 一文から、Web、App 原型、編集可能な PPTX、情報図、アニメを HTML ネイティブに出す。README は Claude Code、Cursor、Codex などを名指しする。3.0 は六つのサムネイルから三つを本制作し、参照作品はスクリーンショットしてから借り、事実だけを見るデザイン検査と、過去の見た目を覚える台帳を持つ、と README が説明している。3.1 は小紅書向けの縦画像を足した、と冒頭にある。
- **入れ方:** `npx skills add alchaincyf/huashu-design`。README は、`references/` や `scripts/` が欠ける古い skills CLI（1.5.15 以前）だと単一ファイルしか入らない、と警告し、ダメなら `git clone` を `~/.claude/skills/huashu-design` に置くよう書いている。
- **長所:** comparison の10スキルに無かった、東アジアの書体・版面を正面から扱う生成スキル。★は API で 28,225 あり、10/30 に push がある。
- **注意:** スタイル数は README 冒頭が 92 種、3.0 の節が 84 種と食い違う。どちらが現行かは未確認。X の status URL は未取得。成果物の品質は README の自己事例であり、第三者の計測は本文では未実施。
- **design-nexus:** 和文組版は design-nexus が comparison の時点で「他スキルに無い」とした箇所。huashu はそこを別実装で埋めに来ている。取り込みは [loop/IMPROVEMENT.md](../loop/IMPROVEMENT.md) の1仮説ずつが条件で、この文書は採用ではない。

### Figma 公式スキル

- **作者:** Figma。[スキル一覧（Help Center）](https://help.figma.com/hc/en-us/articles/39166810751895-Figma-skills-for-MCP)、[リモート MCP の導入](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/)、実体は [figma/mcp-server-guide の skills/](https://github.com/figma/mcp-server-guide)。2026-10-30 時点のディレクトリは `figma-use`、`figma-use-figjam`、`figma-use-slides`、`figma-use-motion`、`figma-generate-design`、`figma-generate-library`、`figma-generate-diagram`、`figma-code-connect`、`figma-code-workflows`、`figma-create-new-file`、`figma-design-to-code`、`figma-implement-motion`、`figma-swiftui`、`figma-spec`、`figma-shaders`、`figma-generative-plugins`。
- **何をするか:** MCP（`https://mcp.figma.com/mcp`）経由で、ファイル上のコンポーネントと変数を読んで書く。Help Center は `figma-use` をキャンバスへの書き込み、`figma-generate-design` を既存のデザインシステム部品で画面を組むスキル、`figma-generate-library` をコードからライブラリ部品を起こす例、と説明している。
- **入れ方:** Claude Code は `claude plugin install figma@claude-plugins-official`。Cursor はチャットで `/add-plugin figma` のあと、Settings の MCP で Figma に接続。手動で MCP だけ足すとスキルは入らない、と Figma の導入文書が書いている。
- **長所:** デザインシステムの実ファイルが正本になる。生成物が「それっぽい HTML」で終わらず、編集できる Figma になる。
- **注意:** アカウント接続とファイルの編集権限が要る。Figma の解説 [10 Claude Skills for Design](https://www.figma.com/resource-library/claude-skills-for-design/) が挙げる `/audit-design-system`、`/apply-design-system`、`/create-voice`、`/rad-spacing`、`/sync-figma-token`、`/cc-figma-component` はコミュニティ作として名前だけ確認した。リポジトリ URL は未確認なので導入手順は書かない。X の status は未取得。
- **design-nexus:** 競合するアートディレクターではない。`DESIGN.md` や実装を Figma に写すときに併用する。トークンの正本を Figma 変数と `DESIGN.md` の両方に置くと、どちらが勝つかを先に決める必要がある。

### Canva Agent Skills

- **作者:** Canva。[canva-sdks/canva-skills](https://github.com/canva-sdks/canva-skills)。★140、push 2026-10-23。
- **何をするか:** 既存の Canva デザインに対する操作。2026-10-30 時点で有効なのは `resize-for-social-media`、`bulk-create`、`implement-feedback`、`edit-design`、`get-design-feedback`、`brand-check`、`cli`。README は、ソーシャル各サイズへの書き出し、表データからの一括生成（autofill は Canva Enterprise）、コメントの反映、ブランドキットとの差分確認、を説明している。
- **入れ方:** MCP は `https://mcp.canva.com/mcp`。Claude Code は `/plugin marketplace add canva-sdks/canva-skills` のあと `/plugin install canva@canva-skills`。Codex は `codex plugin marketplace add canva-sdks/canva-skills`、`codex plugin add canva@canva-skills`、`codex mcp login canva`。Cursor はマーケットプレイスのマニフェストがあり、このリポジトリを開いて MCP の `canva` にサインインする、と README が書いている。
- **長所:** 書き出しとブランドチェックが API の範囲で手順化されている。
- **注意:** UI の実装品質や反スロップのスキルではない。★140。X の status は未取得。
- **design-nexus:** マーケの成果物を Canva に乗せる後段。design-nexus の build / audit の代わりにはならない。

### pstack（体験と設計の原則）

- **作者:** poteto。正本は [cursor/plugins/pstack](https://github.com/cursor/plugins/tree/main/pstack)。README は [x.com/poteto](https://x.com/poteto) を名乗っている。今回、pstack 自体の status URL は取り直せなかった。
- **何をするか:** UI の見た目を生成するパックではない。エージェントの実装品質のためのスキル群で、デザインに触れるのは原則スキルのうち次の二つ。
  - [`principle-experience-first`](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-experience-first/SKILL.md): 実装の都合とユーザーの快さが衝突したら快さを取る。機能は少なく、磨いて出す。
  - [`principle-exhaust-the-design-space`](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-exhaust-the-design-space/SKILL.md): 先例の無い UI や構造では、2〜3 の試作を並べてから決める。見た目の感触が論理だけでは決まらない判断にも使う、と本文がある。
  - [`architect`](https://github.com/cursor/plugins/blob/main/pstack/skills/architect/SKILL.md) は型とモジュール境界のスケッチであり、視覚デザインではない。
  - [`make-bot-ui`](https://github.com/cursor/plugins/blob/main/pstack/skills/make-bot-ui/SKILL.md) は Grok Bot を起こす webhook 画面の作り方で、デザイン品質スキルではない。
- **入れ方:** Cursor は `/add-plugin pstack`。Claude Code は `/plugin marketplace add cursor/plugins` のあと `/plugin install pstack@cursor-plugins`。コマンドは `/pstack:` が付く、と README が書いている。単体なら `npx skills add https://github.com/cursor/plugins --skill make-bot-ui` のようにスキル名を指定できる（[skills.sh の掲載](https://www.skills.sh/cursor/plugins/make-bot-ui)）。原則スキルの frontmatter は `disable-model-invocation: true` で、単体では自動起動しない。
- **長所:** 「少なく磨く」「2〜3 案を並べる」は、見た目スキルがプロンプトで言っていることを、実装判断の原則として別経路で言っている。
- **注意:** plugins リポジトリの★は pstack 単体ではない。視覚のトークン、コントラスト、和文組版は持たない。X 上の到達は未計測。
- **design-nexus:** 視覚の正本にはしない。eval やリデザインで「案を複数出してから決める」を守れているかの対照には使える。pstack 全体をこのリポジトリのエージェントに常時足すと、コード削除や検証の原則まで同時に入る。デザイン品質の比較対象としては範囲が広い。

## 実在は確認したが表に入れなかったもの

| 名前 | 確認した事実 | 外した理由 |
|---|---|---|
| [claudiusararu/unslop-ui-skill](https://github.com/claudiusararu/unslop-ui-skill) | ★2、push 2026-06-28。AI の見た目の癖を列挙する `TELLS.md` | 10月の話題としての根拠が無い |
| [uizze/uizze の anti-ui-slop](https://github.com/uizze/uizze/blob/main/skills/anti-ui-slop/SKILL.md) | リポジトリ ★77、push 2026-10-24。SKILL.md は実在 | X の status を未確認。画面コーパスは同スキルの自己申告 |
| [rgranet/designlint-skill](https://github.com/rgranet/designlint-skill) | ★1、push 2026-03-22 | 到達が確認できない |
| Anthropic `brand-guidelines` | [SKILL.md](https://github.com/anthropics/skills/blob/main/skills/brand-guidelines/SKILL.md) は Anthropic 自身の色と書体 | 一般の UI 品質スキルではない |

## このリポジトリで先に試すもの

1. **design-nexus を正本のまま使う。** 10月に X で届いていた主張は、Taste v2 の「方向づけ + 素材 + ブラウザで確認」（views 575,415 の発表）と、募集スレ（views 29,157）への「`/design` の方が上」という短い返信である。方向づけと検証は [comparison.md](comparison.md) が既に1スキルへ畳んでいる。frontend-design と Taste と Impeccable をこのリポジトリへ追加で常時読み込ませると、comparison が書いた「指示の衝突」がそのまま起きる。
2. **別プロジェクトで1つだけ触るなら frontend-design。** 公式で、Skillselion の表示インストール数が先頭（1M）で、依存が `SKILL.md` だけ。Taste v2 は X 上の実演としては一番具体的だが、Node 22 と Chromium、30分級のトークンを README とリリースが前提にしている。Impeccable は既存画面の audit 向け（comparison）。
3. **このリポジトリの次の材料にするなら、huashu-design の和文・東アジアの版面。** ★28,225 で 10/30 に更新がある。採用は実験ログと `node eval/run.mjs compare` が条件（[loop/IMPROVEMENT.md](../loop/IMPROVEMENT.md)）。この文書は仮説の候補リストであり、スキル本体は変えていない。
4. **Figma 公式スキルは、Figma ファイルが正本のときだけ。** Canva はソーシャル書き出し。pstack は実装原則。theme-factory と canvas-design はスライドとポスター。どれも design-nexus の置き換えではない。

## 出典

X（本文とカウンタを 2026-10-30 UTC に再取得）:

- https://x.com/LexnLin/status/2110122106537050584
- https://x.com/greco_dev/status/2109801175629660208
- https://x.com/tuxito/status/2109852951153885597
- https://x.com/IbrahimElkamali/status/2110154182485217578
- https://x.com/JulianOczkowski/status/2109992612782321919
- https://x.com/yucong1006/status/2109730246983647728

リポジトリと公式:

- https://github.com/anthropics/skills
- https://github.com/Leonxlnx/taste-skill
- https://github.com/pbakaus/impeccable
- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- https://github.com/vercel-labs/agent-skills
- https://github.com/alchaincyf/huashu-design
- https://github.com/julianoczkowski/designer-skills
- https://github.com/figma/mcp-server-guide
- https://github.com/canva-sdks/canva-skills
- https://github.com/cursor/plugins/tree/main/pstack
- https://code.claude.com/docs/en/commands
- https://code.claude.com/docs/en/whats-new/2026-w34
- https://help.figma.com/hc/en-us/articles/39166810751895-Figma-skills-for-MCP
- https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/
- https://www.figma.com/resource-library/claude-skills-for-design/
- https://skillselion.com/design
- https://nuts.nvirellia.im/digests/2026-10-14-ui-design-skills （カウンタは不採用。URL の手がかりとしてのみ）
