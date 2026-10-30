# 実験ログ

1イテレーション1エントリ。採用されなかった実験も消さずに残します。

## テンプレート

```
### EXP-NNN タイトル
- date:
- base run / version:
- hypothesis: (〜を変えると D? / チェックID が改善する)
- change: (どのファイルの何を変えたか)
- candidate run:
- result: (compare.md の要約)
- verdict: ACCEPT | NEUTRAL→ACCEPT | REJECT
- notes:
```

## エントリ

### EXP-001 「エージェントの定番ルック」を断ち切る
- date: 2026-10-30
- base run / version: baseline(20261030-2307、v0.1.0、生成 Sonnet、審査 Opus・Fable・Sonnet)。現行のチェックで再採点して 83.9 点。
- hypothesis: 3モデルの審査がそろって「淡い紙色+インクブルー1色+蛍光黄+mono の小ラベル+罫線+角丸2〜4px+影なし+濃い締めの帯」という共通の見た目を指摘した(6件中4件、レンダー計測でも同じ)。原因は direction.md と DESIGN.md テンプレートの作例がこの見た目そのものだったこと。作例の値を消し、方向性を5つの軸で振り分けさせ、R04(d) として定番ルックを明示すれば D2 が上がる。
- change: direction.md の3案とトークン計画を書き換えた(軸の表、手癖外の1案、値のないテンプレート、対照的な2作例)。checks.md に R04(d) を追加。SKILL.md の手順2・3・4・9 を更新。DESIGN.md テンプレートの値を空欄にし、*Looks used* を追加。
- confound: 同じスナップショットに道具側の追加が入っている。R16(読み込まれないフォント)、R17(容器内のレイアウト崩れ)、Google 形式の DESIGN.md 読み込み、handoff.md。生成側が lint で R16/R17 を見るので、D4 と D7 に影響しうる。
- candidate run: 20261030-2328-v0.1.0-exp001(生成 Sonnet、審査 Opus・Fable・Sonnet)
- result: 合計 83.5 → 86.4(+2.9、両 run を同じチェックで採点)。D2 2.78 → 3.00、D7 2.50 → 3.00、D4 +0.28、D10 +0.17。審査別は Fable +2.4、Sonnet +2.1、Opus −0.9。レンダー計測による定番ルックは 6件中4件 → 1件。悪化したのは 02(−2.7、ろくろの図が手びねり教室と矛盾)と 05(−2.4、23時台の撮影で看板の状態が写らない)。
- verdict: ACCEPT(v0.2.0)
- notes: 審査3者とも、次の収束を指摘した。淡いセージ系の地(6件中5件)、濃い緑のアクション色、01 と 06 で Big Shoulders Display と IBM Plex Mono が重なる点。Fable と Opus は別の問題も指摘した。時刻やスクロールに依存するシグネチャがスクリーンショットに写らないケースが4件あった。Opus 単独ではほぼ横ばいなので、効果の大半は審査の甘い2モデルで出ている可能性がある。

### EXP-002 既定の表示でシグネチャが見えるようにする
- date: 2026-10-31
- base run / version: EXP-001 の run(v0.2.0、86.8点)
- hypothesis: 審査3者が別々に指摘した問題がある。シグネチャがスクロール時の描画や現在時刻に依存し、固定バーにも隠れて、既定の表示に出ていなかった(05・06・04・03)。ここに「既定の表示は代表的な状態を見せる」というルールを足せば、D2・D8・D1 が上がる。
- change: SKILL.md の手順6に1文、craft.md に「Default render」節を追加。
- candidate run:
- result:
- verdict:
