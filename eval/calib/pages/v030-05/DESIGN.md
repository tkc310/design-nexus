# DESIGN.md

## Subject

- Subject: The timetable for 「ひばり号」, the community bus of ひばり市, a fictional regional city. It is one loop route with 8 stops and a 平日/土日祝 timetable.
- Audience: Residents, many of them older, who check it on a phone browser at the stop or before leaving home. They already know how to read the enamel timetable plate at the stop (時 | 分).
- Job of the main surface: Tell someone **when** the next bus leaves their stop, and how many minutes away it is.
- Surface type: mobile

## Direction

「バス停の時刻表板」. The page is the timetable plate that hangs under the stop's sign. The stop name sits on a band in the bus's own green. The plate keeps the hour column and minute rows riders already know, with 土日祝 in the red Japanese timetables use for it. Service notices are printed like the yellow paper taped to the pole. Signature: a green 「いま」 line drawn across the plate at the current time. Minutes already gone are greyed, and the next three departures are ringed with the same 1・2・3 as the large countdown above.

## Tokens

```tokens
color.bg: #EFEFEF
color.surface: #FFFFFF
color.text: #161616
color.muted: #565B60
color.accent: #0A6B4B
color.on-accent: #FFFFFF
color.holiday: #B8102A
color.notice: #FFD83D
dark.color.bg: #111315
dark.color.surface: #1B1E21
dark.color.text: #F1F2F3
dark.color.muted: #A7ADB2
dark.color.accent: #5CC99A
dark.color.on-accent: #0B1210
dark.color.holiday: #FF8A96
font.display: "BIZ UDGothic", sans-serif
font.body: "BIZ UDPGothic", sans-serif
font.utility: "BIZ UDGothic", monospace
type.base: 18px
type.ratio: 1.25
space.base: 8px
radius.default: 10px
pairs: text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/bg, accent/surface, holiday/surface, text/notice
```

Sources: bg = the concrete of the bus shelter (a true neutral); surface = the white enamel of the timetable plate; text = the plate's printed black; muted = the galvanised grey of the stop pole; accent = the ひばり号 green livery; holiday = the red used for 土休日 on Japanese timetables; notice = the yellow notice paper taped to the pole.

## Patterns

- Buttons: at least 48px tall, with a 2px ink border. Pressed or selected buttons are filled. Labels are verbs. The text size control is a toggle button that uses `aria-pressed`.
- Inputs and forms: the stop picker is a native `<select>`, 56px tall, so the phone's own large picker opens. The day type picker is a pair of real radio inputs styled as a segmented control. When selected, 平日 is filled with ink and 土日祝 with holiday red.
- Cards / panels: plates have a 2px ink edge, a 10px radius, and no shadows. A notice is a yellow sheet with ink text.
- Tables: the stop-plate format. A wide hour column, then minutes in a row, with tabular figures. A cancelled trip is struck through and gets a yellow 運休 tag.
- Navigation: none. It is a single page.
- Motion: none beyond colour feedback on press. Reduced-motion path present.

## Page overrides

None.

## Looks used

- index.html: light, neutral concrete ground with white plates. Accent is livery green (hue about 160), with red and yellow used only for status. Type is a UD gothic (BIZ UD). Surface is flat bordered plates with no shadow.

## Learnings

- 2026-10-31: Rejected an amber LED destination board on black (direction B). Riders read the page outdoors in sunlight, and it sits close to the R04b look.
- 2026-10-31: The 平日/土日祝 switch sits right above the table it controls. The countdown always follows today's real timetable, so the switch never makes 「あと何分」 wrong.
- 2026-10-31: The demo clock is pinned to a stated sample time so the default render always shows a typical morning. A footer button switches to the real clock.
- 2026-10-31: Service notices sit directly below the つぎのバス board, not above it. Placed above, they pushed the countdown below the first screen at 320px. The board already shows a cancelled trip inline as a struck row with a 運休 tag.
- 2026-10-31: Removed the 全N便 trip count from the plate caption. It was the least necessary label.
