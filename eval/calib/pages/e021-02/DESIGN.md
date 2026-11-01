# DESIGN.md

## Subject

- Subject: 土と灯(つちとひ), a two-potter ceramics studio on Gojōzaka, Kyoto, making everyday ware (rice bowls, teacups, small plates) and running a hand-building class twice a month, 6 seats per session.
- Audience: domestic and international travelers in their 30s–50s planning a Kyoto day, reading in Japanese.
- Job of the main surface: send visitors to the class booking page (`/reservation/`).
- Surface type: marketing

## Direction

"窯の棚板 (kiln shelf)": the page is the studio after dark, iron-glaze brown with lamp light. Everything stands on kiln-shelf boards (a 6px bisque-colored board under each row). The signature is the seat board in the hero: each upcoming session is a shelf holding six cup profiles, one per seat; open seats are lit in lamp amber (灯), taken seats are bisque outlines. The same cup profile and shelf board build the wares row (vessel profile drawings with dimensions standing on a board), the class-day timeline (a board under the five steps at desktop), the makers list, and the closing call to action.

## Tokens

```tokens
color.bg: #1f1915
color.surface: #2b231e
color.text: #efe7da
color.muted: #b8ab9b
color.accent: #f2b84b
color.on-accent: #1f1915
color.border: #806f61
font.display: "Shippori Antique B1", sans-serif
font.body: "Zen Kaku Gothic New", sans-serif
type.base: 16px
type.ratio: 1.25
space.base: 8px
radius.default: 4px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/bg, accent/surface, border/bg, border/surface
```

Sources: bg = inside of a tenmoku (iron-glaze) bowl; surface = kiln-wall brick; text = white slip (白化粧); muted = wood-ash glaze; border = bisque edge / kiln shelf; accent = the lamp of the studio's name (lit seat = open seat).

Type sizes in use: 14 / 16 / 20 / 25 / 31, hero clamp 31→49. Japanese body line-height 1.8, letter-spacing 0.03em; headings 1.3–1.4 with `palt`.

## Patterns

- Buttons: primary = lamp fill, tenmoku text, 48px min height, 4px radius; secondary (`btn--quiet`) = transparent with bisque 2px border, 44px min height. Press `scale(0.97)` at 140ms; hover only under `(hover: hover) and (pointer: fine)`.
- Inputs and forms: none on this page (booking happens on `/reservation/`).
- Cards / panels: no cards. `.board` = kiln-wall surface with a 6px bisque board on top; used for the hero seat board and the closing CTA.
- Shelf: `.shelf` = 6px bisque bottom border plus a 6px surface-colored shadow below it. Under each session row, the wares head, each ware's name row, makers heading and entries.
- Seats: inline SVG `<symbol id="cup">`, colored by `--cup-fill` / `--cup-stroke` set on `.seat` / `.seat.is-open` (custom properties reach the `<use>` shadow tree). Open seats get a lamp drop-shadow. Seat count is always repeated as text (残りN席 / 6席, 満席).
- Photo slots: hatched kiln-wall frame with a dashed bisque outline and a caption chip 「写真｜…」 or 「地図｜…」 describing the intended shot; `role="img"` with the same text in `aria-label`.
- Tables: none; facts are `<dl>` with muted `dt` (4 columns at 960px+ in the class section).
- Layout: content max width 72rem, widened to 86rem at 1600px+.
- Navigation: logo, 器 / 教室 / 工房 / アクセス / English, and a secondary 「教室を予約」 button. Not sticky. Below 900px the links wrap to a second row.
- Motion: only button/nav hover and press transitions (140–160ms); no entrance animation.

## Page overrides

None.

## Looks used

- index.html — dark; ground warm brown (tenmoku, hue ~25°), accent lamp amber (hue ~40°); antique-gothic display (Shippori Antique B1) + gothic body (Zen Kaku Gothic New); flat surfaces with thick shelf-board rules and hatched photo slots.

## Learnings

- 2026-10-31: Rejected the cream + mincho + terracotta look (R04a) that a pottery studio invites by default; rejected 染付 white + cobalt as too close to the house look (R04d).
- 2026-10-31: `.seat .cup` descendant selectors do not reach into `<use>` shadow trees; the cups rendered solid black. Color symbols through inherited custom properties instead.
- 2026-10-31: A five-step timeline inside a 2/3 column broke Japanese headings into 2–3 character lines at 1280; the timeline now spans the full row and the facts sit below it.
- 2026-10-31: `aspect-ratio` plus `min-height` on a photo slot forced it wider than 320px; use one or the other.
