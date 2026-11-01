# Notes: Notifications settings (04-settings-form)

Budget: standard. Surface: product. Mode: build (plus a project DESIGN.md, since none existed).

## Assumptions
- Fictional workspace "Meridian Studio" and user "Ren Takeda"; email address, devices, and Slack workspace are sample data, labeled as such in the sidebar.
- Slack starts disconnected (the required state). "Connect Slack" simulates the OAuth round trip (about 1 s), then fills the Slack column with sensible defaults (mentions and assigned tasks on). The connection is treated as saved by the integration, so it does not count as an unsaved change.
- Save is simulated (about 0.9 s). It succeeds by default; open the page with `#simulate-failure` in the URL (or go offline) to see the live failure toast with "Try again". Both outcomes are also shown statically in the specimen section.
- "Send test notification" goes to every channel that has at least one event on, ignores quiet hours, and reports which channels it used and which it skipped.
- Quiet hours store a start, an end, and an IANA timezone; a window may wrap past midnight. Validation runs on blur (and on every change once an error is showing) and blocks Save, which then moves focus to the End field.

## Three directions considered
- A "Switchboard and night band": the event × channel matrix as a switchboard where every "on" switch is a lit amber lamp; quiet hours drawn on a 24-hour day strip in a night color. Light, true-neutral ground, grotesk type, flat hairline panels.
- B "Night shift": a dark, mid-blue ground built around a circular 24-hour clock dial for quiet hours, humanist sans, cards with real elevation; the matrix sits under the dial.
- C "Routing slip": borrows the inter-office routing slip; a single column of checkbox rows per event, slab type, ruled lines on a paper-colored ground.

## Chosen
A. The matrix is the actual data structure the user edits, so it leads the page, and a product settings screen wants quiet surfaces with color kept for state. B's dial was rejected because its hour labels drop below 12px at 320px wide and the dial is hard to read for a wrapped window. C was too close to the agent "house look" (paper ground, hairlines, printed-document feel).

## Signature
The 24-hour day strip under quiet hours. It shows the quiet window in the night color (split into two segments when it wraps past midnight), an amber tick where held notifications are delivered, and a live readout ("9 h 30 min quiet · held notifications arrive at 07:30 Tokyo time"). It redraws as start, end, timezone, or the on/off switch change, and shows the validation error in place (dashed red outline, "No quiet window: start and end are the same"). It is visible and complete on first load.

## Verification
- Lint: floor 0 · reflex 0 · finish 0 · kept 0.
- Render check (320/768/1280/1920): floor 0 · reflex 0 · finish 0 · kept 0. (The first run flagged R18 at 320px, where the matrix's channel column kept its 22% width and squeezed the channel names to one letter per line. Fixed.)
- Tokens check: floor 0, reflex 1 (R08 in tokens-check: 11 color tokens). Kept because the count includes white `on-accent` twice (as `surface` and `on-accent`) plus two status colors and the control-border color that switches need for 3:1. The page itself uses 10 distinct hex values, all DESIGN.md tokens.
- Flows checked in Playwright: equal start and end shows the error and blocks Save with focus on End; fixing it clears the error; Slack connect adds four labeled switches; the test reports its channels; save success and `#simulate-failure` show the right toasts; no page errors.

## Critique fixes
1. A sticky bottom save bar sat over the "Quiet hours" heading in full-page captures and left a blank gap where it rested. It became a sticky top bar holding the title, save state, and Save, so the primary action sits beside the title and is on the first screen at 320px.
2. At 320px the channel header column collapsed to one character wide (the R18 above). Its width is reset when the matrix reflows into one block per event.
3. Time inputs clipped "10:00 PM" behind the picker icon at 320px. Start and End now stack below 400px. The email address no longer breaks mid-word at 768px (a `<wbr>` after the @).
Also: the "Remind me" select no longer stretches across the event column.

## Accessory removed
A "now" timestamp on the specimen success toast. The live toast never had one, so the specimen was not an accurate copy.

## Reflex findings kept
None in lint or render. Only the tokens-check R08 above.
