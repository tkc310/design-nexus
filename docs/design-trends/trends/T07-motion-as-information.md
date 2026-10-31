# T07. 「情報としてのモーション」と CSS ネイティブの動き

[索引](../index.md) · [2026-10 のスナップショット](../monthly/2026-10.md)

- **ID**: T07
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

- **状態**: steady

## 更新履歴

- 2026-10: 初収録。2026 通年とあるので、状態は steady。確度は高。
