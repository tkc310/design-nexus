# DESIGN.md

The single source of truth for this project's design. Agents read it before any UI work and update it after.

## Subject

- Subject: Slotboard, a planning board for small teams (3 to 30 people): one card per job, one column per person, handoffs written on the card. (Name and product details are assumed; the source page gave none.)
- Audience: leads of small studios, workshops, and offices who outgrew a whiteboard and a group chat but don't want sprint software.
- Job of the main surface: get a lead to start a board (enter a work email).
- Surface type: marketing

## Direction

"T-card rack." Borrowed from the slotted T-card planning boards used in workshops, hospitals, and print shops: a painted steel panel, ivory and yellow cardstock cards cut in a T so only the top strip shows in the slot, names written in marker. The page ground is the slate panel; content sits on cardstock. Signature: a working rack in the hero where one card is pulled out of its slot to show its handoff note, and the visitor can open any other card.

## Tokens

```tokens
color.bg: #46525E
color.rail: #2C343D
color.surface: #F3EEE2
color.text: #E8ECEF
color.ink: #1E2329
color.accent: #F2C230
color.on-accent: #1E2329
color.danger: #A3261B
font.display: "Barlow Condensed", sans-serif
font.body: "Public Sans", sans-serif
font.utility: "Kalam", cursive
type.base: 17px
type.ratio: 1.25
space.base: 8px
radius.default: 2px
pairs: text/bg, text/rail, ink/surface, on-accent/accent, accent/bg, accent/rail, danger/surface
```

Sources: `bg` painted steel of the board panel; `rail` the shadowed slot channel; `surface` ivory T-card stock; `ink` marker on cardstock; `text` chalk-white board lettering; `accent` yellow T-card stock (primary action, the pulled card, focus on the panel); `danger` red marker, used only for form errors.

## Patterns

- Buttons: primary = yellow cardstock with ink text, 2px radius, 48px tall; secondary = chalk 2px border on the panel. Press = scale(0.97). Labels never wrap.
- Inputs and forms: label above, 48px field on cardstock with 2px ink border; error text in `danger` tied by `aria-describedby`.
- Cards / panels: only T-cards. Top strip full width, body inset 8px each side (the T). Short shadow, as card on steel. Below 560px the rack stacks people as rows, cards sit two-up, and the pulled card takes the full row.
- Tables: none.
- Navigation: wordmark + 3 anchor links; links wrap below the wordmark at 320.
- Motion: one moment: the pulled card's body fades and drops 6px (180ms ease-out). Reduced motion keeps the fade only.
- Focus: 3px yellow outline on the panel, 3px ink outline on cardstock.

## Page overrides

None.

## Looks used

- 2026-10-31 landing (index.html): mid-tone slate ground (#46525E, cool) with yellow accent and ivory cardstock; condensed grotesk display + humanist body + marker hand for card text; cards with real elevation on a textured slot rack.

## Learnings

- 2026-10-31 Rejected "Handoff slip" (light paper, slab serif, carbon-copy work orders): drifts toward R04a/R04d. Rejected "Dispatch console" (dark split-flap board): near-black + single bright accent is R04b.
- 2026-10-31 Removed the "Columns: you · cards: none yet" label under the signup card as the least necessary accessory.
- 2026-10-31 The source's hero.png was missing; it is now a rendered week-view screenshot of the sample board. Replace with a real product screenshot when one exists.
