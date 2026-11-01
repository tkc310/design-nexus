# NOTES — 今月の給与 dashboard (03-dash-clinic)

Budget: standard. Mode: build. Surface: product. Trends: not requested, so the trend database was not opened.

## Ground

- Subject: payroll SaaS for small clinics (15–40 staff), the monthly 「今月の給与」 screen.
- Audience: the clinic's office manager (事務長) or director, not a payroll specialist, doing payroll after clinic hours. They worry about paying someone the wrong amount and about missing the cut-off.
- Job: close this month's payroll. Primary action: 「勤怠を承認する」 while requests are pending. 「給与を確定する」 stays in place, disabled, with the reason next to it, and becomes the filled action once nothing blocks it.

Assumptions (nobody was available to answer):
- 給与締め日 = the deadline for confirming payroll (20th, moved to the Friday before if it falls on a weekend). Attendance runs from the 16th to the 15th. 支給日 is the 25th (moved earlier when it lands on a weekend).
- The demo is fixed to 2026-11-16(月), the asOf date the in-page API returns, so the countdown always shows a typical "4 days left" state.
- 差引支給額 = 基本給 + 残業代 − 控除. Allowances are left out because the brief lists only these columns. 控除 is a flat-rate estimate per employment type.
- Overtime from a pending request = base / 160 × 1.25 × hours.

## Three directions considered

- A — 「給与明細」: borrows the ruled box grid of a printed Japanese payslip (勤怠 / 支給 / 控除 / 差引支給額 blocks). A dense table/board on pale paper with mincho headings and hairlines. Rejected: it is the agent house look (R04d), and it leads with the table rather than with what blocks closing.
- B — 「当直明け」: the after-hours office where payroll gets done once the clinic closes. Dark slate ground, mono-led figures, elevated panels, a big countdown. Rejected: the reader checks exact yen amounts for 22 people for a long stretch, and on dark ground the stamp ink and the status yellow both get muddy.
- C — 「押印欄」 (chosen): the row of stamp boxes on a Japanese approval form (稟議書). Each payroll step gets a vermilion 日付印 when it is done. Light neutral clinic-wall ground, UD gothic body (BIZ UDPGothic, the face Japanese public and medical forms use), real soft elevation, and a split layout led by the process rail.

Why C: what the manager needs to know is what still stands between them and 確定. In a Japanese office, "who has approved this" is shown with exactly this artifact, so the remaining empty seal slots are the to-do list.

Accent candidates: 朱肉 vermilion (stamp ink, ≈11°), scrub/処方箋 green (≈150°), ballpoint/タイムカード ink blue (≈225°). Chosen: vermilion, because in this subject it literally means "approved". The action that stamps (承認, 確定) uses the same color. Green would read as a generic "OK", and ink blue is the house-look accent. Because the accent is red-family, errors do not use red. They use the JIS 安全色 yellow/black caution stripe instead.

Display face candidates: Shippori Mincho B1 (the carved serif of an inkan, and the bold numerals of a 日めくり calendar), BIZ UDPGothic Bold (clinic signage), a condensed mono (dot-matrix payslip printouts). Chosen: Shippori Mincho B1 800, used only for stamp lettering and the countdown numeral. It is loaded as a `text=` subset of about 30 glyphs.

## Signature

The 押印欄 rail. The first box is a tear-off-calendar countdown to the 締め日 (「あと 4 日」). It is followed by five stamp boxes: 勤怠集計 → 勤怠承認 → 給与計算 → 給与確定 → 振込.
- A finished step shows a rotated vermilion 日付印 (label / date / name).
- The stuck step has a JIS-yellow header band and shows 「残り 12 件」.
- A future step shows a dashed empty seal slot with its date.
- When the manager approves or confirms, the new stamp presses in (260ms; no movement under reduced motion).

Unit: the two-tier ruled cell (a label band over the content). The same unit builds the totals strip (総支給額 / 控除合計 / 差引支給額 / 前月比), the summary in the confirm dialog, and the staff rows on narrow screens, where each row becomes a mini payslip.

## States and how to reach them

All of these run on the same code path as real data, through the in-page API (`api.get / approve / refetchPunches / confirm`).
- Partial states in the default render: 6 staff are marked 「承認待ち n件」 with a 概算 net amount. One staff member (阿部 さくら) shows 「打刻未取込」 with a 「再取得する」 button, and the totals leave her out, with a note saying so.
- Loading: skeleton in the final layout. It shows on first load (250ms) and whenever you switch month (「← 10月分を表示」 / 「12月分を表示 →」).
- Empty (0 records): 「12月分を表示」 shows that month before attendance is aggregated. The message invites the user back to 11月分.
- Empty filter: type a name that matches no one, e.g. ゾーイ, into 「氏名で絞り込む」. The result offers 「絞り込みを解除する」.
- Error: go offline (DevTools → Network → Offline), then switch month. The panel shows a hazard stripe, explains what happened, and offers 「再読み込みする」. Approve, refetch and confirm also show a toast with the fix if they fail while offline.
- Full flow: 勤怠を承認する → dialog with 12 checkable requests and their pay effect → 「選択した12件を承認する」 → toast 「12件の勤怠を承認しました」 and the 承認 stamp. The filled action then moves to 「打刻データを再取得する」 → 計算 stamp → 「給与を確定する」 becomes filled → confirm dialog → 確定 stamp, 「11月分の給与を確定しました」.
- 10月分: every step is stamped (支給済み, paid on 10/23(金) because the 25th was a Sunday).

## Invented content

Everything is invented, written so it would be safe to ship as example data:
- Clinic name: さくら通り内科クリニック.
- The user 森 由美子 (事務長) and 22 staff names. All are common Japanese names; none refers to a real person.
- Every salary, overtime and deduction figure, and the deduction rates (常勤 20.5%, パート 10.5%, 非常勤医師 10.21%).
- The 12 attendance requests.
- The time-card failure message.
- The 締め日 and 支給日 rules.
- The navigation destinations (/attendance, /payslips, …), which are not built.

## Tool results

- lint: floor 0 · reflex 0 · finish 0.
- render-check (320 / 768 / 1280 / 1920): floor 0 · reflex 0 · finish 0.
- tokens-check: 0 / 0 / 0.
- Problems fixed along the way:
  - F08: the comparison table overflowed at 320, and the staff table at 768. Fixed with container queries: the comparison table restacks, and the staff table turns into cards when its panel is under 780px.
  - R17: 円 units and a hazard tag were clipped.
  - R14: a role line was set at line-height 1.5.
  - R18: the payslip group band and the user block were hidden at 320.
  - The menu button leaked onto the desktop layout, the head was squeezed at 768, dates wrapped mid-figure, and a stale title showed in the error state.
- Accessory removed: the ink underline on the 差引支給額 total cell.

## Reflex findings kept

None.
