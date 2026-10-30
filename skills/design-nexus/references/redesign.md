# Redesign

1. **Snapshot before touching anything.** If a render is possible: `node scripts/render-check.mjs <page> --snapshot before.json`. Otherwise list by hand every link (href + text), form field (name/type), button, handler, and heading.
2. **Read the existing system.** Extract the current tokens (colors, type, spacing, radius) into a draft `DESIGN.md` if there is none. Decide with the user, or state the assumption: *restyle* (keep layout and content, change the look), *rebuild* (keep content and wiring, change layout too), or *polish* (fix tells and Floor/Reflex findings only).
3. **Keep the stack.** Don't switch frameworks, CSS approach, or component library unless asked.
4. **Proceed as build** from step 2 (directions) for rebuild, step 3 (token plan) for restyle, or step 6 (verify) for polish.
5. **Compare after.** `node scripts/render-check.mjs <page> --compare before.json`. Links (by href) and form fields (by name and type) must all survive; buttons, headings, and handlers may be reworded or moved to better elements but not dropped. Any F11 finding must be restored or explicitly agreed by the user.
6. Report what changed in tokens, what structure moved, and confirm nothing was lost.
