# NOTES: Notifications settings

Budget: standard. Surface: product. Mode: build (plus a DESIGN.md for the project).

## Grounding
- Subject: the Notifications screen of Ridgeline, a project-management web app.
- Audience: project team members who get too many pings or miss the important one; they know the app and want control fast.
- Job: route each update to the right channels, then **save**. Primary action: "Save changes" (the only filled control, top right next to the title at every width).

## Three directions considered
- A — "Routing pegboard": a switchboard where events are rows and channels are columns, and every crossing is a square peg that's either filled or empty. A light, true-neutral ground, white cards with soft elevation, a wide grotesk display face, dense and precise.
- B — "Night dial": a dark mid-tone screen led by a 24-hour clock dial for quiet hours, with channel toggles around it. A condensed display face, a canvas or diagram as the lead. This was the one I would not pick by habit: I argued it from "do not disturb" being about the night.
- C — "Channel letters": one card per channel, each showing a live preview of how a mention looks there (an email subject line, a push banner, a Slack DM). A light warm ground, a humanist sans, photographic or illustrated previews.

**Chosen: A.** The real question on this screen is "which event, which channel". A matrix answers that at a glance, and a peg works well with keyboard, touch and screen readers. B pushes the matrix below the fold and gets hard to read at 320px. C spreads one event across three cards, so you can't compare channels.

## Signature
The **peg matrix**. It's a real `<table>` of 36px square peg cells: graphite fill means on, an empty white cell means off, a dashed cell means unavailable. The same peg unit builds:
- the quiet-hours **day strip**: 24 hour cells running noon to noon, so the night stays one block, with partial hours filled in proportion;
- the **test-notification delivery row**: one peg per channel, showing ready, sending, sent, failed and skipped.
Below 640px each matrix row turns into a block of three captioned pegs (Email / Push / Slack), and the channel header becomes a stacked list.

Tokens: see DESIGN.md. Accent candidates were magenta from the @mention chip, cobalt from patch-cable routing, and graphite from the near-neutral app chrome. I chose magenta and kept it for Save and focus only: cobalt is too close to the house look, and graphite already marks "on" pegs. Display face candidates were Archivo (wide grotesk, like engraved panel labels), Newsreader (a serif with a digest feel) and Oswald (condensed). I chose Archivo at 112–125% width. The body face is Instrument Sans.

## States and how to reach them
- Unsaved changes: toggle any peg. The status reads "N unsaved changes" with a magenta dot, and "Discard changes" appears.
- Validation: set Until equal to From. On change or blur the field shows "Quiet hours can't start and end at the same time…" (`aria-invalid` + `aria-describedby`). Save is blocked and focus moves to the field.
- Save success: press Save. It reads "Saving…" and then "Changes saved at <time>" with a check.
- Save failure: go offline (DevTools > Network > Offline), then Save. A red alert under the page head reads "Changes not saved: you seem to be offline. Nothing was lost…" with "Try again". The mock API rejects whenever `navigator.onLine` is false.
- Slack disconnected (default): the Slack column shows "Not connected" with a "Connect Slack" button, and its pegs are dashed and disabled. Connect turns on "Mentions in Slack", announces it, moves focus there and adds "Disconnect". Connecting while offline shows an error.
- Test notification: "Send test notification" sends to each channel that has at least one update on. The pegs go sending, then sent (green) or failed (red, offline). The button is disabled, with the reason given, when no channel has anything on.
- Quiet hours off: the switch disables the fields, dims the strip, and the summary explains what happens instead.

I checked these flows with a Playwright script: no console errors, every message correct.

## Invented content (not real)
"Ridgeline", "Harbor Lane Studio", "Sam Ortiz", sam@harborlane.co, the "MacBook, iPhone" device list, the Slack workspace name, the default preferences (Central Time, 10:00 PM to 7:00 AM), and the weekly digest timing (Mondays 9:00). The save, test and Slack-connect calls are mocked with fixed latency.

## Assumptions
- Quiet hours hold back push and Slack only. Email still arrives, because it's already asynchronous.
- A test notification ignores quiet hours.
- Connecting Slack is immediate (OAuth) and isn't part of the Save payload. The event choices for Slack are.
- No dark scheme: the brief didn't ask for one.

## Critique rounds (2)
1. Discard showed at load (`[hidden]` was overridden by the button's display), the Slack header overflowed at 320px, the time inputs clipped "10:00 PM", and the hour-marker borders on the strip looked like glitches. All fixed: the time zone got its own row, the channel header stacks at narrow widths, and the scale labels are positioned absolutely.
2. The sticky bottom save bar sat over the matrix in captures and at 320px, so Save moved to the page head. The email wrapped mid-word at 768px, so I added `<wbr>` after the @. The channel header names didn't line up, so they're now top-aligned.
- Removed one accessory: the ring icon before "Not connected".

## Tool results
- lint (`--design DESIGN.md`): floor 0 · reflex 0 · finish 0.
- render-check (320/768/1280/1920): floor 0 · reflex 0 · finish 0.
- tokens-check: floor 0 · reflex 0 · finish 0.

## Reflex findings kept
None.
