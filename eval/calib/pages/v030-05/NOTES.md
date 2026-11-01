# NOTES: 05-mobile-transit

Budget: standard. Surface: mobile. Mode: build. Assumptions, since nobody could be asked: the city (ひばり市), the route (ひばり号, one right-hand loop with 8 stops), the times, the fares and the notices are all invented and labelled 見本 on the page. The demo clock is pinned to 2026年11月2日(月) 10:30 so the default render always shows a typical weekday morning with one cancelled trip. 「いまの時刻で見る」 in the footer switches to the device clock.

## Three directions considered

- A: 「バス停の時刻表板」. The page is the enamel timetable plate hung under the stop sign. It keeps the 時 | 分 grid riders already know and the red used for 土休日, and notices look like yellow paper taped to the pole. Light ground, UD gothic, flat bordered plates.
- B: 「行先表示器」. The amber LED destination board on the front of the bus, set on black, with the next three departures as large dot-matrix figures. Dark, mono-led, loud.
- C: 「回数券の綴り」. A saturated ground in the bus livery, with the next three departures as tear-off coupon tickets that have real elevation, and the timetable printed on the ticket's back. Saturated, rounded, tactile.

## Chosen

A. The older riders this page is for already read the plate at the stop every day, so reusing its layout means there is nothing new to learn. A white plate with black figures also gives the most contrast outdoors in sunlight. B was rejected for sunlight legibility and because it sits close to R04b. C was rejected because the card stack would push the countdown below the first screen at 320px.

## Signature

The green 「いま 10:30」 line drawn across the timetable plate at the current time. Minutes already gone are greyed, the cancelled 11:19 is struck through with a yellow 運休 tag, and the next three departures are ringed with the same 1・2・3 as the large 「あと9分」 board above. The board and the plate show the same three buses.

## Accessibility for older riders

- Body text is 18px, and 「文字を大きく」 raises it to 22px. Every size is in rem, so the whole page scales, and the setting is remembered in localStorage inside try/catch.
- Every control is at least 48px tall, and the stop picker and the day switch are 56px. The stop picker is a native select, so the phone's own large picker opens.
- Text is never smaller than 16px. The countdown figures are about 55px. Contrast was checked with tokens-check in both light and dark schemes.
- The 平日/土日祝 switch sits right above the table it controls. The countdown always follows today's real timetable, and a red note appears when the table shown is not today's.

## Lint and render results

- lint (with --design DESIGN.md): floor 0, reflex 0, finish 0
- render-check (default, and with --surface mobile for 44px targets): floor 0, reflex 0, finish 0
- tokens-check: floor 0, reflex 0, finish 0
- I also checked by hand: no horizontal scroll at 320px in large-text mode, and the dark scheme.

## Reflex findings kept

None. Lint and render reported no Reflex findings.

## Critique rounds

1. Notices pushed the countdown below the first screen at 320px, so they moved below the board. The countdown rows stretched apart at 768px, so the column is capped at 640px below 960px. The header wrapped and the route line split mid-name, so the route uses per-stop nowrap and the brand shrinks beside the button. The end-of-service specimen was changed so that it reads 「あすの始発」.
2. In large-text mode at 320px the header overflowed by 10px. The button is now flex: none and the brand wraps by phrase.

Accessory removed: the 「全19便」 trip count in the plate caption.
