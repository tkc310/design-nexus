# DESIGN.md

## Subject

- Subject: Mapleboard, a project-management web app; this surface is the account's notification settings.
- Audience: team members who get either too many pings or miss the one that mattered (a mention, an assignment, a due date), and who don't want their phone buzzing at night.
- Job of the main surface: save where each event reaches you. Primary action: Save changes.
- Surface type: product

## Direction

"Switchboard": a routing grid borrowed from a patch panel. Events are rows, channels are columns, and each crossing is a square cell that lights up with the app's unread dot (ping) when that event reaches that channel. The same cell is the unit for the quiet-hours ruler (24 hour cells, held hours filled with night), for the test-notification results that sit under each channel column, and for the disconnected Slack column (dashed, unlit cells). Signature: the lit-cell routing grid.

## Tokens

```tokens
color.bg: #F4F4F4
color.surface: #FFFFFF
color.text: #1D1E22
color.muted: #565B64
color.border: #858A93
color.hairline: #E2E2E4
color.accent: #B0216A
color.night: #2E2B6B
color.danger: #B3261E
color.success: #1C6B43
font.display: "Schibsted Grotesk", sans-serif
font.body: "Source Sans 3", sans-serif
type.base: 16px
type.ratio: 1.25
space.base: 4px
radius.default: 8px
pairs: text/bg, muted/bg, text/surface, muted/surface, accent/surface, night/surface, danger/surface, success/surface, border/surface, border/bg
```

## Patterns

- Buttons: one filled ping button per view (Save changes, in the sticky save bar); everything else is outlined (1.5px border) or a text button. 44px high, 8px radius, press scale 0.97.
- Inputs and forms: label above, 1.5px border token, 6px radius, 44px high; error text below in danger with an icon, tied by aria-describedby; inline validation on blur and on save.
- Cards / panels: white surface, 1px hairline, 10px radius, no shadow.
- Tables: the routing matrix is a real table; below 640px it reflows into labelled blocks (channels list, then one block per event with a labelled cell for each channel).
- Navigation: settings nav as a left rail at 1024px and up (current item has a ping left edge), a tab strip below that.
- Motion: only state changes (cell light, switch thumb, press); spinners stop under reduced motion.

## Page overrides

## Looks used

- Notifications settings: light, true-neutral gray ground, magenta accent with indigo secondary, grotesk display + humanist sans body, flat hairline panels with 8–10px radius.

## Learnings

- 2026-11-01: rejected a dark "night inbox" direction (preview cards of each message) because it adds elevation and noise to a screen people visit to calm things down. Rejected mono task-ID labels because they drift into the agent house look.
- 2026-11-01: the save bar's shadow was removed as the one accessory; the hairline top border separates it well enough.
