# Craft rules

Use these while building. They are defaults; the brief and DESIGN.md override them.

## Hierarchy
- One primary action per view. Secondary actions look secondary.
- Size, weight, and space carry hierarchy before color does. If you need color to show what's important, the hierarchy is weak.
- The hero is a thesis: open with the most characteristic thing in the subject's world (a real product screen, the actual data, the object itself), not "big headline + two buttons + gradient blob" by reflex.

## Typography
- Pair faces deliberately: a characterful display face used sparingly, a highly readable body face, optionally a utility face for figures and labels.
- Use a modular scale (1.2–1.333). No more than 5–6 distinct sizes on a page.
- Body 16–18px; measure 60–75 characters (Japanese: 30–40 characters, see `japanese.md`).
- Headings get tighter line-height (1.1–1.25) and `text-wrap: balance`; body gets 1.5–1.7 and `text-wrap: pretty`.
- Numbers in tables and stats use `font-variant-numeric: tabular-nums`.
- Never fake bold or italic; load the weights you use. Use `font-display: swap`.

## Color
- Build from roles (ink, surface, accent, status), not from a brand-color-everywhere approach.
- Neutrals carry 80–90% of the surface. Accent is rare enough to mean something.
- Tint neutrals slightly toward the accent hue rather than using pure gray.
- Status colors (success, warning, danger) are reserved for status.
- Dark mode is its own palette: raise surface lightness for elevation, desaturate accents, never pure #000 with pure #FFF body text for long reading.

## Layout and spacing
- A spacing scale from one base (4 or 8px). Every gap is a step on it.
- Group by proximity: space inside a group is smaller than space between groups.
- Align to a grid; let one element break it on purpose (the signature).
- Vary section structure. A page where every section is "heading + 3 cards" is a template.
- Cards only when content is genuinely a collection of comparable items.

## Components and states
- Every interactive element has: default, hover, focus-visible, active, disabled. Inputs also: error, with message tied by `aria-describedby`.
- Every data view has: loading (skeleton matching final layout), empty (explains and invites), error (what happened + how to fix), and overflow (long names, many items).
- Buttons say what they do ("Save changes", not "Submit").

## Imagery and icons
- Prefer real artifacts of the subject over stock. If using photos, credit them and size them (`width`/`height`) to avoid layout shift.
- One icon set, one stroke width. Icons support labels; they rarely replace them.
- No emoji as UI icons.

## Code quality
- Tokens as CSS custom properties (or the project's theme file). No stray hex values.
- Avoid `transition: all`; list properties. Animate `transform` and `opacity`.
- Watch specificity collisions (e.g. `.section` padding vs `.cta` padding) — check the rendered result, not the stylesheet.
- Semantic HTML first: `header`, `nav`, `main`, `section` with headings, `button` for actions, `a` for navigation.
