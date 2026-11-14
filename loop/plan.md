reviewed-after: EXP-037
reviewed-at: 2026-11-14

見直し役: 新しいコンテキストの Opus(M-009)。読んだもの: AGENTS.md、loop/IMPROVEMENT.md、loop/method.md(M-025〜M-036)、前回の loop/plan.md、loop/experiments.md(EXP-029〜EXP-038 と、関係する EXP-007・010・014・015・016・017・020・024)、eval/rubric.md、eval/judge-prompt-v2.md、SKILL.md と references/。審査済みの学習用 run 10個(base100e・f、exp033、base110a・b、exp034、exp038、base120a・b、exp035a。60ページ)の judge-v2.opus.json と、対比較6組(72対)の pair.opus.json。検証用 07〜12 は読んでいない。eval/runs には何も書いていない。数字はすべて盲検1回の審査から見直し役が数えたもので、正式の数字はメインのセッションが出す。集計と検定のスクリプトは /tmp/claude-0/-home-user/d0751cf7-b84f-541c-8a0e-9b33a5b9f63d/scratchpad/analysis/ にある(セッションが終わると消える。どれも短い)。

## 診断

### 1. 前回の5つの仮説から分かったこと

- EXP-033(採用、v0.11.0): 原因の文の置き換えとツール(R29)で、対照 0/12 の D7.3 が 6/6 になり、以後の base でも 11/12・12/12 を保った。対比較は 4勝8敗で、全体が良くなった証拠はない。隣の D6.3 が 11/12 → 5/12 に下がった。
- EXP-034・038(再現で採用、v0.12.0): 同じ形(direction.md の文と R30)で D5.1 が 0/12 → 11/12 になり、v0.12.0 の base でも 11/12。代償は D2 で、3回の生成で −6、−2、−4。04 は3回とも 0–2。負けの理由は毎回同じで、v0.11.0 の 04 は「オンの状態を琥珀のランプで点す」配電盤だったが、v0.12.0 の 04 はランプをやめて既製のチェックボックスにした。R30 は「チェックした入力が描く箱」を選択中として除くので、チェックは行動の色の塗りのまま残り、D5.4 も2回とも落ちた。
- EXP-035(段階1で却下): 出典表は D2 +8 を出すが、状態の数(D8 −8)と広い幅(D7.3 4/6、D6.3 2/6)を削る。手数を足す変更は別の仕事を押しのける(EXP-028・029・032 と同じ)。出典表の一族は閉じた。
- EXP-036(見送り): 前提(V3 の正式の判定か、事実の照合を計器と認めること)が立たなかった。V3 は下の3で出した。
- EXP-037(ツールの修正だけ): 60 ページで新旧とも 0 件。Floor の誤検知は律速ではない。
- まとめ: 通ったのは「対照でほぼ 0 の基準」+「その基準の原因の文の置き換え」+「生成役に見せるツール」の形だけ(2/2)。通った変更は対比較を動かさず(EXP-033 は 4–8、EXP-034+038 は 11–13、採用の確認は clear net +2、+1)、隣の基準か個性に小さな代償を残した。どちらも、しきい値を検定のページを見てから決めた(R29 は 1.15 → 1.2 倍、R30 は「3つ以上」→「2つ以上」)ので、生成の前の検定は確認であって検証ではなかった。

### 2. v0.12.0(base120a・b、12ページ)で弱い基準

40基準の満たす率(盲検1回)のうち、7/12 以下の6つ。比べるのは v0.11.0(base110a・b)と v0.10.0 の対照(base100e・f)。ケース別は上の10 run で満たした数。

| 基準 | v0.12 | v0.11 | v0.10 | ケース別(10 run) | 審査の根拠に出た欠陥(base120) |
|---|---|---|---|---|---|
| D10.1 | 0/12 | 0/12 | 1/11 | どのケースも 0〜1 | 12ページとも repeated。トークンの横の別の角丸 10/12(--radius 6px の横の 4px、2・3・9・13px)、刻みの外の余白 9/12(2・3・6・15px)、部品の寸法 10/12(操作部品の高さ、アバター、ピン、min-height)、生の文字の大きさ 6/12(12・17・18px、rem)、生の時間 3/12、生の色 2/12 |
| D1.2 | 6/12 | 7/12 | 6/12 | 01 0/10、06 1/10 | 不合格6件のうち5件はブリーフにない製品の事実。01: 演算子(or、!=、括弧)、1ファイルに形式を混ぜられる、設定ファイル不要。06: 金曜のまとめメール、3〜20人のチーム、レビュー担当への通知、持ち主なしで保存できない。02b: 参加費 5,500円、海外発送、英語対応。01b と 02b の NOTES.md は「作った」と書いている。残る1件(03b)は、合計がラベルと食い違う計算の誤り |
| D6.3 | 6/12 | 5/12 | 11/12 | 05 3/10、06 3/10 | 並んだ2列の片方が隣より 250〜500px 早く終わる。見出しと導入の列が長い表・一覧の横(01b、06b)、ヒーローの文の列が背の高いデモの横(01a)、1600px 以上で足した列が短い(04b・05b の 1920)、時刻表の列が早く終わる(05b の 1280)、隣に高さを合わせて伸ばした要約のパネル(03a)。v0.11 以降の base と候補の不合格20件(exp035a を除く)のうち14件が 1280 を含み、1920 だけのものは6件 |
| D8.3 | 6/12 | 5/12 | 10/12 | 05 0/10 | :active がどの操作部品にもない(05a、05b、02a の枠線のボタン)。hover がないか見えない(01a は hover の地が行の地と同じ白、02a の文字リンク、02b の回の札、05b は (hover: hover) の中だけ)。操作のあとの知らせが live region の外(04b の「Saved」と Slack の接続は拒否権、02b の予約ボタンの日付、05a の停留所の切り替えと 20 秒ごとの更新)。v0.10 の対照は、:active の縮み、hover、aria-live をほぼ全ページで持っていた |
| D2.2 | 7/12 | 7/12 | 8/12 | 04 1/10、03 3/10 | 03 と 04 の4ページとも「シグネチャを隠すと、灰の地に白いカード(柔らかい影か細い罫)、既製のチェックボックスかピルのスイッチ」= SaaS の既定。01b は黒い地・等幅・明るい1色。04 の唯一の合格は出典表の exp035a(チャンネルの帯と面板) |
| D4.4 | 7/12 | 4/12 | 8/12 | 02 0/10、03 1/10、05 2/10(01・04・06 は各 9/10) | 不合格5件とも、和文の短い文が文節の途中で折れる。表のセル(2時間/半、水曜休/み、駅か/ら、下/車)、行のラベル(基本/給、残業/代)、名前のセル(エミ/リー)、要約のラベル(取/込待ち)、ボタン(（土）/の回を予約する、予約ページ/へ)、知らせの見出しと2行の注記(一部/の便、停留/所、時/刻、切り/替わります)。和文の30ページでは 27/30 が不合格 |

- 境目(8〜9/12): D6.4 と D7.1 が 8/12。D7.1 の 01 は2回とも、320 の第1画面で絞り込みの入力欄が例の値を切る(10 run で 01 は 2/10)。D4.3 は 9/12 で、不合格3件とも和文の数字と単位の分離(1.5時/間、2.0/時間、14/時03分、市役所2/階)。D4.1 は 9/12(01 は2回とも等幅の書体が2つ、04b はほぼ同じゴシックが2つ)。D2.1 は 9/12(04 は2回とも、名乗った配電盤・パッチベイが画面に見えない。10 run で 2/10)。
- 次元の平均(満たした基準の数、4点満点): D10 2.42、D4 2.83 が最低。D4 の不合格13件のうち8件は和文の改行と数字。D10 は D10.1 の 0/12 が大半を占める。
- 原因の文。
  - D4.4: references/japanese.md の改行の項 "for running text, `line-break: strict; word-break: normal; overflow-wrap: anywhere;`. For headings, buttons, and short labels, `word-break: auto-phrase`"。base120 の和文6ページはすべて body にこの本文の規則を置き、auto-phrase を h1〜h3(と1つのクラス)にしか当てていない。セル、ボタン、dd、注記は body から word-break: normal を受け継ぐ(EXP-014 の記録と同じ形)。
  - D2.2: references/surface-product.md の最初の項 "Quiet surfaces. Neutral backgrounds, hairline or subtle-elevation separation" が、審査の言う SaaS の既定(灰の地に白いカード)をそのまま指示している。checks.md の R04 の既定の見た目(a〜d)にも、製品画面の既定がない。
  - D8.3: craft.md *Components and states* は hover・focus-visible・active・disabled を並べるが、操作のあとの知らせを live region に書くことは、スキルのどこにも書いていない。
  - D1.2: 前回の診断のとおり SKILL.md 手順1(禁じるのが社会的な証拠だけ)。加えて craft.md *Default render* の "List every invented fact in NOTES.md" が、作ってから書き出せばよいと読める。

### 3. V3 の正式の集計(M-034)

- 新しい系列(盲検1回、プロンプト 6f71a8d850)で、両方のページが v2 を持つ72対(EXP-033、base110a の確認、EXP-034、EXP-038、base120a の確認、EXP-035a)。clear の対で、v2 の差の向きと勝ちの向きは 18 一致・14 不一致・1 引き分け(0.56)。slight を含めると 36–33–3(0.52)。前回の概算(23–11–1)と足すと 41–25–2(0.62)。
- 次元別(全対。対比較が選んだ次元のうち、v2 のその次元の点が違う対): D7 0.72、D2 0.71、D4 0.65、D5 0.62、D10 0.62、D6 0.56、D1 0.55、D3 0.50、D8 0.47、D9 0.44。
- M-027 の規則のとおり、v2 は水準と診断の記録にとどめ、経路 C はツールのある基準に限る。ツールのない経路 C(前回の仮説4の D1.2 など)は使えない。ページ単位の v2 の差は、対比較の勝ち負けとほぼ無関係。

### 4. 対比較で現行の版がはっきり負けた理由

- 材料: base120a の確認(base110a・b との12対)、EXP-034・038 の24対(v0.12.0 になった変種)、EXP-035a の12対(base120 が base の側)。現行の側の clear 負けは9件(06 対 110a、EXP-034 の 01・02・04、EXP-038 の 01 ×2、EXP-035a の 01・03・04 で base120 が負けたもの)。
- 9件とも、決め手に「よくある見た目」(D2)が入っている。01 の4件は「明るいページに黒い端末のカード1枚は、開発ツールの LP の定番」(うち3件は 320 で入力欄か例のチップが切れることも)。04 の2件は「白い罫のパネルに色付きのチェックボックスは、よくある設定の表」。03 は「残りは柔らかい影の白いカード」、02 は「暗い地に琥珀の光は、工芸の既定」、06 は「どの SaaS のボードでも通る」。v2 の D2.2 の不合格と同じページ、同じ言葉。
- D6 の理由は、v2 の D6.3 と同じ空き(「1280 で宛先のパネルの下が長く空く」「短い横のパネルの下に空いた地」「ヒーローの下の大きな空いた左の列」「1920 で足した要約の列が余計」)。
- D8 の理由は「base のほうが状態を多く作った」で、部品の仕組みの欠陥ではない。

### 5. 生成の前の検定(M-033)を、既存の60ページで先に試した(0 トークン)

- 過去の変種のスクリプトは /mnt/project-files/design-nexus-archive/variants-20261101.tar.gz にある(variants/exp010 の R19、exp014 の R20、exp015 の R21、exp017 の R22、exp024 の R26)。どれも本体には入っていない。
- R26(EXP-024 の空きの検出。手を加えず、第1・第2画面の空きだけを数えた)と D6.3: 不合格 22/27(0.81)に出て、合格 14/33(0.42)にも出た。M-033 の「合格の 20% 以下」を満たさない。合格に出たのは、時刻表の行の中の空白(05 の3ページ)と、04 の 1920 の短い横の列。04 の 1920 の横の列は7ページで出て、審査は5ページを合格、2ページを不合格にした。審査の線引きが割れており、どのツールでも特異度の上限になる。
- R20(EXP-014。14字までの和文のラベルが折り返す)と D4.4: 和文30ページの不合格 27 のうち 21(0.78)に出た。合格は3ページしかなく、特異度は測れない。base120a の 03 では、審査が挙げた「基本/給」「残業/代」をそのまま出した。
- R22(EXP-017。数字の直後の改行)と D4.3: 不合格 11 のうち 7(0.64)、合格 19 のうち 5(0.26)に出た。「1.5時/間」のような、数字に続く単位の語の中の改行を見ない。
- 文節の検出の試作(ブラウザ自身の auto-phrase を物差しにし、1〜2行の文と、見出し・ボタン・ラベル・セル・dt/dd に限った。analysis/ja_probe.mjs): 和文の不合格 27/27 に出た(1ページ 4〜45 件)。合格3ページのうち2ページにも出たが、2〜3件だった。base120 の不合格5ページで審査が挙げた16か所のうち、9か所を見つけた。外したのは、ブラウザ自身が切ってよいとする複合語(基本|給、残業|代、切り|替わ、2時間|半、水曜休|み)、閉じ括弧の後の助詞(（土）|の回)、一部|の便。同じ30ページの root に auto-phrase を注入すると、検出は 456 件 → 0 件になり、4幅のどれにもページの横スクロールは出なかった。物差しも auto-phrase なので 0 件になるのは当然の部分がある。それでも、CSS の1行で審査の挙げた箇所のおよそ6割が消え、残りの4割は nowrap か `<wbr>` の個別の直しが要る、という見積りになる。
- D8.3 の静的な目安: :active の規則がどこにもないページは 7/7 が不合格。ただしそれは不合格 23 のうち 7 だけで、残りは :active も live region もどこかに持ちながら、特定の部品で落ちている。部品ごとに hover と押下の見た目の変化と、知らせの置き場を確かめるレンダーのチェックが要る。

## やめること

1. **ツールのない経路 C。** V3 は 0.56(clear 33対)で、次元別でも D1・D3・D8・D9 は 0.6 未満。
2. **生成の手数を増やす変更**(計画の段、必須の状態の追加、出典表)。EXP-028・029・032・035 で、毎回状態か広い幅が削れた。1つの変更で増やしてよい作業は、CSS の数行か、選ぶ段階の文までにする。
3. **行動の色の規則を緩めて、ランプをアクセントに戻すこと。** D5.1 の 11/12 を失う。R30 の「チェックした入力」の除外も変えない。個性は仮説3の形(状態をシグネチャの単位と状態の色で描く)で戻す。
4. **D10.1 をツールで追うこと**(前回の7を続ける)。3波で 0〜1/12。審査は部品の寸法まで数え、EXP-030 の R28 はツールが 0 件でも 2/6 だった。寸法ごとのトークンは CSS を悪くする。M-035(審査の文の明確化)を待つ。
5. **検定に使うページでしきい値を決め、同じページで検定すること**(R29・R30 の形)。設計と確かめのページを分ける(M-037 の案)。
6. **R26 をそのまま入れること、空きを「埋めさせる」こと。** 検定で合格の 42% に出る。EXP-024 は D2 −11。
7. **1つのケースにしか出ない欠陥を、実験として直すこと。** 01 の 320 で例の値を切る入力欄(D7.1)と、01 の等幅の書体2つ(D4.1)は本物の欠陥だが、満たす余地が 3〜4/12 で、経路 C の検出力がない。やるなら、実験のない回にツールだけの patch として扱う(EXP-037 の扱い)。
8. **R29 や 1920 の文を弱めて D6.3 を戻すこと。** D7.3 の 12/12 を失う。空きは仮説5で直接直す。
9. **数字と単位(D4.3)を仮説1の関門に入れること。** R22 型の検定は 7/11。記録だけにする。
10. 前回から止めたままにするもの: 出典表の一族。審査を甘くする文の変更(M-035 は、台帳の再審査で一致が上がる条件つきのまま)。検証用 07〜12 を読むこと。
11. 前回の「やめること」9 の「和文の組版の細則」は、仮説1の1件に限って外す。理由は計器が変わったこと(下の仮説1)。D4.4 が関門に届かなければ元に戻し、和文の改行はこれで終わりにする。

## 次の仮説(期待値の順、5件)

共通: 基準点は base120a・b(M-031)。対比較は base120a・b と組む12対(片順・盲検)。v2 は盲検で1回。経路 C の関門は rubric の式 min(0.3, base の不合格の率 ÷ 2)で、6ページの1回の生成で判定する。害の条件は M-029 のとおり clear net −4 以上と、守る次元がそれぞれ −6 より上。狙った基準と同じ次元のほかの基準が 0.25 以上下がったら根拠を読む(M-034 の適用)。偶然に通る確率は、基準の率がケースで大きく違うので、ケース別の率で出した。版は、本文の規則の変更が minor、ツールだけが patch。EXP の番号は仮の番号。

### 1. EXP-039: 和文は root で文節ごとに折り、1〜2行の文を文節の途中で折らない(japanese.md の改行の項の置き換えと R31)

- **仮説**: japanese.md の改行の規則を「auto-phrase と line-break: strict は root に1回置き、body やセルで word-break を戻さない」に置き換え、1〜2行の和文が文節の途中で折れたら R31 で見せれば、和文ページの D4.4 が満たされ、ほかの基準は動かない。生成の手数は CSS の1行と、R31 が挙げた箇所の span だけ。
- **狙う基準**: D4.4(base120 7/12。和文ページは 1/6、10 run の和文30ページで 3/30)。記録: D4.3(9/12)。
- **経路**: C(ツールあり)。
- **変更先と文面の案**(1項の置き換えと、チェック1つ)
  - references/japanese.md の改行の項を置き換える。
    - 旧: "**Line breaking**: for running text, `line-break: strict; word-break: normal; overflow-wrap: anywhere;`. For headings, buttons, and short labels, `word-break: auto-phrase` (where supported) so phrases don't split awkwardly, and `text-wrap: balance` for short headings. Code, commands, and figures follow `craft.md` *Responsive* instead: never `overflow-wrap: anywhere` on them."
    - 新: "**Line breaking**: set `word-break: auto-phrase; line-break: strict;` once, on the root (`html:lang(ja)`), and never reset `word-break` to `normal` on `body`, cells, or controls, so headings, buttons, labels, navigation, table cells, `dt`/`dd`, notes, and running text all break between phrases (a break between phrases is also correct in running text). `overflow-wrap: anywhere` may stay only as the fallback for a phrase wider than its line. Text of one or two lines never breaks inside a word at any width: where the browser's phrases fall short (a compound such as 差引支給額, a name or a place, a figure with its unit or counter such as 1.5時間 or 14時03分), keep it whole with a `white-space: nowrap` span or a `<wbr>` at its real boundary, or give it room. Short headings also get `text-wrap: balance`. Code, commands, and figures follow `craft.md` *Responsive*: never `overflow-wrap: anywhere` on them. The render check lists short text that breaks inside a phrase (R31)."
  - references/checks.md に R31 の行: "| R31 | At some width, Japanese text breaks inside a phrase where it must not: text of one or two lines, or a heading, button, label, nav item, table cell, `dt`/`dd`, caption, or legend, breaks where the browser's own `auto-phrase` segmentation would not (駅か\|ら, 停留\|所, （土）\|の回を), or a Japanese label of up to 14 characters wraps at all (基本\|給). Running text of three or more lines is not counted | render |"
  - scripts/render-check.mjs に R31(Reflex)。lang が ja の文で、各幅の改行の位置を文字の矩形から取り、(a) 上の範囲の文で、auto-phrase の probe が切らない位置(EXP-010 の R19 の測り方。閉じ括弧の後の助詞も数える)、(b) 14字までの和文のラベルの折り返し(EXP-014 の R20)、を挙げる。3行以上の本文は数えない(JLReq では正しい組版)。数字と単位の検出(R22 型)は入れない。
  - eval/fixtures に正例(body の word-break: normal を受け継いで折れるセルとボタン、14字のラベルの折り返し、（土）|の回)と負例(root の auto-phrase、3行以上の本文の改行、欧文のセル、nowrap の数字)。scripts/test.mjs。
  - SKILL.md と craft.md は変えない(craft.md *Responsive* の "Short labels stay whole" はこの規則と食い違わない)。
- **生成の前の検定**(M-033、0 トークン)
  - (a) 和文30ページで、R31 が D4.4 の不合格 27 のうち 22 以上(0.8)に出る。試作は 27/27、R20 だけでは 21/27。
  - (b) base120 の不合格5ページで審査が挙げた16か所のうち、12か所以上を見つける。試作は 9/16 で、(b) の R20 の部分で 基本|給・残業|代、括弧の規則で （土）|の回 が加わる見込み。
  - (c) 欧文の30ページで R31 が 0 件。
  - (d) 同じ30ページに新しい文面の CSS(root の auto-phrase、body の word-break を消す)を注入し、R31 の残りを数え、F08 と R17 が増えないことを確かめる。
  - しきい値と除外は base110・base120 の和文12ページで決め、残りの18ページで (a) を確かめる(M-037)。外れたら設計に戻り、2回外れたら仮説を捨てる。
- **関門**: 1. 新しい Floor と拒否権がない(変種のツールで測る)。2. R31 が出る候補のページが 1/6 以下(理由つきで残したものも出たと数える)。base の12ページでは5ページ以上に出ているはず。3. D4.4 が 5/6 以上(必要な上がり幅 min(0.3, 0.21) = 0.21 で、0.58 → 0.79)。和文ページの合格の率が 0.15 のまま(効果なし)なら、5/6 以上は約5%。0.75 に上がれば約7割。4. 害: clear net −4 以上、D4・D7 がそれぞれ −6 より上、変更そのもの(言い換えで文が不自然、nowrap のはみ出し)を決め手にした clear 負けが1件以下。5. HOLD がない。D4.3 と D7.1 を記録する。
- **予想**: D4.4 0.58 → 0.85 前後、v2 +0.6〜1.0。対比較は ±2(D4 は決め手にならない)。D4.3 は、auto-phrase が「1.5時間」を1つの文節にまとめるので、少し上がる見込み。
- **費用**: 生成と審査 1.2M、12対 1.2M、計 2.4M。
- **予想される失敗と守り**
  - auto-phrase が切ってよいとする複合語(基本|給、切り|替わ)が残り、審査が repeated で落とす。R31 の (b) と、文面の「複合語・名前・地名・単位つきの数字は nowrap か `<wbr>`」で対処する。残った箇所を記録する。
  - nowrap が 320 で枠からはみ出す(D7.1、R17・F08)。文面は「余地を作る」を並べた。D7 を守る。
  - 生成役が文を言い換えて改行を避け、語が不自然になる(D9)。記録する。
  - R31 の直しが手順7を押しのける(EXP-015 の型)。直しは CSS の1行と span なので小さい見込み。D7・D8 の net を記録する。
  - 審査が D4 のほかの基準(数字と単位、欧文のスペース)で次の傷を見つける。D4.3 は関門に入れず、記録する。
- **繰り返しでない理由**: EXP-029〜035 のどれも和文の改行に触れていない。近いのは v1 の時代の EXP-007・010・014・017・020 の5件で、どれも「狙った欠陥は消えたが、審査が同じ次元の次の傷を見つけ、D4 の点が動かなかった」で却下された。v2 では D4.4(短い文の改行)、D4.3(数字と単位)、D4.2(大きさ)が別の二値の基準で、M-024 で D4.4 の範囲を見出し・ボタン・ラベル・ナビと1〜2行の文に絞った。前の5件が測れなかったのは、計器の側の理由。中身は EXP-014(root の auto-phrase と R20)に最も近い。違いは3つ: body の上書きを消すことを文面に書く、R19 の物差しを足して 14 字を超える1〜2行の文も見る、経路 C で測る。

### 2. EXP-040: 操作部品の hover と押下、操作のあとの知らせ(craft.md *Components and states* の1項の置き換えと R32)

- **仮説**: craft.md の最初の項を「どの操作部品にも見て分かる hover と押下があり、押下はタッチでも出る。操作や時刻で変わる答え・件数・確認・失敗は、読み込み時からある live region に、変わるたびに1回書く」に置き換え、hover か押下で見た目が変わらない部品と、live region の外で書き換わる知らせを R32 で見せれば、D8.3 を満たすページが増える。生成の手数は CSS の数行と role の属性だけ。
- **狙う基準**: D8.3(base120 6/12。05 は 10 run で 0/10。v0.10 の対照は 10/12)。
- **経路**: C(ツールあり)。
- **変更先と文面の案**
  - craft.md *Components and states* の "Every interactive element has: default, hover, focus-visible, active, disabled. Inputs also: error, with message tied by `aria-describedby`." を置き換える。新: "Every interactive element has a visible default, hover, focus-visible, active, and disabled state; `:active` must show on touch too, so it never sits only inside `@media (hover: hover)`. Inputs also have an error state, with the message tied by `aria-describedby`. A result, count, confirmation, or error that changes after an action or on a timer is written into a live region that exists at load (`role="status"`; failures `role="alert"`), once per change: a timer that redraws the same answer announces nothing. After an action that re-renders its own control, move focus to the result or the next control (R32)."
  - render-check.mjs に R32(Reflex)。1280 と 320 で、見えている操作部品(button、a[href]、[role=button]、summary、入力のラベル)に順にポインタを置き、押し下げ、計算済みの色・背景・枠・影・transform・text-decoration・outline の変化が見える大きさに届かない部品を数え、2つ以上か主操作なら挙げる。最初の画面の主なボタン(R25 の探し方。ページの外へ移らないものだけ)を押し、live region の外の文字が変わったら挙げる。
  - checks.md の行、fixture(hover のない文字リンク、hover の media の中だけの :active、live region の外の「保存しました」。負例: 全部そろったページ、操作のない静的なページ)、test.mjs。
- **生成の前の検定**: 60ページで、D8.3 の不合格 23 のうち 19 以上(0.8)に出て、合格 37 のうち 7 以下(0.2)にしか出ない。設計は base110・base120(不合格13、合格11)、確かめは残りの36ページ(不合格10、合格26)。静的な目安(:active がない)だけでは 7/23。live region の部分が外れたら、hover と押下だけのツールにして、狙いをその部分と書き直す(関門の数字は変えない)。
- **関門**: 2. R32 が出る候補 1/6 以下。3. D8.3 が 5/6 以上(base 0.5、上がり幅 0.25)。効果がなければ約11%。05 が落ちたまま、ほかが 0.85 なら約6割。4. 害: clear net −4 以上、D8・D3 がそれぞれ −6 より上、変更そのもの(読み上げが多すぎる、フォーカスが飛ぶ)を決め手にした clear 負けが1件以下。5. HOLD がない。D8.1・D8.2 を記録する。
- **予想**: D8.3 0.5 → 0.8、v2 +0.7。対比較は ±2。
- **費用**: 2.4M。
- **予想される失敗と守り**: (1) live region を増やしすぎ、時刻の更新ごとに読み上げる(base100f の 05 の型)。文面に「同じ答えを描き直すだけなら読み上げない」と書いた。05 の根拠を読む。(2) R32 の押し方でダイアログや遷移に入り、誤検知する。検定と fixture で止める。(3) 目に見えない差(地の 1% の違い)の hover で R32 を逃げる(01a の型)。R32 は色の差に下限を持つ。(4) 直しが手順7を押しのける。直しは CSS の数行なので、記録だけにする。
- **繰り返しでない理由**: EXP-029〜035 は D8.3 を狙っていない(EXP-030 の F02 はフォーカスの輪のコントラスト、EXP-037 はその誤検知)。EXP-006・011 は状態を部品の中で見せる規則で、操作部品の状態と知らせではない。D8.3 は v0.11.0 から 10/12 → 5〜6/12 に下がった。v0.10 の対照が持っていたものを、規則とツールで戻す。

### 3. EXP-041: 製品画面の作業域を、灰の地の白いカードにしない(surface-product.md の最初の項の置き換えと R33)

- **仮説**: surface-product.md の最初の項を「静かでも既定ではない。作業域は主題の実物の面(台帳の紙、パッチ盤、時刻表の板)から作り、灰の地に白いカードを並べない。利用者が設定する状態(オン、承認済み)はシグネチャの単位と主題の状態の色で描き、既製のチェックボックスやピルのスイッチにしない」に置き換え、1280 の作業域が灰の地の白いパネルなら R33 で見せれば、03・04 の D2.2 が満たされ、v0.12.0 の個性の代償(04 の 0–2)が戻る。選ぶ段階の文で、手数を増やさない(EXP-035 の学び)。
- **狙う基準**: D2.2(base120 7/12。03・04 は 0/4。10 run で 04 は 1/10、03 は 3/10)。記録: D2.1(04 は 2/10)、D5.4(04 は2回とも不合格)、対比較の D2。
- **経路**: C(ツールあり)。R33 が検定を通らなければ経路 P(M-032、候補2回・24対で clear net +6 以上)。
- **変更先と文面の案**
  - references/surface-product.md の "Quiet surfaces. Neutral backgrounds, hairline or subtle-elevation separation, color reserved for status, selection, and data." を置き換える。新: "**Quiet, not default.** Keep the work area calm and dense, but build its surface from the subject's own working object (the ledger sheet, the patch panel, the timetable board, the order slip): one ground whose rules, bands, or plates divide the regions, not white cards on a grey page; elevation only for what floats (menus, dialogs, a dragged item). Draw a state the user sets (on, approved, booked) with the signature's unit in a status color sourced from the subject (a lit lamp, a stamp), never as a stock checkbox grid or pill switch; the action color stays on what is pressed (`direction.md` §3). Color stays reserved for status, selection, and data."
  - references/checks.md の R04 に "(e) product default: white cards on a light grey ground with a left sidebar, pill toggles, and stock checkboxes in the work area" を足し、SKILL.md 手順4の "(R04 a–d, including the agent house look)" を "(R04 a–e, …)" にする(1字)。
  - render-check.mjs に R33(Reflex): 1280 の第1画面で、主な内容の地(body か main の背景)が明るい無彩色で、その上に 40,000px² 以上の、地より明るいパネル(角丸か影か枠を持つ)が2つ以上あれば挙げる。アプリの枠(header、nav、左のサイドバー)は数えない。
- **生成の前の検定**: 60ページで、03・04 の D2.2 の不合格 16 のうち 13 以上に出て、D2.2 の合格 37 のうち 7 以下にしか出ない。06 の「暖かい灰に白いカード」は、対比較では既定と書かれたが v2 では合格なので、そこに出た数は別に記録する。
- **関門**: 2. R33 の候補 1/6 以下。3. D2.2 が 5/6 以上(base 0.58、上がり幅 0.21)。01 は D2.2 を半分の生成で落とすので、03・04 の合格の率が 0.7 に上がっても 5/6 は約6割、効果がなければ約1割。4. 害: clear net −4 以上、D8・D6・D3 がそれぞれ −6 より上、D5.1 が 0.75 以上のまま(行動の色の規則を崩さない)、変更そのもの(作業域が読みにくい、操作部品と分からない)を決め手にした clear 負けが1件以下。5. HOLD がない。D5.3(独自の部品のコントラスト)と D8.3 を記録する。
- **予想**: D2.2 0.58 → 0.85、v2 +0.8〜1.2(重み 1.5)。対比較の D2 は 03・04 で正(+2〜+4)。
- **費用**: 経路 C 2.4M、経路 P 4.8M。
- **予想される失敗と守り**: (1) 地を白くしてカードを細い罫に変えるだけで R33 を逃げ、審査は既定のままと見る(R28 と D10.1 の型)。文面は形より先に「主題の実物の面」を書いた。D2.2 の根拠を読む。(2) 独自の状態の部品が、キーボードやコントラストで崩れる(F02、D5.3、D8.3)。Floor のツールが見張る。(3) 実物の面を作る手数が増え、状態が減る(EXP-035 の型)。D8 を守る。(4) 面の規則がマーケティングのページに漏れる。surface-product.md は製品画面でしか読まれない。
- **繰り返しでない理由**: 出典表(EXP-026〜035)は計画の段を足して手数を増やした。この案は製品画面の原因の文1つの置き換えで、段を足さない。EXP-031 のようにシグネチャの色をアクセントから取り上げない(行動の色の規則はそのままで、状態にシグネチャの単位と状態の色を渡す)。近いのは v1 の EXP-016(部品もシグネチャの素材で作る。D2 が動かず却下)だが、EXP-016 は全面の部品の形の一般則だった。ここは、審査が既定と呼ぶ2つ(灰の地の白いカード、既製のスイッチ)を指示している文そのものを置き換え、ツールで確かめる。

### 4. EXP-042: ブリーフにない製品の事実を足さない(前回の仮説4。計器を先に決める)

- **前提**: 事実の照合を M-033 の「ツール」と認める(M-038 の案)。照合は、新しいコンテキストが CASE.md のブリーフとページの見える文だけを読み、ブリーフにない製品の事実(機能、構文、上限、料金、保証、連携、人数)を挙げる。base110・base120 の24ページ(D1.2 の不合格11、合格13)で、不合格の 80% 以上に事実を挙げ、合格の 20% 以下にしか挙げないこと(約 1M)。通らなければこの仮説は飛ばす。
- **仮説**: 「作ってはいけないもの」を社会的な証拠から製品の事実に広げ、作った製品の事実を NOTES.md に書き出せば済むという読み方を消せば、D1.2 を満たすページが増える。作る量はむしろ減る。
- **狙う基準**: D1.2(6/12。01 は 10 run で 0/10、06 は 1/10)。
- **経路**: C(照合を計器として)。
- **変更先と文面の案**(同じ原因の2文を1つの変更として扱う)
  - SKILL.md 手順1の第1段落の最後の2文。旧: "Use plausible, specific content from the subject's world when real material is missing, and say so in NOTES.md and your report, not on the page. Never invent testimonials, metrics, or customer logos presented as real." 新: "When real material is missing, fill only what the brief leaves open (names, dates, rows of data and their figures, current settings) with plausible specifics, and say so in NOTES.md and your report, not on the page. Do not add product facts the brief does not give: features, commands, syntax or flags, plans, prices, limits, guarantees, integrations, testimonials, metrics, or customer logos. When a section looks thin, show the brief's own facts larger instead."
  - craft.md *Default render* の "List every invented fact in NOTES.md." を "List every invented sample (names, dates, rows, figures) in NOTES.md; product facts are never invented." にする。
- **関門**: D1.2 が 5/6 以上(base 0.5、上がり幅 0.25)。照合が事実を挙げる候補のページが 1/6 以下。害: D2・D9 がそれぞれ −6 より上(中身が薄くなる)、D1.1 と D1.3 が下がらない。
- **予想**: D1.2 0.5 → 0.85、v2 +1.2(重み 1.5)。対比較の D1 はわずかに正。費用は照合の検定 1M と実験 2.4M。
- **予想される失敗と守り**: 01 の構文の表がブリーフの2例だけになり、役に立たなくなる(D1.1、D9)。06 の節が薄くなる(D2.2)。作った事実を「例」と言い換えて残す。照合の結果をページごとに記録する。
- **繰り返しでない理由**: 前回の仮説4(EXP-036)は前提が立たず、測っていない。却下された実験に、D1.2 を狙ったものはない。

### 5. EXP-043: 1280・1920 の最初の2画面で、並んだ列の片方を早く終わらせない(R26 を直した R34 と craft.md の1項)

- **前提**: 直した検出が、分けた検定(下)を通ること。通らなければやらない。
- **仮説**: craft.md の "No half-empty rows at desktop." の項に、いまの空きの3つの形(長い表の横の見出しの列、背の高いデモの横の文の列、1600px で足した短い列)と、並べ替えだけの直し方を書き、R34 で第1・第2画面の空きを見せれば、D6.3 が v0.10 の水準に戻る。
- **狙う基準**: D6.3(6/12。v0.10 の対照は 11/12)。
- **経路**: C(ツールあり)。
- **変更先と文面の案**: craft.md の項を置き換える。新: "**No half-empty rows at desktop.** At 1280 and 1920, within the first two screens, columns that sit side by side end within about 200px of each other: a heading column beside a longer table or list, a hero's copy beside a taller demo, and the column added from 1600px all count. Rebalance with what the page already has: put the heading above its table, move a block the section needs into the short column, show fewer demo rows, or let the block below rise; never pad with filler, repeats, or a stretched box (R34)." R34 は R26 の測り方(塗られたものから 320×256px 以上の空きを探す)を第1・第2画面に限り、表と時刻表の行の中の空白を除き、空きの横に下まで続く列があるものだけを挙げる。
- **生成の前の検定**: しきい値と除外は base110・base120 の24ページ(不合格13、合格11)で決め、残りの36ページ(不合格14、合格22)で、不合格の 80% 以上・合格の 20% 以下に出ることを確かめる。いまの R26 は 0.81・0.42。04 の 1920 の横の列は審査が割れている(7ページ中5ページを合格)ので、届かない見込みもある。
- **関門**: D6.3 5/6 以上(上がり幅 0.25)。R34 の候補 1/6 以下。害: clear net −4 以上、D2・D7・D8 がそれぞれ −6 より上(EXP-024 の D2 −11、EXP-015 の D7 の低下)、ページが均されたことを決め手にした clear 負けが1件以下、D7.3 が 0.75 以上のまま(R29 の効果を崩さない)。
- **予想**: D6.3 0.5 → 0.8、v2 +0.7。対比較の D6 は正(対比較の D6 の理由は同じ空きを挙げている)。
- **予想される失敗と守り**: 空きを埋めて個性が均される(EXP-024)。文面は「並べ替える」だけを並べ、埋め草を禁じた。D2 を守る。デスクトップの直しが狭い幅の確認を押しのける(EXP-015)。D7 を守る。
- **繰り返しでない理由**: EXP-029〜035 は D6.3 を狙っていない(EXP-033 が下げた)。EXP-015(R21)と EXP-024(R26)は v1 か経路 P で測られ、空きは対比較の決め手にならなかった。v2 の D6.3 はこの空きそのものの基準で、v0.11 からの低下は EXP-033 の副作用として測れる。ただし EXP-024 の D2 −11 という前回の「やめること」の理由はまだ生きているので、5番目に置いた。

### 順番の理由

- 期待値の粗い見積り(生成の前の検定を通る見込み × 関門を通る見込み × v2 の伸び): 仮説1 は 0.8 × 0.6 × 0.8、仮説2 は 0.6 × 0.6 × 0.7、仮説3 は 0.5 × 0.6 × 1.0、仮説4 は 0.5 × 0.6 × 1.2(計器の検定が先)、仮説5 は 0.4 × 0.5 × 0.7。仮説1 は、検定の材料がすでにあり、原因がコードで確かめられ、効果がないときに偶然通る確率が最も低い。
- 仮説1・2 は衛生の基準で、通っても対比較は動かない見込み。通った2件(EXP-033・034)はどちらも隣に代償を残した。仮説1か2で対比較の D2 が −4 以下になったら、仮説3を先にする。仮説3 は現行の版の対比較の負けの主な理由に直接当たる。

## 評価手法の改善案

### M-034 の結果を書く(0 トークン)

- 上の診断3の数字を M-034 の result に書く。M-027 の規則の厳しい側のまま運用する(v2 は水準と診断の記録、経路 C はツールのある基準だけ)。採用の手順は変えない。

### M-037 生成の前の検定を、設計と確かめのページに分ける(0 トークン)

- 理由: R29 と R30 のしきい値は、検定に使うページを見てから決めた(診断1)。
- 変更: しきい値と除外は、直近の base 2回(いまは base110・base120 の24ページ)だけで決める。残りの審査済みのページ(いまは36ページ)で、M-033 の条件(不合格の 80% 以上、合格の 20% 以下)を確かめ、それで進むかを決める。両方の数字を experiments.md に書く。
- あわせて、関門を偶然に通る確率は、ケース別の満たす率で出す。D4.4 は和文で 3/30、01・04・06 で 27/30 のように、ケースで率が大きく違う。

### M-038 事実の照合を計器と認める条件(仮説4の前提、約 1M)

- 照合は1ページ1体の新しいコンテキストで、ブリーフとページの見える文だけを読み、ブリーフにない製品の事実を挙げる(審査の v2 とは別。判定は D1.2 で行う)。base110・base120 の24ページで、不合格の 80% 以上に挙げ、合格の 20% 以下にしか挙げなければ、M-027 の「ツール」に数える。

### 保留のまま

- M-035(D10.1 と D5.1 の審査の文の明確化)。D10.1 は3波で 0〜1/12 で、審査が部品の寸法を数えるかで割れる。採るなら、V3 の台帳のページを新しい文で審査し直し、一致が上がることを条件にする(前回のとおり)。

## 次のループで最初に行うこと

1. `node eval/run.mjs plateau` を実行し、この plan.md の `reviewed-after: EXP-037` から数え直していることを確かめる。
2. M-034 に result(診断3)を書き、M-037 を loop/method.md に記録する。
3. EXP-039 を loop/experiments.md に書く(仮説、経路 C、検定の条件 (a)〜(d)、関門1〜5、予想、守る次元)。結果を見る前に書く。
4. R31 を Opus max で設計する(M-010)。/mnt/project-files/design-nexus-archive/variants-20261101.tar.gz の variants/exp010(R19 の auto-phrase の probe)と variants/exp014(R20)を出発点にし、閉じ括弧の後の助詞を加える。現行のスキルを写した変種で japanese.md の項を置き換え、checks.md、fixtures、test.mjs を直し、`node scripts/test.mjs` を通す。差分は loop/variants/exp039-ja-phrase.patch に置く。
5. 検定 (a)〜(d) を行う(`--time 2026-11-04T10:30:00+09:00 --tz Asia/Tokyo` は score と同じ)。外れたら手順4に戻る。2回外れたら仮説を捨て、仮説2に進む。
6. `node eval/run.mjs prepare --skill <変種> --split train --label exp039` で6件を作り、Opus で生成する(推論量は base と同じ、同時4体まで)。`DN_SKILL=<変種> node eval/run.mjs score --run <run>`、`node eval/run.mjs judge --run <run> --scale v2 --blind`(1ページ1体、新しいコンテキスト)、もう一度 score。
7. `node eval/run.mjs pair --base <base120a>,<base120b> --run <run>` の12対を、1対1体の新しいコンテキストの Opus が片順で審査し、`pair-score --run <run>`。`compare --base <base120a>,<base120b> --run <run> --scale v2`。
8. 関門1〜5で判定し、experiments.md に書く。採用なら v0.13.0(VERSION と .claude-plugin/plugin.json、CHANGELOG.md、`node scripts/build.mjs`)。v0.13.0 で base を2回生成し、base120a・b との12対の clear net を記録する(M-031)。eval/runs を tar で保存する(M-028)。
9. 次は仮説2(R32 が検定を通ったとき)、仮説3(R33 が通れば経路 C、通らなければ経路 P)、仮説4(M-038 を満たしたとき)、仮説5(R34 が分けた検定を通ったとき)の順。各実験のあと `plateau` を実行する。
