# NOTES — 03-dash-clinic

Budget: standard. Surface: product. Mode: build (plus a DESIGN.md for the project).

## Grounding

- Subject: a payroll SaaS for small clinics (15–40 staff). This is the "今月の給与" screen.
- Audience: the office manager (事務長), who also covers reception and runs payroll once a month. They are not a payroll specialist, and they fear missing the bank deadline.
- Job: **finalize** this month's pay. Primary action: 「給与を確定する」. It stays visibly disabled, with the reason beside it, until the step that unblocks it is done. That step is 「勤怠を承認する」, which carries the filled style.

## Three directions considered

- A — "押印欄" (chosen). Borrows the seal boxes and the date seal (データ印) that clinic offices still use to sign off attendance and pay. The approval board leads: a countdown, one seal per staff member, the finalize seal slot, and the pay date. Light near-neutral ground, rounded display face with a UD gothic body, paper panels with real elevation.
- B — "賃金台帳". Borrows the printed wage ledger's 支給 / 控除 / 差引 columns. A full-width ruled table leads, with mono figures and flat hairlines, dense. Rejected because it lands on the agent house look (hairlines, mono labels, printed-document feel) and gives no sense of *progress toward the deadline*.
- C — "受付の呼出表示". Borrows the waiting-room number board: a dark panel, condensed numerals, the countdown and pending count as glowing figures. This was the direction outside my habits. Rejected because payroll is a careful daytime task and an alarm board turns money into stress.

Recommended and built: **A**, because sign-off in this subject literally *is* stamping, so the progress state needs no explaining.

## Token plan (as shipped)

- Colours: wall #F2F2F0 (ground, back-office wall), paper #FFFFFF (slip and ledger paper), ink #1D2125, pencil #575D63 (muted), rule #D5D6D7 (hairlines), rule-strong #868B90 (field borders, empty seal rings), 朱肉 #B8341B (accent), seal-ink wash #FBEEEA, danger #A01E3C (errors only).
- Accent candidates:
  - 朱肉 vermilion (approval seal).
  - Scrub navy #23466E (staff uniforms). Not chosen because it is the house-look ink-blue and carries no meaning here.
  - Surgical green #2F6B57 (operating gowns). Not chosen because nothing in payroll is green, and it drifts toward the forest-green neighbour.
  - Chosen: vermilion, even though it is the warmest, because in a Japanese clinic office red seal ink *is* the act of approval. It marks what the user acts on and what is done.
- Display face candidates:
  - Zen Maru Gothic, rounded: clinic signboards and patient cards.
  - BIZ UDPMincho, serif: printed slip headings.
  - Dela Gothic One, heavy display.
  - Chosen: Zen Maru Gothic, matching the clinic's own lettering. Used only for the page title, the brand and the countdown.
- Body: BIZ UDPGothic (a universal-design gothic made for public and medical documents). Figures: IBM Plex Sans with tabular numerals. All three are loaded from Google Fonts with `display=swap`.
- Scale ~1.2 from 16px: 14 / 16 / 19 / 23 / 28 / 44. Spacing base 4px. Radius 6px for controls, 8px for panels, 50% for seals. Elevation: a soft two-layer shadow on paper panels only.
- Layout: the sidebar, then a header with title, month switch and actions. Below that the approval board (the signature), then the totals equation (基本給 + 残業代 − 控除 = 差引支給額, with 前月比), then the ledger. At 1600px and wider, a right rail lists the pending requests.

## Signature

The **approval board of seals**. There is one ring per staff member with their surname set vertically. An approved ring is stamped in 朱肉 and hand-tilted a few degrees; a pending ring is dashed and empty; a failed import is a dashed ring in the error colour. Finalizing stamps a three-tier date seal (給与 / 11.17 / 確定).

The seal is the unit. It is reused as the first column of the ledger, as the marker in the request list (dialog and wide rail), and as the finalize slot in the confirm dialog. On load the board shows 14 stamped, 3 pending and 1 failed, so the meaningful state is visible without any interaction.

## States and how to reach them

- Partial states in the default render:
  - 3 unapproved requests (田中, 吉田, 中村) are marked in their rows, on the board, and on the approve button.
  - 1 row (伊藤) whose timecard punches failed to import, with an inline error and a 「伊藤さんの打刻を取り込み直す」 retry.
- Approve: 「勤怠を承認する」 opens a dialog with checkboxes. Approving stamps the seals, adds the approved overtime to 残業代, and shows the toast 「3件の勤怠を承認しました」.
- Retry import: shows 「取り込んでいます…」, then the seal is stamped and the toast 「伊藤 翔さんの打刻を取り込みました」 appears. While offline it shows an error that says how to fix it.
- Finalize: available only when nothing blocks it. It opens a confirm dialog with the head count, total net pay and pay date. Then the date seal is stamped, the toast 「11月分の給与を確定しました」 appears, and the next steps (配付, 振込データ) become available. While offline the dialog shows an error.
- Loading: switch the month (10月分 / 12月分 / 11月分). Skeletons that match the layout appear for about 650ms.
- Empty, whole view: 「12月分」. The attendance period has not ended, so the screen explains when data will appear and links to スタッフ台帳.
- Empty, filter: type a name with no match (e.g. 佐々木). 「絞り込みを解除する」 clears it.
- Error, whole view: go offline (DevTools → Network → Offline) and switch the month. 「もう一度読み込む」 recovers.
- Finalized, read-only month: 「10月分」.

## Assumptions and invented content

- The screen is pinned to **Tue 17 Nov 2026** so the countdown is stable. The payroll deadline is 11/20 (金), 3 days away; attendance period 10/16–11/15; pay date 11/25 (水). The 10月 and 12月 dates were derived the same way.
- The clinic name 「さくら通りクリニック」, the manager 「森 早苗」, all 18 staff names, the roles, the pay figures, and the requests are invented.
- Deductions are a flat ~20.5% of gross, rounded to 10円, as a stand-in for social insurance and tax. It is not a real calculation. Overtime added on approval is a plausible hourly rate × 1.25.
- The brief lists only base pay, overtime and deductions, so allowances (手当, 通勤費) are left out.
- No dark scheme. The office screen is used in daylight; this can be added later as its own palette.

## Verification

- lint: floor 0 · reflex 0 · finish 0 (also clean with `--design DESIGN.md`).
- render-check (320/768/1280/1920): floor 0 · reflex 0 · finish 0.
- tokens-check: clean.
- Fixed along the way:
  - F07: the dialog checkbox had no programmatic label.
  - R14: brand and alert text line-height.
  - R17: the table escaped its panel at 768.
  - The board cell selectors were off by one.
  - The totals equation didn't add up.
  - The menu button showed on desktop.
  - Totals ignored `hidden` in the empty and error months.
- Accessory removed: the inset accent bar on the current nav item (the wash already marks it).

## Reflex findings kept

None.
