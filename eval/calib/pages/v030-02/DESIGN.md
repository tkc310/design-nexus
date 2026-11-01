# DESIGN.md

## Subject

- Subject: 京都・五条坂の小さな陶芸工房「土と灯(つちとひ)」。職人2名、日常の器(飯碗・湯呑・小皿)と、月2回・各回6名までの手びねり体験教室。
- Audience: 30〜50代の国内外の旅行者。京都の滞在中に半日を使えるか、手ぶらで行けるか、焼き上がりをどう受け取るかを知りたい。
- Job of the main surface: 体験教室の予約ページへ送る(book).
- Surface type: marketing

## Direction

「窯詰めの棚(Kiln shelf)」: the workshop after dark, lit by one lamp — the shop name made literal (土 = the dark fired clay ground, 灯 = lamplight). The page borrows the act of loading a kiln: pots stand on kiln shelves (棚板) held up by posts (支柱). Signature: in the hero, the next three classes are stacked as lit kiln shelves, each carrying six cups — one cup per seat. Booked seats are solid ash-coloured cups; open seats are lamp-lit outlines. Each shelf is a link to book that date.

## Tokens

```tokens
color.bg: #2E2620
color.surface: #3D332B
color.text: #EFE8DC
color.muted: #BDB1A0
color.accent: #F2B85B
color.on-accent: #2E2620
color.border: #857360
font.display: "Zen Old Mincho", serif
font.body: "Zen Kaku Gothic New", sans-serif
type.base: 16px
type.ratio: 1.25
space.base: 8px
radius.default: 6px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/bg, accent/surface, border/bg
```

Color sources: bg 土 = iron-rich clay after reduction firing; surface 棚板 = a worn kiln shelf; text 白化粧 = white slip; muted 灰 = wood ash; accent 灯 = lamp / kiln glow through the spy-hole; border = the clay body's lighter edge.

## Patterns

- Buttons: one primary style, accent ground with on-accent text, 6px radius, `:active` scale 0.97. Secondary actions are text links with underline.
- Inputs and forms: none on this page (booking happens on the reservation page).
- Cards / panels: none by default. Kiln shelves (`.shelf`) are the only raised element: a 6px accent-lit board with a soft downward shadow, posts drawn between shelves.
- Photo placeholders (`.ph`): dashed border-coloured frame, label 「写真準備中」 + subject, sized to the real object's proportions.
- Tables: definition list (`dl.facts`) with hairline separators, figures nowrap.
- Navigation: logo, 4 links, one action. Wraps to a second row under 560px; no menu script.
- Lamp glow: a radial `--glow` (accent at 20%) appears only above the kiln shelves and on open-seat cups. Nowhere else.
- Ware row: photo frames sized by each piece's diameter (12 / 7.5 / 10.5 fr) and standing on one shared shelf line (subgrid).
- Layout width: 1200px page, 1480px from 1600px wide (cups grow to 44px).
- Motion: none beyond button press and link colour transitions; reduced-motion removes the transform.

## Page overrides

none

## Looks used

- index.html (2026-10-31): dark warm ground (clay brown) with amber lamp accent, mincho display + gothic body, flat with one elevated element (kiln shelves), photo placeholders.

## Learnings

- 2026-10-31: Rejected cream ground + terracotta accent (R04a, the pottery default) and the pale-paper/ink-blue house look. Rejected a 呉須-blue on white porcelain direction for being too close to R04d.
- 2026-10-31: Removed the lamp glow from the closing section: it repeated the hero's signature and diluted it.
- 2026-10-31: Product photography absent; placeholders are sized to real dimensions so the layout does not change when photos arrive.
