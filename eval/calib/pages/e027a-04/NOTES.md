# NOTES: Notifications settings

Budget: standard. Surface: product. Mode: build (with a short DESIGN.md, since later settings screens would share it).

## Grounding

- Subject: the Notifications screen in the account settings of Plotline, a project-management web app.
- Audience: team members who want to be reachable for the things that matter without being interrupted all day.
- Job: **set** which events reach them on which channel, then save. Primary action: **Save changes** (sticky bar, the only amber fill).

Assumptions (nobody to ask): the app name "Plotline", the workspace "Northwind Studio", the user "Sam Ito" and the address `sam.ito@northwind.studio`, the Slack handle shown after connecting, the default preferences, the weekly digest time (Monday 09:00), the due-reminder timing, the time zone list with November offsets, and the rule that quiet hours hold push and Slack but not email are all invented. The preferences API, Slack OAuth, and test sending are simulated in-page.

## Directions considered

Usual look: white or light-gray ground, Inter or system sans, a list of rows with iOS-style toggle switches per event, card panels with soft shadows, a blue Save button.

- A — "Routing faceplate": the X-Y control unit of a broadcast routing switcher; a black faceplate of backlit square keys, events × channels, leads the page.
- B — "Interoffice routing slip": a printed mail-room routing slip with tick boxes and a typewriter face; a light warm paper form in a slab/typewriter face.
- C — "Pager belt clip": a 1990s pager with an LCD segment display; dark mid-tone green LCD ground, a segment-style display face, per-event "beep codes".

**Chosen: A.** The brief is literally a matrix of events by channel, and a routing panel is the object whose whole job is a grid of on/off crosspoints with a commit step. That fits the save flow too. It departs from the usual look on the display genre (condensed engraved caps instead of a neutral sans), the look of the main control (square backlit keys instead of toggle switches), and the surface (a graphite faceplate band instead of white cards). B is too close to the printed-document house look (R04d). C's LCD ground would hurt legibility for a form people fill in by day.

## Source sheet and tokens (summary)

- Lettering → Sofia Sans Extra Condensed caps: page title, channel and event names, key states, section titles, the save key.
- Key states → native checkboxes under square caps. Lit cool white = On, dark cap = Off, dashed edge = channel not connected.
- Faceplate material → the events matrix, the quiet-hours strip, and the sticky save bar.
- Habit (changes are staged, then committed with a separate key) → unsaved keys get an amber top edge, and the amber save key commits them. Amber means only "changed, not saved" and "save".
- Words kept out of the copy: take, route, crosspoint, source, destination, bus, salvo, preset, router, panel, tally.
- Accent candidates: commit-key amber, tally green, cool-white backlight. Amber became the accent because it marks what the user still has to act on. Cool white carries "on" without competing with Save. Green was rejected because it would read as success status.
- Display candidates: a condensed grotesk (the key legends), a slab typewriter (routing slip), an LCD segment face. Body is Sofia Sans, the same family as the display face but a different width.

Challenge pass: I first planned amber for the "on" state. I changed it because it would have put up to 12 amber fills next to the save key. I dropped tinted ground in favor of a true neutral, so the faceplate is the only material. I dropped a dark full page because form fields read better on light ground.

## Signature

The **events-by-channel faceplate**: a grid of backlit square keys, lit when on, with an amber top edge while a change is unsaved. It is built from the routing panel's key rows. The same unit is reused in the quiet-hours strip (48 half-hour cells, lit when notifications arrive, dark when they wait) and in the sticky save bar (a strip of the faceplate whose save key is the only amber fill).

## States and how to reach them

- Unsaved changes: toggle any key. It gets an amber top edge, and the bar shows "N unsaved changes" with Discard and an enabled Save.
- Inline validation: set End equal to Start. You get an error under the fields, `aria-invalid` on End, and Save is blocked with focus moved to End.
- Save success: press Save changes and the bar shows "Saved at <time>".
- Save failure: go offline (devtools), or open with `?api=down`, then save. A "Not saved" badge appears, the changes are kept, and Save stays enabled to try again.
- Slack disconnected (default): the Slack column's keys are dashed and disabled, with "Not connected" and a "Connect Slack" button. Connecting shows "Connecting…", then the handle and Disconnect (confirmed), and the keys become usable. Offline connect shows an error in the column head.
- Send test notification: the per-channel result list shows "Sent at <time> to …", or a failure message when offline. Slack is skipped while disconnected.
- Quiet hours off: the fields are disabled, every cell in the strip is lit, and the summary says notifications arrive any time.
- Leaving with unsaved changes triggers the browser's leave-page prompt.

## Checks

- lint: floor 0 · reflex 0 · finish 0
- render: floor 0 · reflex 0 · finish 0 (320/768/1280/1920)
- tokens-check: floor 0 · reflex 1 (R08: 11 color tokens, which includes the graphite faceplate family and two status colors; accepted for the faceplate material). Before this, a cap-edge contrast finding was fixed by moving #80878F to #8A9199.

Fix rounds: (1) `[hidden]` was overridden by `.btn { display: inline-flex }`, so Discard showed with no changes; (2) the event column was squeezed at 768, fixed by retuning the grid track minimums; (3) the summary times were 24-hour while the time inputs showed locale time, so the summary and error now use the locale format; the email address no longer breaks mid-word. Accessory removed: the divider rule between the wordmark and the workspace name.

## Reflex findings kept

None.
