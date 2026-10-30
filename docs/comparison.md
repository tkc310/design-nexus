# デザイン系エージェントスキル比較レポート

調査日: 2026-10-30 / スター数は同日に各 GitHub リポジトリページで確認した値(記事によって数値が大きく異なるため、リポジトリページを優先)。

## 調査方法と限界

- 対象: 「GitHub スター数が多い」かつ「技術記事・ランキングで繰り返し取り上げられている」デザイン系スキル。
- 話題性の根拠: 技術記事・比較記事(Qiita を含む)・インストール数ランキング(skillselion)。**X(Twitter)の投稿は検索エンジン経由で取得できなかったため直接は計測していません。** 記事・ランキング・スター数を話題性の代理指標としています。
- 公開リポジトリの README と SKILL.md を読んで仕組みを確認し、短所は README の制約記載と第三者レビューから拾っています。

## 総合比較表

| # | スキル | リポジトリ | ★ | 種別 | 主な長所 | 主な短所 |
|---|---|---|---|---|---|---|
| 1 | **frontend-design**(Anthropic公式) | anthropics/skills | 167k | 生成(アートディレクション) | 主題に根ざす、トークン計画→自己レビューの手順、3つの「AIっぽい定番ルック」を明示的に回避、UIコピー指針、軽量 | 永続的なデザイン契約がない(ページ・セッション間で一貫しない)、検証は自己申告のみ、モデル性能に依存 |
| 2 | **UI/UX Pro Max** | nextlevelbuilder/ui-ux-pro-max-skill | 142.9k | 知識ベース検索 | 業種192ルール・配色192・フォント74・22スタックをBM25検索、`MASTER.md`+ページ別上書きで永続化、約25エージェント対応 | 検索結果の整合性が保証されない(ダーク系スタイル+ライト配色の混在例)、結果はテキストでモデルは「目隠し実装」、Python 必須 |
| 3 | **Taste Skill** | Leonxlnx/taste-skill | 105k | 生成(反ジェネリック) | 20方向からランダムに3案提示、3幅でブラウザ検証→上位3問題を最大3周修正、slop判定 | 1ビルド30〜45分・数十万トークン、Node 22+とChrome必須、ランディング/ポートフォリオ寄り |
| 4 | **Impeccable** | pbakaus/impeccable | 95.4k | 品質システム | 24の操作語彙(bolder/quieter/polish…)、LLM不要の62ルール検出器、P0〜P3、編集時フック、`PRODUCT.md`/`DESIGN.md` | セットアップ・フック等の故障点が多い、新規ページ生成は弱め、JSX等ではレンダー前提ルールが動かない、説明文が長く常時コストがかかる |
| 5 | **Emil Kowalski skills** | emilkowalski/skills | 51.4k | モーション専門(16スキル) | 「使用頻度でアニメの要否を決める」表、具体的なイージング曲線と時間、`scale(0)` 禁止やホバーのメディアクエリ制限など具体ルール、break-ui(最悪データでの検証) | 対象がモーション中心。対応エージェントの明記なし |
| 6 | **Hallmark** | nutlope/hallmark | 38.5k | 生成+監査 | Floor/Reflex/Finish の3段階チェック、ヒーローを先に単独レビュー、8幅でレンダーlint、新規コンテキストのサブエージェントによる講評、リデザイン時にリンク・フォーム・ハンドラ消失を検知 | Node 18+・puppeteer・Chrome が必要(なければ静的チェックのみ)、自己完結HTML出力中心、自動起動しないことがある |
| 7 | **Vercel agent-skills**(web-design-guidelines 他) | vercel-labs/agent-skills | 33.2k | コード品質監査 | 100+ルール(フォーカス・フォーム・アニメ・タイポ・画像・ダークモード・タッチ・i18n)、React性能ルール、インストール数上位 | 見た目の方向性は扱わない |
| 8 | **ui-skills** | ibelick/ui-skills | 9.5k | 修正特化 | 余白・a11y・モーション性能など目的別スキルを必要なものだけ読み込む、MCP 提供 | デザインを生成しない(修正専用) |
| 9 | **ai-design-skills** | elayadesign/ai-design-skills | 9.8k | LP生成 | 着手前のヒアリング質問、デザイン値をファイル末尾に集約しフォークで調整、Claude Code/Cursor/Codex/Windsurf/Cline への配布方法を明記 | 現状 landing-page-design の1スキルのみ、評価・改善の仕組みなし |
| 10 | **interface-design** | Dammyjay93/interface-design | 5.8k | プロダクトUI+永続化 | `.interface-design/system.md` に Direction/Tokens/Patterns を保存しセッション間のブレを防ぐ、design-review/deslop | マーケサイトは対象外、初回は方向性確認が必要 |

参考: Anthropic の `/design` スキル(2026-08 リサーチプレビュー)は複数案をアートボードで生成し選んだ案を実装できるが、プロプライエタリで改変不可、利用量上限が Claude Design と共通。オープンなスキルとして統合する対象からは外した。

## 国内記事での扱い

Qiita の「Claude Codeの役に立つフロントデザインのskills10選」(2026-04)は、frontend-design・ui-skills(baseline-ui、fixing-accessibility、fixing-motion-performance)・Vercel の web-design-guidelines を中心に、**「デザイン → 磨き → 検証」の順で複数スキルを順に呼ぶ**使い方を勧めている。まず frontend-design 1つから試すことを推奨。複数スキルを順に呼ぶ運用は手数が多く、スキル間で指示が衝突しやすいので、design-nexus ではこの流れを1スキルのモードとチェックに畳み込んだ。

## 横断的に見えた傾向

1. **プロンプトだけのスキルは「天井」がある。** frontend-design や Taste v1 系は良い指示を与えるが、守れたかを確認する仕組みがない。上位勢(Impeccable、Hallmark、Taste v2)はいずれも決定的チェックやブラウザ検証を足している。
2. **永続化が一貫性を決める。** UI/UX Pro Max(MASTER.md)、Impeccable(DESIGN.md)、interface-design(system.md)はいずれも「プロジェクトの真実を1ファイルに」の方向に収束している。
3. **重さとのトレードオフ。** 検証が強いほど Node/Chrome/Python 依存とトークン消費が増える(Taste は1ビルド30〜45分)。
4. **併用は衝突する。** 比較記事は「3つを同格に読み込むと指示が矛盾する。真実の源を1つに昇格させよ」と指摘している。
5. **対象領域が分断。** Taste/Hallmark はマーケ寄り、interface-design はプロダクトUI寄り、Vercel はコード品質、Emil はモーション。
6. **改善ループを持つスキルはない。** 各スキルの内部に「出力を評価してスキル自体を更新する」仕組みは見当たらなかった。
7. **日本語タイポグラフィへの配慮がない。** どのスキルも欧文前提。

## 統合スキル(design-nexus)への反映

| 取り込んだ長所 | 出典 |
|---|---|
| 主題への接地、トークン計画、シグネチャ要素、3つの定番ルック回避、「ブリーフが常に勝つ」、UIコピー指針 | frontend-design |
| 方向性を3案出して選ぶ、3幅で検証→上位3問題を最大3周 | Taste |
| 業種・製品タイプから方向性を推論する手順、DESIGN.md+ページ上書き | UI/UX Pro Max |
| 操作語彙(bolder/quieter 等)、決定的検出器、P0〜P3 | Impeccable |
| Floor/Reflex/Finish、ヒーロー先行レビュー、新規コンテキスト講評、リデザインの保全ガード、実素材を求める | Hallmark |
| a11y/フォーム/フォーカス/性能のチェック項目 | Vercel web-design-guidelines |
| 状況別に必要な参照だけ読む(段階的開示) | ui-skills |
| プロダクトUI(ダッシュボード等)を一級市民に | interface-design |
| モーション原則(使用頻度による要否判定、ease-out と具体曲線、時間の目安、reduced-motion は「少なく穏やかに」)、最悪データでの検証(harden) | Emil Kowalski |
| 着手前のヒアリング(答えで方向性が変わる質問だけ、最大5問) | elayadesign、Qiita記事の design-requirements-grill |
| 「デザイン → 磨き → 検証」の段階を1スキル内のモードとして統合 | Qiita記事の使い分け |

| 補った短所 | 対策 |
|---|---|
| 検証なし(プロンプトのみ) | 依存ゼロの静的lint(Node標準のみ)+任意のレンダーチェック(Playwright があれば) |
| 依存・コストが重い | lint は依存ゼロ、レンダーは任意で自動的に縮退。quick/standard/deep の3段階予算 |
| 永続化なし | `DESIGN.md` を唯一の真実に。トークン整合性(コントラスト)も自動検査 |
| 検索結果の不整合 | トークン同士のコントラスト・ダーク/ライト整合を lint で決定的に検査 |
| 領域の分断 | サーフェス判定(marketing / product / mobile / content)で参照を切り替え |
| 併用時の衝突 | 優先順位(ブリーフ > DESIGN.md > Floor > 本スキル既定)を明文化 |
| 改善ループなし | 評価ケース+ルーブリック+自動採点+フィードバックログ+1仮説ずつの更新手順 |
| 日本語非対応 | 和文タイポグラフィ指針と lint ルールを追加 |
| Cursor/Codex 対応がまちまち | 1つの正本から Claude Code / Cursor / Codex 用を生成するビルドスクリプト |

## 出典

- [anthropics/skills frontend-design SKILL.md](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md)
- [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)
- [pbakaus/impeccable](https://github.com/pbakaus/impeccable)
- [emilkowalski/skills](https://github.com/emilkowalski/skills) / [emil-design-eng SKILL.md](https://raw.githubusercontent.com/emilkowalski/skills/main/skills/emil-design-eng/SKILL.md)
- [elayadesign/ai-design-skills](https://github.com/elayadesign/ai-design-skills)
- [nutlope/hallmark](https://github.com/nutlope/hallmark)
- [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)
- [ibelick/ui-skills](https://github.com/ibelick/ui-skills)
- [Dammyjay93/interface-design](https://github.com/Dammyjay93/interface-design)
- [Claude Design Skills: Top Picks, Ranked by Installs(skillselion, 2026-10-29更新)](https://skillselion.com/design)
- [The 20 Best Claude Code Skills for UI/UX Design(Pasquale Pillitteri)](https://pasqualepillitteri.it/en/news/576/claude-code-skills-design-uiux-guide)
- [Design skills reviewed(Superdesign)](https://superdesign.dev/blog/design-skills-reviewed)
- [frontend-design vs impeccable vs ui-ux-pro-max(claudeskills.info)](https://claudeskills.info/blog/frontend-design-vs-impeccable-vs-ui-ux-pro-max/)
- [Claude Codeの役に立つフロントデザインのskills10選(Qiita @kamome_susume)](https://qiita.com/kamome_susume/items/41300417840aa107472e)
- [Claude Code /design skill 解説(WEEL)](https://weel.co.jp/media/tech/claude-code-design-skill/)
