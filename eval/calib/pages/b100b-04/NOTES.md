# NOTES: Notifications settings (Trestle)

Budget: standard. Surface: product. Mode: build (+ system: DESIGN.md written here).

## Ground
- Subject: the Notifications page in account settings of "Trestle", a project-management web app (name invented).
- Audience: people on project teams who get too many pings and want to choose what reaches them.
- Job: route each event to the right channels, then **save**. Primary action: "Save changes".

## Three directions considered
- A — "Switchboard": borrows the telephone patch panel. Events are rows, channels are columns, and each route is a jack that lights up. A light true-neutral ground, a condensed grotesk for the designation labels, white panels with hairlines.
- B — "Night dial": a dark, mid-tone page led by a 24-hour clock face for quiet hours, with per-channel lists below it. Humanist sans, soft elevated cards. Rejected: a dial is hard to operate by keyboard and at 320px, and it puts the secondary setting in charge of the page.
- C — "Lanes": borrows the app's own kanban board. Each channel is a lane of event cards you drag in or out. Rounded type, cards with real elevation. Rejected: dragging is slow for a 4×3 decision, and cards are not comparable items here.

**Chosen: A, Switchboard.** The decision is a matrix (4 events × 3 channels), and a patch panel shows every route at once.

## Signature
The **switchboard grid**. Its unit is the jack: a 44px square cell with a 6px radius. Unlit, it shows its socket; lit, it fills with patch-cord magenta and shows a check. When Slack is not connected, its jacks are hatched and dashed.
The other sections reuse the jack:
- the quiet-hours strip is 24 jack-shaped hour cells, split into half hours, and quiet hours are filled with ink;
- the Slack callout leads with a hatched jack sample, which turns ink when Slack connects.

Accent candidates were patch-cord magenta #B0175F, due-flag amber #B86E00 and board graphite #2E2E33. I chose magenta because it means only "this route is live". Amber already reads as a due or warning status in a PM app, and graphite can't separate a lit jack from ink text at a glance.
Display face candidates were Archivo condensed (grotesk), a serif, and a mono. I chose Archivo at 75% width because it is the lettering of designation strips on a patch panel. Body text is Public Sans, and times use its tabular figures. I used no mono labels, to stay away from the agent house look.

## States and how to reach them (all in the real components)
- Slack disconnected: this is the default render. Press "Connect Slack" and it connects after about 1.2s (a simulated OAuth flow). The Slack jacks then turn on and focus moves to the first one. If you are offline, the connect fails with a message that explains why.
- Inline validation: set End equal to Start and leave the field (blur or change). The field gets `aria-invalid`, and an error tied by `aria-describedby` says how to fix it. The strip empties and its caption explains why. If you press Save while the error stands, the status reads "Fix quiet hours to save" and focus moves to End.
- Save success: press "Save changes". The button reads "Saving…", then the status shows "Saved at HH:MM" and a toast says "Saved. Your notification settings are live."
- Save failure: open the page with `?fail=save` (the mock server rejects the save), or go offline in devtools. A danger banner explains what happened, says the edits are kept, and offers "Try saving again". The status reads "Not saved".
- Send test notification: the test goes to every connected channel that has at least one lit jack. A live region confirms the channels and the time. With no lit jack, it explains what to do instead. Offline, it fails with a reason.
- Quiet hours off: the "Hold overnight" switch disables the fields and dims the strip, and the caption says notifications arrive around the clock.

## Invented content
These were invented because no real material was given:
- the app name Trestle;
- the user's email dana.okafor@northwind.dev and devices (Pixel 8, Trestle for Mac);
- the Slack workspace "Northwind" and handle "@dana";
- the event descriptions, the digest time (Monday 08:00), and the default routes;
- the default quiet hours, 22:00–07:00 Berlin.

The API is a mock in the page script.

## Assumptions
- Tests ignore quiet hours. Connecting Slack takes effect at once, apart from Save, as OAuth would.
- Times use a 30-minute step. The timezone list is a short, representative list.

## Tool results
- lint: floor 0 · reflex 0 · finish 0 (with `--design DESIGN.md`)
- render-check: floor 0 · reflex 0 · finish 0 at 320/768/1280/1920
- tokens-check: floor 0 · reflex 0 · finish 0

## Critique fixes made
1. At 320 the strip's 24:00 tick overlapped 18:00, so I dropped the 24:00 tick.
2. At 320 the time inputs overflowed their half columns. Below 400px the Start and End fields now stack.
3. At 320 the settings nav took about 300px above the title. It is now one swipeable row; group labels stay available to screen readers, and I also fixed an F08 overflow it caused.
4. The status line was overwritten after a failed save. It now keeps "Not saved" until the next edit.

Accessory removed: the small connection swatches above the channel column heads. They duplicated the Slack callout and the hatched jacks.

## Reflex findings kept
None.
