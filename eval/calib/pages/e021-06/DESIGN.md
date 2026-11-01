# DESIGN.md

## Subject

- Subject: Buckslip, a small team-workflow tool where every piece of work travels on a routing slip: one person holds it, the next name waits, and everyone who passed it is crossed off with their initials and a note.
- Audience: leads and members of teams of 3 to 20 who lose track of who has a task when it changes hands.
- Job of the main surface: get a visitor to put their work email on the route (sign up).
- Surface type: marketing

## Direction

"Interoffice envelope". The page borrows the kraft inter-office envelope and its printed routing grid: names in a ruled column, earlier names struck through, the current holder circled in ballpoint, punched holes down the edge. The signature is the live routing slip in the hero: a ruled grid where previous holders are crossed out, the current holder is circled in pen blue, and "Pass it to …" moves the slip one row down. The ruled routing row is the unit; the "How a slip moves" steps and the "Your desk" legend are built from the same ruled row, the app figure (hero.png) shows the same routes of struck and circled names, and the sign-up field is a ruled blank line on a label panel.

## Tokens

```tokens
color.bg: #C9A878
color.surface: #F5EFE2
color.text: #21180E
color.muted: #3F3020
color.accent: #172E9C
color.on-accent: #F5EFE2
color.border: #21180E
color.danger: #A1271B
font.display: "Barlow Condensed", "Arial Narrow", sans-serif
font.body: "Public Sans", system-ui, sans-serif
font.utility: "Caveat", "Segoe Print", cursive
type.base: 17px
type.ratio: 1.333
space.base: 8px
radius.default: 6px
pairs: text/bg, muted/bg, text/surface, on-accent/accent, accent/bg, accent/surface, danger/surface
```

Colors and their source: kraft `#C9A878` is the envelope stock (page ground); label `#F5EFE2` is the gummed address label (form and figure surface); ink `#21180E` is the envelope's printed grid (text, rules, holes); faded ink `#3F3020` is a worn print run (secondary text); pen `#172E9C` is the ballpoint that circles the current holder (accent, primary action); stamp `#A1271B` is the RETURN-TO-SENDER stamp (errors only).

Accent candidates: pen blue (the ballpoint people initial with), stamp red (the received stamp), highlighter yellow-green (marker on a slip). Chosen: pen blue, because initialing and passing is the action the product sells; red would read as an error, and highlighter fails contrast on kraft.

Display candidates: Barlow Condensed (the condensed caps printed on envelopes), Courier Prime (typewritten names), Roboto Slab (form headings). Chosen: Barlow Condensed, because the envelope's own lettering is condensed sans caps. Body: Public Sans (a plain forms sans). Utility: Caveat for handwritten names and initials only.

## Patterns

- Buttons: rectangular, 6px radius, 2px ink border. Primary is pen blue fill with label-colored text; secondary is transparent with ink border. Press scales to 0.97. Focus: 3px pen-blue outline with 3px offset.
- Inputs and forms: the field sits on a label-colored panel as a ruled blank line (3px ink bottom border plus a 1px ink box). Error text in stamp red under the field, tied by aria-describedby.
- Cards / panels: no cards. Panels are ruled grids printed straight on kraft; only the label panel and the app figure sit on the label surface, the figure with one real paper shadow.
- Tables: the routing grid. Columns To / Note / Date / Initials, 2px ink rules between rows, struck names use a pen line drawn over the text.
- Navigation: one line, wordmark plus three in-page links. Not sticky.
- Motion: one moment. Passing the slip draws the strike line (transform scaleX, 280ms, ease-out) and fades the pen circle in; under reduced motion only the opacity change runs.

## Page overrides

## Looks used

- index.html (landing): mid-tone kraft ground (hue ~38°), pen-blue accent (hue ~230°), condensed grotesk display + plain sans body + handwriting accent, flat printed rules with one paper-shadow figure.

## Learnings

- 2026-10-31: Rejected "Shift whiteboard" (magnetic name tiles, light cool, rounded) and "Dispatch console" (dark split-flap status board, mono). The routing slip won because the product's rule, one holder at a time passed on with initials, is literally what the paper slip did.
