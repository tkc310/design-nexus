# NOTES — Notifications settings (Kestrel)

Budget: standard. Mode: build (with a DESIGN.md written for the project). Surface: product.

## Ground

- Subject: the Notifications page in the account settings of a project-management web app (named "Kestrel" here).
- Audience: team members who get too many pings, or worry about missing work assigned to them.
- Job: route each event to the channels you want, then **save**. Primary action: "Save changes".

## Three directions considered

- A — "Switchboard": borrows the patch panel. Events are inputs, channels are outputs, and each crossing is a jack that is lit or dark. A dark graphite faceplate set into a quiet, neutral page. Table/board structure, condensed grotesk display, one elevated physical panel.
- B — "Day clock": borrows the 24-hour dial of a timer switch. Quiet hours lead the page as a radial dial on a dark, mid-tone ground, with the channel choices as segments around it. Canvas/diagram-led, humanist sans, illustrated surface.
- C — "Sorting rack": borrows the mailroom pigeonhole rack. Each channel is a card, a slot in the rack, holding its event toggles. Light warm ground, slab display, cards with real elevation.

**Chosen: A, "Switchboard".** The brief is a channel × event matrix, and a switchboard is exactly that object. It keeps the page dense and scannable, as product settings should be. B made quiet hours the hero, but quiet hours are secondary to the routing. A radial dial is also hard to operate by keyboard and unreadable at 320. C splits one decision ("where does a mention go?") across three cards.

## Signature

The **routing faceplate**: a dark graphite panel in which each event × channel crossing is a 40px jack with an amber lamp (lit = this notifies you; hollow ring = off; dashed ring = unplugged). The unit is the jack cell, and two other parts reuse it:
- The quiet-hours rail is 24 of the same cells on a faceplate strip. Lit hours deliver notifications, dark hours hold them, and a ring marks the current hour in the chosen time zone.
- The Test panel lists each destination with a miniature jack. It is lit when a test would reach that channel.
- The disconnected Slack state is a column of unplugged jacks plus a connect row on the same faceplate.

Amber is used only for "this will notify you". The primary button is graphite, so the accent keeps one meaning.

## States (all on the real code path, using a fake API with real failure branches)

- Disconnected Slack: this is the default. Slack jacks are disabled and described by the connect row. "Connect Slack" shows "Connecting…" and then a connected state with "Disconnect Slack". The Slack routes saved earlier come back on.
- Inline validation: set "Until" equal to "From". The error appears on change or blur with `aria-invalid` and `aria-describedby`, and clears as soon as the times differ. Save is blocked, the bar reads "Fix the quiet-hours time to save", and focus moves to "Until".
- Save success: change any jack and press Save changes (or Ctrl/Cmd+S). You get "Saving…" and then "Changes saved".
- Save failure: go offline (DevTools → Network → Offline), or load the page with `#fail-save` to get a 503. An alert explains the failure and says changes are kept, the status reads "N changes not saved", and Discard stays available.
- Send test notification: it sends to every live channel and gives a result per destination ("Sent at hh:mm", or "Skipped: Slack isn't connected"). With every route off you get "Nothing to send…". Offline or `#fail-test` gives a failure message.
- Dirty tracking: shows a change count, offers Discard, and warns on `beforeunload`.

## Invented content (no real material was supplied)

- Product name "Kestrel"; user "Maya Ortiz" (MO), maya.ortiz@tallgrass.studio; push devices "Pixel 8 and MacBook Air"; Slack workspace "Tallgrass Studio".
- Default routing, quiet hours 22:00–07:00, and America/Chicago time zone; last-saved time "Oct 28 at 16:12".
- Event descriptions (e.g. due-date reminders "the day before, and the morning a task is due"; digest "Monday morning").
- The "held notifications arrive as one bundle at the end of quiet hours" behaviour is an assumed product rule.

## Assumptions

- Slack connect takes effect immediately, like an OAuth grant. It is not part of the save.
- Test notifications use the routing as shown, saved or not.
- No dark scheme was requested, so only the light scheme was built.
- The page-level loading state (fetching settings) was not built, because the brief did not ask for it.

## Critique rounds (2 used)

1. The bottom sticky save bar covered the lower panels on the default render at 768–1920. From 560px it now sits under the title and sticks to the top, with DOM and focus order matching. Below 560px it stays a one-line bottom bar.
2. Time inputs clipped "10:00 PM" at 320 and 1280. The fields now stack below 420px and get a 9.5rem minimum from 560px.
3. At 320 the avatar was stranded on its own row (it now shares row 1 with the wordmark). The Test panel was taller than Quiet hours at 1280 (copy and row padding are tightened).
- Accessory removed: the decorative plug icon in the Slack connect row.

## Tool results

- lint (with `--design DESIGN.md`): floor 0 · reflex 0 · finish 0
- render-check: floor 0 · reflex 0 · finish 0
- tokens-check: floor 0 · reflex 0 · finish 0

## Reflex findings kept

None.
