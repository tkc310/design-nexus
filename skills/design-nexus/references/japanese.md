# Japanese typography (和文組版)

Read whenever the interface contains Japanese text.

- **Font choice**: Pick a family with a voice that fits the subject, not only Noto Sans JP by reflex. Options: sans (Noto Sans JP, BIZ UDPGothic, M PLUS 1p, Zen Kaku Gothic New, LINE Seed JP), serif/mincho (Noto Serif JP, Shippori Mincho, Zen Old Mincho, BIZ UDPMincho), rounded (Zen Maru Gothic, M PLUS Rounded 1c). Pair a Latin face for alphanumerics by listing it first: `font-family: "Inter Tight", "Zen Kaku Gothic New", sans-serif` — the Latin face renders Latin, the Japanese face renders kana and kanji.
- **Weight and size**: Japanese glyphs look larger and darker than Latin at the same size. Body 15–17px, weight 400; avoid 300 for body on Windows.
- **Line-height**: body 1.7–1.9; headings 1.3–1.5. Tight line-height that suits Latin crowds kanji.
- **Measure**: 30–40 full-width characters per line for body.
- **Letter-spacing**: body 0.02–0.05em; headings may use `font-feature-settings: "palt"` (proportional kana) with 0–0.02em. Never negative tracking on Japanese.
- **No italic.** Japanese fonts have no true italic; synthetic slanting looks broken. Emphasize with weight, color, or 圏点 (`text-emphasis`).
- **Line breaking**: set `word-break: auto-phrase; line-break: strict; overflow-wrap: anywhere;` once, on the root (`html:lang(ja)`), and never reset `word-break` to `normal` on `body`, cells, or controls, so headings, buttons, labels, navigation, table cells, `dt`/`dd`, notes, and running text all break between phrases (a break between phrases is also correct in running text). The `overflow-wrap` there is only the fallback for a phrase wider than its line; a break it makes in short text is still a defect to fix. Text of one or two lines never breaks inside a word at any width: where the browser's phrases fall short (a compound such as 差引支給額, a name or a place, a figure with its unit or counter such as 1.5時間 or 14時03分), keep it whole with a `white-space: nowrap` span or a `<wbr>` at its real boundary, or give it room. Short headings also get `text-wrap: balance`. Code, commands, and figures follow `craft.md` *Responsive*: never `overflow-wrap: anywhere` on them, so set it back to `normal` there. The render check lists short text that breaks inside a phrase (R31).
- **Punctuation**: full-width 「」、。 in Japanese text; consider `text-spacing-trim` / `font-feature-settings: "halt"` for tight punctuation in headings.
- **Mixed scripts**: put half-width spaces between Japanese and Latin only if the brand style does; be consistent.
- **Loading**: Japanese fonts are large. Use a subset or a CDN that serves unicode-range slices, limit to 2 weights, `font-display: swap`.
- **Copy**: avoid hype phrases (R10: 「革新的な」「次世代の」「シームレスな」「圧倒的な」). Buttons are verbs: 「保存する」「送信する」; matching toasts: 「保存しました」.
