# Surface: product UI (dashboards, admin, settings, tools)

- **Quiet, not default.** Keep the work area calm and dense, but build its surface from the subject's own working object (the ledger sheet, the patch panel, the timetable board, the order slip): one ground whose rules, bands, or plates divide the regions, not white cards on a grey page; elevation only for what floats (menus, dialogs, a dragged item). The subject's object shapes the ground, the headings, the summaries, and the data, not the inputs: a state the user sets (on, approved, booked) keeps the control people already read (a checkbox, a switch, a radio) at its usual size and place, themed with the system's tokens and a status color sourced from the subject for the set state, never replaced by an invented marker, a heavy tile per cell, or a metaphor in the label ("place a magnet"); a grid of such controls stays light enough to scan by row and column. The action color stays on what is pressed (`direction.md` §3). Color stays reserved for status, selection, and data.
- **Density is a feature.** Default to compact rows (32–40px), tabular numerals, right-aligned numbers, left-aligned text. Offer a comfortable density only if users need it.
- **Alignment over decoration.** Shared column edges across panels; labels and values on a consistent baseline.
- **Navigation**: persistent and predictable (sidebar or top bar), current location always visible, breadcrumbs for depth > 2.
- **Tables**: sticky header, sortable columns marked, row hover, empty/loading/error states, truncation with the full value on focus or expand (not hover alone), bulk actions appear on selection.
- **Forms**: labels above fields, helper text below, inline validation on blur, errors that explain the fix, primary action at the end of the flow, destructive actions confirmed and visually distinct.
- **Charts**: start from the question the chart answers; label directly instead of legends where possible; one highlight color against neutrals; no 3D, no gratuitous gradients.
- **Feedback**: every action acknowledges within 100ms (state change, spinner, toast). Toasts use the verb of the action ("Archived").
- **Keyboard**: focus order follows layout; shortcuts for frequent actions; Escape closes overlays.
- No marketing hero on product screens. The page title states where you are and the primary action sits next to it.
