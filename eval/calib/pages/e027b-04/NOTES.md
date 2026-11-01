# NOTES — Notifications settings (Tasklane)

Budget: standard. Surface: product. Mode: build (+ DESIGN.md written here, since none existed).

## Ground
- Subject: notification preferences in Tasklane, a project-management web app.
- Audience: people on project teams who use the app daily and either get pinged too much or worry about missing assigned work.
- Job: choose which events reach you on which channel, then **save**. Primary action: "Save changes" (sticky dock, always on the first screen).

## Directions considered
Usual look: white or pale-gray ground, Inter, a stack of cards with blue pill toggles per event, soft drop shadows.

- **A — "Channel strips"** (chosen): a mixing console. Each channel (Email, Push, Slack) is a vertical strip with a tape label on top, a status lamp, and a column of square lit caps; the event legend is printed once at the side for all strips. Dark graphite ground, condensed silkscreen-style display, square lit caps.
- **B — "Breaker panel"**: a household breaker panel and its typed circuit directory. Mid-tone enamel ground, lever toggles with printed ON/OFF, a directory card listing events. Rejected: quiet hours and the Slack connection had no natural place in it.
- **C — "Routing slip"**: an interoffice routing envelope with a ruled name-and-checkbox grid. Buff paper, typewriter mono, hairline rules. Rejected: lands on the agent house look (R04d).

Recommended A because the brief is framed per channel, and channel strips are exactly per-input columns with a shared legend. It departs from the usual look on ground value (dark), display genre (condensed grotesk), the main control (square lit caps instead of pill toggles), and surface (flat strips with tape bands instead of shadowed cards).

## Token plan (summary; full block in DESIGN.md)
- Colors: panel #1E2226 (console paint), strip #2A3036 (faceplate), ink #ECEEF0 / muted #A9B2BA (silkscreen legends), edge #7D8892 (field and cap borders, ≥3:1), lit #F4B740 (lit cap = On, plus the one filled button), on-lit #1A1C1E, tape #E8E1CF (label tape), ok #5ACB7E (signal lamp: connected, saved), err #FF8A7A (error lamp: validation, save failure).
- Accent candidates: lit-cap amber, signal-LED green, cool cap blue. Amber was chosen because the lit cap is how a console shows an engaged button, which is exactly what the user acts on. Green is reserved for its console meaning (connected/saved), and blue had no meaning here.
- Display candidates: Barlow Condensed (silkscreen panel legends), a handwritten marker face (scribble-strip writing), a slab. Barlow Condensed was chosen because the console's own printed legends are condensed caps. Body: Source Sans 3 (humanist). Both are loaded from Google Fonts.
- Scale 1.25 from 16px, 4px spacing base, radii 2–6px, no drop shadows; the only glow is on lit caps.

## Signature
The **three channel strips sharing one printed legend**: lit amber caps in rows that line up across Email/Push/Slack (CSS subgrid), each strip topped by a cream tape label with a status lamp beneath it. The same strip unit is reused by the Quiet hours section (a full-width strip with its own tape label, lamp-style cap toggle, and a 24-segment hour ladder) and by the save dock (strip material plus a status lamp).

Object words kept out of the copy: console, mixer, fader, mute, solo, talkback, bus, gain, clip, patch, signal, channel strip, scribble strip.

## States and how to reach them
- Toggle any event: the footer shows "N unsaved changes" and Discard becomes active.
- Inline validation: set "Until" equal to "From". On change or blur, the field turns red and an error explains the fix; Save is blocked with the status "Fix quiet hours to save" and focus moves to the field.
- Save failure: the **first** save of a session is rejected by the mock API (timeout), which opens an alert band above the dock with "Try again". The retry succeeds and shows "Saved at <time>" with a green lamp.
- Send test notification: per channel ("Send test"; the accessible name is "Send test notification by email/push/in Slack"), with inline confirmation in the strip.
- Disconnected Slack (default): hollow lamp, "Not connected", a "Connect Slack" button, disabled caps, and Send test disabled with the reason "Connect Slack first." Connecting turns on Mentions + Assigned for Slack and counts them as unsaved changes.
- Quiet hours off: fields are disabled and the summary says notifications arrive as they happen.

## Invented content
Product name "Tasklane", user "Maya Ortiz", email maya@orchard-team.com, Slack workspace "Orchard", devices "This browser and Pixel 8", default time zone Berlin, quiet hours 22:00–07:00. The mock API (save fails once, test sends, Slack connect) stands in for a backend.

## Verification
- lint: floor 0 · reflex 0 · finish 0 · kept 0
- render (320/768/1280/1920): floor 0 · reflex 0 · finish 0 · kept 0
- tokens-check: floor 0 · reflex 0 · finish 0
- Flow script (Playwright): toggle → dirty, equal-time validation, blocked save, failed save → retry success, test send, Slack connect, discard. No page errors.
- Critique fixes: the fixed save bar became a sticky dock; the page title moved into the legend column (removing an empty block at 1280/768); summary and saved times now use the same clock format as the time inputs; the 320 time fields were tightened; the app bar aligns with the content cap at 1920.
- Accessory removed: the bevel inset shadow on the caps.
- Full-page screenshots show the sticky dock partway down the page; this is a capture artifact, and in a live viewport it sits at the bottom edge.

## Reflex findings kept
None.
