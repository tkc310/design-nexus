# NOTES — Notifications settings (Plotboard)

Budget: standard. Mode: build (no DESIGN.md existed, so one was written here). Surface: product.

## Ground

- Subject: the personal Notifications settings page of Plotboard, a project-management app for small studio teams.
- Audience: daily users who either miss mentions or get pinged too much.
- Job: route each event to the channels that should ring, and set when the board stays quiet.

## Three directions considered

- A — "Switchboard": borrows the telephone switchboard, where lines are patched to stations and a lamp lights when a call will come through. Leads with an events x channels matrix of raised lamp keys. Light true-neutral ground, condensed-grotesk plates, raised keys on hairline panels, dense.
- B — "After hours": the whole page in a dark night palette with a 24-hour dial as the hero. Quiet hours lead, channel cards with real elevation, humanist sans. This was the direction outside my habits: dark and dial-led.
- C — "Routing slip": a printed office routing slip: one serif-headed form per channel with tick boxes and initials, warm paper ground, slab labels, flat. Leads with the per-channel slips.

Chosen: A. The page's main job is routing (which event reaches which channel), and the switchboard is literally a routing board. B makes quiet hours the hero when they are one part of the job. C splits the same events across three slips, so you can't compare channels side by side.

## Signature

The lamp-key matrix: one raised 40px key (44px below 640px) per event and channel. It lights amber when that event will reach that channel. The same key unit builds the 24-hour quiet-hours ribbon (one key per hour, night slate when the board is quiet, the current hour outlined) and the channel lamps in the column heads and test results. When a test is sent, the lit keys of each channel that got it flash once.

## Plan challenges (what changed)

- Per-channel toggle-switch lists (every settings page has them) were replaced by the matrix.
- A plain From/To pair with a time-zone dropdown became From/Until/Time zone plus the hour ribbon and a sentence that says what will happen right now.
- I had a blue accent in mind first. I dropped it for the lamp amber, which means "will ring through". Blue was too close to the house look and carried no meaning here.
- After the first render: the sticky save bar covered the test panel heading at 1280, so it was made static at the end of the form. At 320 the matrix squeezed event descriptions into a 120px column, so below 560px each event's text spans the row with its three keys underneath. At 768 the ribbon cells were oversized, so the two 12-hour rows sit side by side between 640 and 1199px. The 12-hour/24-hour mismatch between the native time fields and the summary was fixed: all times now follow the viewer's locale.
- Accessory removed: the amber halo around lit keys.

## How to reach each state

- Disconnected Slack: the default. Slack keys are dashed and disabled but keep their saved state (Mentions is set). "Connect Slack" shows "Connecting Slack" with a spinner for about 1.2s, then the Slack keys turn on and the strip links to Integrations.
- Inline validation: set "Until" to the same time as "From" (for example 10:00 PM). The error appears on change or blur, with aria-invalid and aria-describedby on both fields. It clears as soon as the times differ. Pressing Save with the error moves focus to "Until" and says "Not saved".
- Save failure: change anything, then press "Save changes". The mock API makes the first save in a session time out, which shows "Couldn't save. Plotboard didn't respond in time…", and the button becomes "Try saving again". Any save while the browser is offline also fails, with an offline message.
- Save success: press "Try saving again" (or save a second time). The status reads "Saved at <time>". Discard hides and Save goes back to disabled.
- Test notification: results are listed per channel, with "skipped" reasons for Slack while it isn't connected. If no channel has a lit key, the result reads "Nothing to send…".
- Quiet hours off: use the switch. The fields disable and the summary says notifications ring at any hour.

## Assumptions and invented content

- The app name "Plotboard", workspace "Fernhill Studio", user "Dana Okafor", the address dana.okafor@fernhill.studio, the devices (Pixel 8, MacBook Air), the Slack handle @dana, and the Monday 09:00 digest time are all invented.
- Default preferences are invented. Quiet hours default to 22:00–07:00, Europe/Lisbon.
- Product rules I assumed: during quiet hours push and Slack hold notifications while email still arrives, and tests ignore quiet hours.
- The backend is mocked in JS (`api.save`, `api.connectSlack`, `api.sendTest`). The first save in a session failing is deliberate, so the failure path can be reached without going offline.
- The ribbon marks whole hours, judged at the half hour, so a 06:30 end shows the 6 AM hour as ringing.
- Fonts (Barlow Condensed, Public Sans) load from Google Fonts. Offline, the page falls back to Arial Narrow and the system sans.

## Tool results

- lint (`--design DESIGN.md`): floor 0 · reflex 0 · finish 0.
- render-check (320/768/1280/1920): floor 0 · reflex 0 · finish 0.
- tokens-check: floor 0 · reflex 1 (R08, 11 color tokens).

## Reflex findings kept

- R08 (tokens-check only, 11 color tokens): kept. There are 8 core roles plus three state colors (night for quiet hours, danger, success) that the brief's quiet-hours and save states need. The reason is also written in DESIGN.md.
