# NOTES — 03-dash-clinic

Budget: standard. Surface: product. Mode: build (DESIGN.md written here because step 9 records tokens and looks).

## Ground

- Subject: payroll SaaS for small clinics (15–40 staff), the 「今月の給与」 screen.
- Audience: the clinic's office manager (事務長) or director, who runs payroll between other duties and fears a wrong payment or a missed transfer deadline.
- Job: confirm this month's payroll (approve pending attendance first, then 確定).

## Three directions

- A 「明細の欄」(payslip fields): borrows the 給与明細書's tinted column groups (支給 / 控除 / boxed 差引支給額); the payroll totals and the staff ledger lead. Light neutral ground, UD gothic + Plex figures, flat tinted bands.
- B 「呼出番号板」(reception number board): borrows the clinic waiting room's LED call-number display; days left and pending count as large lit counters on a dark ground, condensed display face, dense split layout. (The non-habitual one: dark.)
- C 「診療カレンダー」(clinic calendar): borrows the monthly calendar posted at reception with closed days circled; a month grid with the closing date circled leads, rounded gothic, cards with real elevation, airy.

**Chosen: A.** The manager checks money against payslips and bank forms every month; mapping the screen to the payslip's own fields makes each column self-explanatory and the totals checkable at a glance. B was striking but sits apart from the paper the manager compares against; C over-weights the date when the money is what gets checked.

## Signature

The 明細帯 (payslip band): 支給合計 − 控除合計 = 差引支給額 with 前月比, set in the form's tinted fields at the top. Unit: the field (tinted tab label over a figure). Reused by the staff table's column-group header (支給 green tint, 控除 gray, 差引 ink), by each staff card at phone width (the net pay as an ink field, the others as tinted fields), and by the confirmation dialog's summary.

## Token plan (as shipped)

Colors: sheet #FFFFFF, desk/控除 #EDEFEC, ink #1B2420, muted #535E58, form-green accent #2C6A4C (+ tint #E2EEE6), control border #848F89, hairline #D3D8D4, warn #8A5300 / #FBEFD5, danger #B3261E. Accent candidates: form-ruling green, 朱肉 vermilion, transfer-slip navy → green (vermilion reads as error beside money; navy is generic). Type: BIZ UDPMincho 700 (h1 and dialog title), BIZ UDPGothic body, IBM Plex Sans for figures (tabular), Google Fonts. Scale 13*/14/16/20/25/31 (*13 is the token name only; tags render at 14px after R20). Spacing 4px base. Radius 6px panels / 4px controls; shadows only on the dialog and toast.

Challenge changes: dropped mono micro-labels and serif body (house look R04d); dropped a full-hairline broadsheet table in favor of tinted column bands; moved the approval queue into the page beside the table instead of a modal so approval is one step.

## States and how to reach them

- Default: 11月分, 7 pending requests (rows tagged 「未承認 n件」 with overtime marked 見込み), one staff (中村 拓也) whose timecard import failed with 「打刻データを再取得する」, two rows with a ±10%+ month-on-month change flagged. 「給与を確定する」 is aria-disabled and says what blocks it; clicking it jumps to the first blocker.
- Approve: 「勤怠を承認する(7件)」 in the queue (select/deselect per item) → toast 「7件の勤怠を承認しました」, queue empty state.
- Retry import: the row button → totals update to 18名.
- Confirm: once nothing blocks, 「給与を確定する」 becomes primary → dialog with the band summary → 「11月分の給与を確定する」 → toast 「11月分の給与を確定しました」. A failed save (offline) shows an inline error in the dialog.
- Loading: change 表示する月 (skeleton table and band, ~600ms).
- Empty (0件): choose 「2026年12月分」 (no data yet, invites staff registration). Filter with no match (e.g. 「歯科」) → empty row with 「絞り込みを解除する」.
- Error: go offline (DevTools) and change the month → 「給与データを読み込めませんでした」 with 「もう一度読み込む」; coming back online reloads automatically.
- Confirmed month: 「2026年10月分(確定済み)」 is read-only.

## Assumptions and invented content

- No answers available; assumed 末締め翌月25日払い: 10月勤務分 = 11月分給与, 給与確定の締め日 11月20日, 支給日 11月25日. 「締め日」 = the payroll confirmation deadline.
- The page clock is pinned to 2026-11-16 so the default shows a typical working state (4 days left).
- Invented: clinic name 「みどり台内科クリニック」, product name 「給与帳」, all 18 staff names, roles, amounts, deductions, month-on-month figures, and the 7 attendance requests. Deductions are a single total (社会保険料・所得税・住民税 not broken down).
- 却下・差し戻し are pointed to the 勤怠 screen rather than built here. No dark scheme.

## Checks

- Lint: floor 0 · reflex 0 · finish 0. Render: floor 0 · reflex 0 · finish 0 (320/768/1280/1920).
- tokens-check: R08 (12 color tokens) kept: 8 roles plus 3 status colors and on-accent; the code uses exactly these 12 hexes.
- Reflex findings kept in code: none.
- Fix rounds: 768 table overflow (padding, name tag stacking), tap height on inline links, Japanese line-height in the queue, 13px tags → 14px, card cell specificity at 320 (net-pay field was white on white), `[hidden]` overridden by grid display in error state, confirmed-month status.
- Accessory removed: the 「社会保険料・所得税・住民税」 caption under 控除合計.
