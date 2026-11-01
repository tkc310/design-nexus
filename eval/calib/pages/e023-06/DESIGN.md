# DESIGN.md

The single source of truth for this project's design. Agents read it before any UI work and update it after.

## Subject

- Subject: Next Desk, a small team-workflow tool that works like an interoffice routing slip: each job lists the desks it passes through, and each person initials it before it moves on.
- Audience: leads of small teams (3 to 30 people: studios, agencies, office teams) who lose track of whose turn it is.
- Job of the main surface: get the visitor to start a slip (sign up with a work email).
- Surface type: marketing

## Direction

"Routing slip". The page is an interoffice envelope: a kraft ground with a printed routing slip on it. The slip's ruled row (No. / To / Dept / Received / Initials) is the unit of the page. Names are typed (Courier Prime), initials are written in ballpoint (Caveat, ballpoint blue), the current holder is circled, and a rubber-stamp red is kept for status only ("On desk", "Filed"). Signature: the live routing slip in the hero; "Pass it on" crosses out the current holder, writes their initials, and circles the next desk.

## Tokens

```tokens
color.bg: #CDB07C
color.surface: #F6F0E1
color.text: #241B12
color.muted: #6E5636
color.accent: #1D3B9A
color.on-accent: #F6F0E1
color.border: #6E5636
color.danger: #A3241A
font.display: "Archivo", sans-serif
font.body: "Atkinson Hyperlegible", sans-serif
font.utility: "Courier Prime", monospace
type.base: 17px
type.ratio: 1.333
space.base: 8px
radius.default: 3px
pairs: text/bg, text/surface, muted/surface, on-accent/accent, accent/bg, accent/surface, danger/surface, border/bg
```

Names in the subject's world: `bg` = kraft (the envelope), `surface` = slip (printed card stock), `text` = ink (typewriter ribbon), `muted`/`border` = ruling (the brown printed lines of the form), `accent` = ballpoint (initials and the one action), `danger` = stamp (rubber-stamp red, status only).

## Patterns

- Buttons: the one primary action is ballpoint fill with slip text; hover turns it ink. Secondary actions are ink outline on slip, or an underlined text button on kraft. 3px radius. Press: scale(0.97).
- Inputs and forms: slip fill, 2px ink border (passes 3:1 on kraft), label above in display caps, error below tied by aria-describedby, in stamp red on slip.
- Cards / panels: only the slip itself is a card: slip surface, 3px radius, a real two-layer shadow because it is a physical card lying on the envelope.
- Tables: every list is built on the slip row grid (No. / To / Dept / Received / Initials) with 1px ruling lines. Below 560px rows reflow into a two-line block, nothing is hidden.
- Navigation: wordmark plus two anchor links. No nav button.
- Motion: one orchestrated moment: the cross-out stroke (scaleX, 240ms ease-out) and the initials fading in. Reduced motion keeps the fade, drops the stroke movement.

## Page overrides

None.

## Looks used

- index.html (landing): mid-tone, kraft yellow-brown ground (hue ~40) with ballpoint blue accent (hue ~225) and stamp red for status; condensed grotesk display + humanist sans body + typewriter utility + hand accent for initials; one elevated card on a flat ground.

## Learnings

- 2026-11-01: Rejected the "ticket rail" direction (kitchen pass) because the routing slip names people, which is what a small team actually asks ("who has it?"); a rail names stations.
- 2026-11-01: Rejected a red "stamp" accent for the primary action; red is kept for status so "On desk" and "Filed" stay meaningful.
- 2026-11-01: Rejected the source's purple gradient, glass cards, gradient text, and floating blob; none belonged to the subject.
- 2026-11-01: Removed the footer tagline as the one accessory; it repeated the page title. The "How a slip moves" ledger stacks below 960px because four columns squeezed the main text at 768.
