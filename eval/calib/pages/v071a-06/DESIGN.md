# DESIGN.md

## Subject

- Subject: Traveler, a workflow tool for small teams where each piece of work carries a ticket that records every handoff.
- Audience: leads and members of 3 to 30 person teams (studios, shops, small ops teams) who lose track of who has what.
- Job of the main surface: get a team lead to start a board (enter a work email).
- Surface type: marketing

## Direction

"Traveler ticket": borrowed from the job traveler card that rides with work through a shop and the steel rail tickets hang from. Buff card-stock tickets with carbon ink hang on a mid-dark steel ground; signed handoffs are red rubber stamps, stuck work gets a yellow hold tag. Signature: the hanging ticket No. 0418 in the hero, whose route rows can be signed live. The route row (station, who, note, stamp) is the unit reused by the "handoff, start to finish" table, the rail key, the back-of-ticket panel, and the sign-up stub.

## Tokens

```tokens
color.bg: #343B43
color.surface: #F1E6C8
color.surface-2: #3F474F
color.ink: #1E1F1D
color.muted: #AEB5BC
color.graphite: #5A5A55
color.accent: #B3261E
color.border: #59616A
color.rule: #D9CCA8
color.hold: #F2C12E
font.display: "Barlow Condensed", sans-serif
font.body: "IBM Plex Sans", sans-serif
font.utility: "IBM Plex Mono", monospace
type.base: 17px
type.ratio: 1.333
space.base: 8px
radius.default: 4px
pairs: surface/bg, muted/bg, surface/surface-2, muted/surface-2, ink/surface, graphite/surface, accent/surface, surface/accent, hold/bg, ink/hold
```

Buff (`color.surface`) is also the text color on steel and the label color on stamp-red buttons; carbon (`color.ink`) is the text on buff. Code names: `--steel`, `--buff`, `--steel-2`, `--carbon`, `--mist`, `--graphite`, `--stamp`, `--steel-edge`, `--buff-rule`, `--hold`.

## Patterns

- Buttons: 48px min height, 4px radius, nowrap. Primary = stamp red fill with buff text (the act of committing). Secondary on steel = 2px buff outline; on buff = 2px carbon outline. Press scales to 0.97.
- Inputs and forms: 52px, 2px carbon border on buff, label above, hint below label tied by aria-describedby. Error = 3px border plus yellow inset bar, message prefixed with a yellow "Not sent" hold tag; success prefixed with a red "Started" stamp.
- Cards / panels: only tickets. Buff stock, 2px corners, real drop shadow (they hang off the rail), punched hole at top center.
- Tables: route rows separated by rules; the "how" table stacks into number + title + two lines below 1100px.
- Navigation: wordmark plus up to three anchors; only "Start a board" stays below 700px.
- Motion: a single stamp press (220ms ease-out, scale 1.35 to 1). Reduced motion: opacity fade only.
- Focus: 3px hold-yellow outline on steel, 3px carbon outline on buff (`.on-buff`).

## Page overrides

None.

## Looks used

- index.html: mid-dark cool steel ground (#343B43), buff card-stock surfaces, stamp-red accent with yellow status, condensed grotesk display + humanist sans body, physical tickets with real shadows.

## Learnings

- 2026-10-31: Rejected "Standup wall" (whiteboard columns, marker accent) as too close to every kanban tool's marketing page, and "Night shift log" (dark mono stream) as R04b-adjacent and too developer-coded for non-technical small teams.
- 2026-10-31: Red is reserved for stamps (signed / committed); errors use the yellow hold tag so red never means "danger" on this page.
- 2026-10-31: The rail screenshot is illegible below 560px when scaled; it scrolls sideways at a fixed 760px instead.
