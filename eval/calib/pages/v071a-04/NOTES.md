# NOTES: Notifications settings (04-settings-form)

Budget: standard. Surface: product. Mode: build (no DESIGN.md existed, so one was written here).

## Ground

- Subject: the Notifications page in Fieldwork, a project-management web app (boards, tasks, due dates, @mentions).
- Audience: daily users who get pinged at the wrong time or in the wrong place.
- Job: route each event to the right channels and set when nothing reaches them.

## Three directions considered

- A, "Patch bay": borrows a telephone switchboard. Events × channels as sockets with patch cords, mono labels, hairlines, dense. Leads with the matrix.
- B, "Reach ruler" (chosen): borrows the 24-hour day from due dates, reminders, and quiet hours. A ruler built from hour cells, quiet hours drawn as a night band, a live "now" marker. Light neutral canvas, white panels with soft real elevation, grotesk display.
- C, "Night shift": dark ground with the quiet-hours dial as the hero, moon/night palette, rounded type. This was the one outside my habits, and it was argued from quiet hours.

I picked B because the brief comes down to two questions: what reaches me, and when. A only answers "what", and it slid toward the mono-label house look (R04d). C makes a page people visit in the daytime look like it is always night.

## Token decisions

- Accent candidates: unread-badge vermilion `#C2410C` (the dot these settings control), night indigo `#282A5E` (the quiet band), and graphite (task-card ink). I chose vermilion because "on" means "this will put a badge on you". Indigo has the opposite meaning ("won't reach you"), so it marks only the band. Graphite would leave on/off resting on thumb position alone.
- Display candidates: Bricolage Grotesque (grotesk), Fraunces (serif), Barlow Condensed (condensed). I chose Bricolage because the app's own lettering is screen UI type. A serif would read as a printed document. Body is Instrument Sans. Both load from Google Fonts.

## Signature

The 24-hour reach ruler in the Quiet hours panel: 24 hour cells, the quiet window as a night band (it wraps across midnight), and a vermilion "Now hh:mm" marker computed live in the chosen time zone. The hour cell is reused at small size in each channel's column header in the routing table. The email strip is always open, the push and Slack strips show the paused band, and the Slack strip is drawn as empty outlines while Slack is disconnected. The strips update live as quiet hours change.

## States and how to reach them

- Disconnected Slack: this is the default. The Slack column switches are disabled and a callout under the table offers "Connect Slack". Pressing it shows "Connecting…" for about 1 s, then the column turns on with mentions and assigned tasks pre-selected, marked as unsaved. Offline (or URL hash `#offline`), it shows an inline error instead.
- Inline validation: set Ends equal to Starts. On change or blur the end field gets `aria-invalid` and an error tied by `aria-describedby`, and the ruler band disappears. Saving is blocked and focus moves to the end field.
- Save: the save bar counts unsaved changes and offers "Discard changes". "Save changes" shows "Saving…" and then "Saved." with the time. Failure comes from going offline (devtools) or adding `#fail-save` / `#offline` to the URL. Each case gives its own "Couldn't save." message, and the edits are kept.
- Send test notification: reports which channels got the test, says Slack was skipped while disconnected, and says tests ignore quiet hours. Offline gives an error.
- Quiet hours off: the toggle disables the fields, and the ruler and strips show no band.

## Invented content (not real)

The product name "Fieldwork", the user "Rina Okafor" and her address rina.okafor@fieldwork.studio, "2 signed-in devices", the Slack workspace "Fieldwork Studio", the reminder and digest send times (09:00, Mondays), the saved defaults (22:00–07:00, Berlin), and the list of time zones. The API is mocked in-page with 700–1100 ms latency.

## Verification

- Lint (`--design DESIGN.md`): floor 0 · reflex 0 · finish 0 · kept 0.
- Render check (clock pinned to 2026-11-04 14:20 Berlin): floor 0 · reflex 0 · finish 0 · kept 0. The first run had 2 Floor findings (F09: the breadcrumb link was 19px tall), which are fixed.
- A Playwright flow test went through validation, the test send, Slack connect, a successful save, and a failed save, with no console errors.
- Critique fixes: the Menu button was showing on desktop (a specificity bug); the time inputs rendered 12-hour AM/PM, which clashed with the 24-hour ruler, so I switched to 24-hour selects; the time-zone label was cut off at 768; the Slack callout moved below the table so the strips show in the first screen at 320; the save-status dot was wrapping.
- Accessory removed: the "Delivering" legend swatch.

## Reflex findings kept

None.
