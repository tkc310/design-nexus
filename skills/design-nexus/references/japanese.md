# Japanese typography (和文組版)

Read whenever the interface contains Japanese text.

- **Font choice: voice first.** Name the voice the subject's own lettering has (its signage, packaging, documents, screens), then choose inside that row. Do not start from a family.

  | Voice | Families (Google Fonts) |
  |---|---|
  | Plain modern gothic | Noto Sans JP, IBM Plex Sans JP, M PLUS 2, Murecho, LINE Seed JP |
  | Soft or humanist gothic | Zen Kaku Gothic New, Zen Kaku Gothic Antique, BIZ UDPGothic (universal design: public services, older readers) |
  | Rounded | Zen Maru Gothic, M PLUS Rounded 1c, Kiwi Maru |
  | Formal mincho | Noto Serif JP, Shippori Mincho, BIZ UDPMincho, Zen Old Mincho |
  | Literary or antique mincho | Zen Antique, Zen Antique Soft, Shippori Antique, Kaisei Tokumin, Kaisei Opti, Hina Mincho |
  | Pen and textbook | Klee One |
  | Brush | Yuji Syuku, Yuji Boku, Yuji Mai |
  | Display | Dela Gothic One, RocknRoll One, Reggae One, Stick, DotGothic16, Rampart One |

  Agents reach for one brush face over one soft gothic for anything traditional, and Noto Sans JP for everything else. If your first pick is the family you would pick for any page in this genre, take the second candidate. Mincho as body needs 16px or more and line-height 1.8 or more; below that, use a gothic for body and keep the mincho for headings.
- **Roles and the Latin pair**: one Japanese face with a voice for display, one quiet face for body. Pair a Latin face for alphanumerics by listing it first: `font-family: "Inter Tight", "Zen Kaku Gothic New", sans-serif` — the Latin face renders Latin, the Japanese face renders kana and kanji. Match their weight and x-height by eye in the screenshot; resize the Latin face with `size-adjust` in its `@font-face` if figures look small beside kanji.
- **Beauty and weight together.** A Japanese family is thousands of glyphs, and every weight of every family is a separate download. Spend that budget where the voice is seen:
  - **Body may be the system stack.** It costs nothing, renders at once, and is well made on every platform: gothic `"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic Medium", "Yu Gothic", Meiryo, sans-serif`; mincho `"Hiragino Mincho ProN", "Yu Mincho", serif` (Android has no system mincho, so mincho that must show everywhere is a web font). Choose a web font for body only when its voice is part of the direction.
  - **At most two Japanese web families and three family-weight pairs on a page** (for example display 700, body 400 and 700). Load only the weights the CSS uses (R34).
  - **A display face on a few headings is already cheap.** Google Fonts serves Japanese families in unicode-range slices, and the browser fetches only the slices the page's characters touch, so one weight of a display face used for the logo and the headings downloads a fraction of the family. Do not hand-subset with `&text=` on anything whose words can change: the next copy edit adds a character outside the list and it is drawn in another face in the middle of the heading. Reserve `&text=` for a string that is fixed for good (a logotype), on a class used by that string alone.
  - **Always** `display=swap` (or `font-display: swap` in `@font-face`), and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` before the stylesheet. Self-hosted files are woff2, subset, with `unicode-range`.
  - **Every stack that names a Japanese web font continues with system faces of the same genre** before the generic family (the stacks above), so text is readable before the font arrives and the swap does not change the genre or the line breaks much (R34).
- **Single-weight faces stay at their weight.** Most brush and display faces ship one weight. Set `font-weight: 400` and `font-synthesis: none` where they are used; a synthesized bold smears the strokes.
- **Check the glyphs.** A display face can lack a rarer kanji, and the browser then borrows that one character from another face in the middle of a word. Read every heading and proper name in the screenshot; if one character looks different, change the word or the face.
- **Weight and size**: Japanese glyphs look larger and darker than Latin at the same size. Body 15–17px, weight 400; avoid 300 for body on Windows.
- **Line-height**: body 1.7–1.9; headings 1.3–1.5. Tight line-height that suits Latin crowds kanji.
- **Measure**: 30–40 full-width characters per line for body.
- **Letter-spacing**: body 0.02–0.05em; headings may use `font-feature-settings: "palt"` (proportional kana) with 0–0.02em. Never negative tracking on Japanese.
- **No italic.** Japanese fonts have no true italic; synthetic slanting looks broken. Emphasize with weight, color, or 圏点 (`text-emphasis`).
- **Line breaking**: set `word-break: auto-phrase; line-break: strict; overflow-wrap: anywhere;` once, on the root (`html:lang(ja)`), and never reset `word-break` to `normal` on `body`, cells, or controls, so headings, buttons, labels, navigation, table cells, `dt`/`dd`, notes, and running text all break between phrases (a break between phrases is also correct in running text). The `overflow-wrap` there is only the fallback for a phrase wider than its line; a break it makes in short text is still a defect to fix. Text of one or two lines never breaks inside a word at any width: where the browser's phrases fall short (a compound such as 差引支給額, a name or a place, a figure with its unit or counter such as 1.5時間 or 14時03分), keep it whole with a `white-space: nowrap` span or a `<wbr>` at its real boundary, or give it room. Short headings also get `text-wrap: balance`. Code, commands, and figures follow `craft.md` *Responsive*: never `overflow-wrap: anywhere` on them, so set it back to `normal` there. The render check lists short text that breaks inside a phrase (R31).
- **Punctuation**: full-width 「」、。 in Japanese text; consider `text-spacing-trim` / `font-feature-settings: "halt"` for tight punctuation in headings.
- **Mixed scripts**: put half-width spaces between Japanese and Latin only if the brand style does; be consistent.
- **Copy**: avoid hype phrases (R10: 「革新的な」「次世代の」「シームレスな」「圧倒的な」). Buttons are verbs: 「保存する」「送信する」; matching toasts: 「保存しました」.
