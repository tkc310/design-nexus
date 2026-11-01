# NOTES: Notifications settings (04-settings-form)

Budget: standard. Surface: product. Mode: build (plus system: DESIGN.md written here).

## Ground
- Subject: the Notifications page in account settings of "Gantry", a project-management web app.
- Audience: team members who already get too many pings and want only the ones that matter, where they want them.
- Job: route each event to the right channels (and keep nights quiet).

## Three directions considered
- A — "Routing grid": borrows the switchboard / routing matrix (events × channels); a light neutral table/board, grotesk display, flat hairline cells; the grid leads the page.
- B — "Night clock": dark ground (the night the user wants protected), mono-led type, quiet hours as a large 24-hour dial leading the page, channels as rows beneath.
- C — "Inbox ledger": mid-tone ground, humanist sans, one elevated card per channel with its own event list, like separate inboxes stacked.

**Chosen: A.** The decision a person makes here is a comparison across channels ("mentions to push, but digest only by email"); only the grid shows that at a glance. B makes quiet hours (one section) the whole page; C hides the cross-channel comparison inside separate cards.

## Signature
The routing grid with a ledger total line: under each channel a live "Notifications a week" figure plus a tally of five-mark groups, so switching a cell on shows its cost in pings. The unit is the hairline cell; it also builds the "Hold during quiet hours" row, the single merged cell that holds the Slack-not-connected state, and the 24-cell quiet-hours strip.

Token plan, accent candidates (mention magenta chosen, switchboard-lamp amber, link ink-blue) and display face candidates (Archivo semi-condensed grotesk chosen for column-header/label lettering; IBM Plex Mono rejected as the agent house look; Source Serif rejected as document-like for a control surface) are in DESIGN.md.

## States and how to reach them
- Slack disconnected: default. "Connect Slack" (in the Slack column) runs a mock connect (~0.9 s), then the column fills with the earlier saved Slack choices and focus moves to the first Slack cell. Reload to return to disconnected.
- Inline validation: set End equal to Start (e.g. 10:00 PM). Error shows on change/blur with a suggested fix; Save is blocked and focus moves to End. Clearing End shows "Enter an end time".
- Save failure: the mock API fails the **first** save of the session ("Gantry didn't respond in time") and any save while offline. Changes stay; pressing Save changes again succeeds.
- Save success: "Changes saved at <time>"; the unsaved-changes count and Discard return as soon as anything changes.
- Discard: appears with unsaved changes; restores the last saved state.
- Send test notification: sends to every connected channel that has at least one event on; reports which channels and that Slack was skipped when disconnected. With every route off it explains what to turn on.
- Quiet hours off: the toggle disables the fields, greys the strip, and disables the hold row.
- Time zone hint: when the device zone differs from the saved one (and is in the list), a "Use <zone>" link appears.

## Assumptions and invented content
- Nobody answered questions; the app name "Gantry", workspace "Harbor Studio", user "Dana Okafor", email dana@harborstudio.co are invented.
- Weekly rates (mentions 12, assigned 5, due reminders 7, digest 1) are invented and stand in for "your last 4 weeks".
- Weekly digest is assumed not available by push. Due-date reminders get a lead-time choice.
- Quiet hours apply per channel via the hold row (default: push and Slack held, email not).
- No dark scheme: product settings page, light only (stated in DESIGN.md tokens).
- Fonts load from Google Fonts; fallbacks are Arial Narrow / Segoe UI.

## Tool results (final)
- lint: floor 0 · reflex 0 · finish 0 · kept 0
- render-check (320/768/1280/1920): floor 0 · reflex 0 · finish 0 · kept 0
- Fixed during verification: F08 horizontal scroll at 320 (top bar now wraps); R21 sticky save bar over grid text at 768 (bar made static); Discard showing while clean ([hidden] overridden by .btn); time inputs clipped at 320 (fields stack below 480); Connect Slack overflowing its cell at 768 (narrower label column 600–959); stale validation message after the fix.
- Accessory removed: red inset stripe on the Slack notice.

## Reflex findings kept
None.
