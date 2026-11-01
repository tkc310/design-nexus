# DESIGN.md

## Subject

- Subject: Circulate, a small team-workflow tool in which every piece of work is a routing slip. The slip sits with one person at a time and travels down a list of names, and each name is crossed off at the handover.
- Audience: leads and members of teams of 3 to 30 people (studios, small agencies, office teams) who lose track of whose desk a job is on.
- Job of the main surface: get the visitor to start a slip, which means leaving a work email.
- Surface type: marketing

## Direction

"Interoffice envelope." The page borrows from the brown interoffice envelope and its routing slip: kraft stock as the ground, condensed gothic caps like the printed "TO / DEPT / DATE" headers, names written by hand, and blue ballpoint for crossing names off and circling the current holder. Red stamp ink is used only for status (due, error). The signature is the routing slip in the hero. It is live: "Pass it to …" crosses off the current holder and circles the next one. The ruled slip row is the unit the page is built from. The how-it-works route, the ledger of guarantees and the join form all reuse that same ruling, circle and strike.

## Tokens

```tokens
color.bg: #C9A272
color.surface: #F4EFE3
color.text: #21180E
color.muted: #43321D
color.accent: #193389
color.on-accent: #F4EFE3
color.border: #6E5130
color.danger: #A3222A
font.display: "Barlow Condensed", "Arial Narrow", sans-serif
font.body: "Public Sans", system-ui, sans-serif
font.utility: "Caveat", cursive
type.base: 17px
type.ratio: 1.25
space.base: 8px
radius.default: 3px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/bg, accent/surface, danger/surface, border/surface
```

Sources: kraft = interoffice envelope stock; slip = routing-slip card stock; ink = the envelope's printed black; ballpoint = the pen that crosses names off (the user's action); stamp = the rubber-stamp pad (status only); fold = the creased, darker kraft at a fold (rules and borders).

Type: display Barlow Condensed 600/700 (the envelope's printed condensed gothic); body Public Sans 400/600 (form-like and plain); hand Caveat 600 for names written on a slip, and nothing else. Loaded from Google Fonts with `display=swap`. Sizes: 14 / 17 / 21 / 28 / 44 / clamp(48–84).

## Patterns

- Buttons: primary = ballpoint fill, slip-colored text, 3px radius, 48px tall, press `scale(0.97)`. Focus = 3px ink outline offset 3px (ballpoint on dark fills).
- Inputs and forms: a ruled line on the slip (2px ink bottom border on a slip-colored field), label above in condensed caps, hint and error below tied with `aria-describedby`. Errors in stamp red with a word, not color alone.
- Cards / panels: only the slip itself (slip stock, 1px fold border, a real but small shadow because it is a paper sheet lying on the envelope).
- Tables: ruled rows, 1px fold rules, condensed caps headers.
- Navigation: wordmark + two links + one action.
- Motion: only the handover in the slip (strike draws with scaleX, circle fades in, about 260ms ease-out). With reduced motion, the state changes without movement.

## Page overrides

None.

## Looks used

- index.html (landing): mid-tone warm kraft ground (hue ~33°), cool ballpoint-blue accent (hue ~228°) plus stamp red for status only; condensed gothic display + plain grotesk body + hand script for names; material surface (paper slips lying on kraft) with small real shadows, ruled rows, ballpoint strike and circle marks.

## Learnings

- 2026-10-31: Rejected a terracotta or stamp-red accent. Red belongs to "due" and error status on a routing slip, and a warm accent on kraft would land on R04a. Ballpoint blue is the colour of the user's own action (crossing off, circling).
- 2026-10-31: Removed the punched holes on the slip's binding edge: at every width they read as list bullets that did not line up with the rows.
- 2026-10-31: Rejected a dark kitchen-ticket-rail direction (near-black + one hot accent sits on R04b) and a whiteboard direction (marker colour sprawl, R08).
