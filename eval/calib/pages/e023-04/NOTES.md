# NOTES: Notifications settings

Budget: standard. Surface: product. Mode: build (a DESIGN.md was written here because the skill's record step calls for one).

## Ground

- Subject: the "Notifications" page in the account settings of a project-management app (named Mapleboard here).
- Audience: team members who either get too many pings or miss the one that mattered, and who don't want push or Slack at night.
- Job: **save** where each event reaches you. Primary action: "Save changes", in a sticky save bar. It is disabled with "No unsaved changes" beside it until something changes.

## Three directions considered

- A, "Switchboard": a routing grid borrowed from a patch panel. Events are rows, channels are columns, and each crossing is a cell that lights up. Light true-neutral ground, grotesk display with a humanist sans body, flat hairline panels, dense and precise.
- B, "Day ruler": borrowed from on-call rotas and shift schedules. A 24-hour ruler leads the page, with each channel as a lane across the day that shows when it can reach you. Mid-tone slate ground, condensed display face, timeline structure.
- C, "Night inbox": the outside-habit option. A dark indigo ground taken from quiet-hours night, where each event shows a rendered preview of the real email, push or Slack message, on elevated cards with rounded type. Playful.

**Chosen: A**, with B's 24-hour ruler rebuilt from A's cell. The page answers one question: "does event X reach me on channel Y?" A grid answers it at a glance. The previews in C would add noise to a screen people open to calm things down.

## Token plan (as shipped)

- ground #F4F4F4 (the app's neutral chrome), surface #FFFFFF, ink #1D1E22, muted #565B64, rule #858A93 (field and cell edges, 3:1 or more on both grounds), hairline #E2E2E4 (dividers).
- Accent candidates: a ping magenta #B0216A (the unread dot), a night indigo #2E2B6B (quiet hours), a near-neutral graphite (task-card ink). **Chosen: ping magenta**, because a lit cell means "this reaches you", which is exactly what the unread dot means in the app. Indigo got its own job (held hours) rather than being dropped. Graphite was too quiet to mark state.
- Status colors: danger #B3261E and success #1C6B43. Tints are made with `color-mix` from the tokens.
- Display face candidates: Schibsted Grotesk (grotesk, like board column headers), Barlow Condensed (sticky-note poster lettering, too loud for settings), IBM Plex Mono (task IDs, which drift into the house look). **Chosen: Schibsted Grotesk** 600/700. The body face is Source Sans 3 (400/600). Both load from Google Fonts.
- Sizes: 14 (ruler ticks), 15 (hints), 16 (body), 20 (h2), 31 (h1). The spacing base is 4px. Radius is 6px on fields, 8px on cells and buttons, and 10px on panels. There are no shadows.

## Signature

**The lit-cell routing grid.** It is built from one unit, a 44px square cell that lights with the ping dot when on. Three other parts of the page reuse that cell:
- the quiet-hours ruler: 24 hour cells, with held hours filled night (partial hours fill partially);
- the "Send test notification" results row, which sits under each channel column as a small cell plus a status line;
- the disconnected Slack column, where the cells are dashed, unlit and disabled.

The quiet-hours range also appears as a "Quiet 10:00 PM–7:00 AM" tag under the Push and Slack column heads.

## How to reach each state

- Unsaved changes: toggle any cell or quiet-hours field. The save bar counts the changes and Save turns on. Ctrl/Cmd+S also saves.
- Validation: set End equal to Start, then leave the field or press Save. An inline error appears under End, the bar says "Fix the quiet-hours end time to save", and Save moves focus to End.
- Save success: Save shows a spinner and "Saving…", then the bar shows "Changes saved at <time>" and Save is disabled again.
- Save failure: go offline (DevTools > Network > Offline), or open `index.html?fail=save`. An alert appears in the save bar and the edits are kept. `?fail=test`, `?fail=slack` and `?fail=all` make the test send and the Slack connection fail the same way.
- Disconnected Slack: this is the default state. "Connect Slack" simulates a 1.2 s OAuth step. Once connected, the Slack cells turn on, focus moves to the first one, and "Disconnect" (with a confirmation) brings the column back to dashed.
- Test notification: the result row shows "Sending…" and then the result per channel. Slack is "Skipped" while it is not connected.
- Quiet hours off: the switch disables the fields, the ruler goes dashed, and the summary says notifications arrive any time.

## Invented content

The following are all invented: the product name Mapleboard, the user Dana Okafor and the address dana.okafor@northwind.studio, the "This browser and Pixel 8" push devices, the "Northwind Studio" Slack workspace, the digest timing (Mondays at 9:00), the reminder timing (one day before), the saved defaults (America/New_York, 22:00–07:00), and the network delays. There is no real backend; requests are simulated in the page script.

## Assumptions

- Quiet hours hold only push and Slack, never email, and test notifications ignore quiet hours. The page says both.
- The time zone list is a short curated set, not the full IANA list.
- There is no dark scheme.

## Critique rounds

1. The first render found F08 at 320px: the settings tab strip widened the grid track. This was fixed with `minmax(0, 1fr)` and `min-width: 0`. It also found R17 at 768px, where the quiet tag overflowed its column head; the tag can now wrap.
2. A screenshot review found three problems, all fixed:
   - The email address broke mid-word at 1280. It now has a `<wbr>` before the @.
   - The test results were cramped into three columns at 320. They now stack as labelled rows.
   - The channel list at 320 pushed the first event row low. It is now more compact.
3. The failure alert covered too much of the 320 screen, so its copy was shortened.

Accessory removed: the save bar's drop shadow. The hairline top border is enough.

## Findings

- Lint: floor 0, reflex 0, finish 0 (also with `--design DESIGN.md`).
- Render: floor 0, reflex 0, finish 0 at 320, 768, 1280 and 1920.
- Tokens: floor 0, reflex 0.
- No Reflex findings were kept.
