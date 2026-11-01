# NOTES — 土と灯 top page

Budget: standard. Surface: marketing. Mode: build (+ DESIGN.md written as the record).

## Ground

- Subject: a two-potter studio on Gojōzaka, Kyoto, making everyday ware (飯碗・湯呑・小皿) and teaching hand-building (手びねり) twice a month, 6 seats per session.
- Audience: domestic and international travelers, 30s–50s, planning a Kyoto day, reading Japanese.
- Job: send them to the class booking page.

## Three directions considered

- A — "窯の棚板 (kiln shelf)": dark iron-glaze ground with lamp light from the studio's name; the upcoming sessions shown as kiln shelves holding six cups, open seats lit. Antique gothic display, flat surfaces with thick shelf boards.
- B — "釉見本 (glaze test tiles)": mid-tone raw grey clay ground; a grid of glaze test tiles, each tile one session or one ware with its glaze code. Humanist sans, textured material surface, dense grid.
- C — "坂の暦 (slope calendar)": light, single column that reads like a hanging paper calendar walking down Gojōzaka, one month per spread; mincho display, illustrated route map leads. (Close to R04a/R04d, which counted against it.)

Chosen: **A**. The studio's own name is earth and lamp, and the page's job is "is there a seat left?", so the lamp can carry meaning (lit = open) instead of decoration. It also avoids the cream + mincho + terracotta look a pottery page drifts into.

## Token plan (as shipped)

- Colors: tenmoku #1f1915 (ground, iron-glaze bowl interior), kiln #2b231e (surface, kiln-wall brick), slip #efe7da (text, white slip), ash #b8ab9b (muted, wood-ash glaze), line #806f61 (shelf boards and outlines, bisque edge), lamp #f2b84b (accent, the studio's 灯).
- Accent candidates: lamp amber (hue ~40°), 青磁 celadon #8db8a6 (~155°), 呉須 cobalt #3e5fa8 (~220°). Chose lamp because it is the studio's name and means "open seat"; celadon would read as a success status, cobalt fails contrast on dark brown.
- Display candidates: Shippori Mincho (serif), Yuji Syuku (brush), Shippori Antique B1 (antique gothic). Chose Shippori Antique B1 because it resembles the hand-painted shop signs along the slope; brush felt like a tourist cliché, mincho is the default look.
- Body: Zen Kaku Gothic New 400/700. Both via Google Fonts with `display=swap`.
- Scale: 16px base, ratio 1.25 (14/16/20/25/31, hero 31→49). Spacing base 8px. Radius 4px on buttons only. No shadows except the lamp glow on open seats and the 6px board shadow.

## Signature

The **seat board** in the hero: each upcoming session is a kiln-shelf board holding six cup profiles (one per seat); open seats are lit in lamp amber, taken seats are bisque outlines, with 残りN席 / 6席 in text. Unit: the shelf board + cup profile. Reused by the wares row (vessel profile drawings with dimensions standing on a board), the class-day timeline (board under the steps at desktop), the makers list, and the closing CTA (the next open session's six cups again).

## Default render and states

- On load the board shows four sessions in four states: full (満席, with キャンセル待ち link), 2 left, 5 left, all 6 open.
- Booking links go to `/reservation/` (with `?date=` per session; `&waitlist=1` for the full one). The booking page itself is outside this brief.

## Photo placeholders

Brief asked for explicit placeholders. Each is a hatched frame with a caption chip 「写真｜<intended shot>」 (one 「地図｜…」 for the map), and the same text in `aria-label`. Intended shots: the shopfront at dusk, the three wares (one each), the two potters at the wheel room, and a map.

## Invented content (to confirm with the studio)

- Session dates (Sun 11/8, 11/22, 12/6, 12/20, 2026), time 13:00–15:30, and seat counts.
- Class details: what you make (飯碗か湯呑を1点), timeline times, glaze choice (白化粧 or 灰釉), delivery about 2 months later, guidance in Japanese and simple English, apron lending.
- Ware dimensions (飯碗 径12cm・高さ6.5cm, 湯呑 径7.5cm・高さ9cm, 小皿 径11cm・高さ2cm).
- Potters' names and roles: 高瀬 亮 (成形と削り), 宮本 早苗 (釉薬と焼成).
- Shop hours 11:00–17:00, closed Wednesdays; walking times from 清水五条 station and 五条坂 bus stop are approximate.
- No price is shown (the page defers fees to the booking page); an `/en/` English page is linked but not built.

## Verification

- lint: floor 0 · reflex 0 · finish 0 (also with `--design DESIGN.md`).
- render: floor 0 · reflex 0 · finish 0 at 320/768/1280/1920.
- tokens-check: floor 0 · reflex 0 · finish 0.
- Fix rounds: (1) cup SVG fill/stroke did not reach the `<use>` shadow tree, so every seat rendered solid black; now colored via inherited custom properties. (2) Horizontal scroll at 320/768 from `aspect-ratio` + `min-height` photo slots and unshrinkable grid tracks; fixed with `minmax(0, …)` and removing the min-heights. (3) 16px-wide 「器」 nav tap target; nav links now 44px minimum. (4) Timeline headings broke every 2–3 characters at 1280; timeline now spans the full row with facts below. (5) Compact 320 header; lead copy 16px on mobile; widened measure at 1600px+.
- Accessory removed: the "→" arrows in the two primary buttons.

## Reflex findings kept

None. (R04b, near-black + single accent, was considered: the ground is a brown iron-glaze, not near-black, and the accent is lamp amber rather than acid green or vermilion, and it carries seat state. Not flagged by the tools.)
