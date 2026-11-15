# Offer Lab audit, 2026-11-15

Offer Lab is fast and stable: Lighthouse performance is 98 to 100, layout shift is 0, nothing scrolls sideways at any of five widths, and a full live journey makes no request to another site. Federal tax, FICA and the 2025 state engine are carefully built, and the city tax rules that were checked are right for 2025.

The problems are in the numbers a student acts on. **The "left over each month" figure is too high in every profile checked, by $460 to $1,755 a month,** because two inputs do not match the sources the app cites:

- **Essentials** use a flat $1,200 national baseline that the app attributes to the MIT Living Wage Calculator. MIT's own figures for the same categories run $1,580 to $2,010 a month for one adult ([MONEY-01](#money-01)).
- **Rent** does not match the Zumper report it cites, and the data is a year old. New York shows $3,200 where Zumper's October 2026 median is $4,610; San Francisco $3,500 against $4,430 ([MONEY-02](#money-02)).

On top of that, the tax rules are for 2025 although 2026 rules are published by the IRS, the SSA and nearly every state ([MONEY-03](#money-03)), and the mandatory paid-leave and disability premiums withheld in thirteen states are left out ([MONEY-04](#money-04)). The verdict copy then states the result as a certainty ([MONEY-05](#money-05)).

This audit files **33 issues: 2 P0, 6 P1, 20 P2 and 5 P3.**

## Hand-computed profiles

Six realistic new-grad offers, each checked by hand against the primary sources below and against the independent oracle in [`tests/support/offer-oracle.mjs`](tests/support/offer-oracle.mjs), which is written from those sources and never imports the app. "Live" is what https://offer-lab-ivory.vercel.app showed on 2026-11-15 ([`scripts/profiles.mjs`](scripts/profiles.mjs) reads it).

| Profile | Take-home / mo, live | Correct 2026 | Rent, live | Correct | Essentials, live | Correct | Left over, live | Correct |
|---|---|---|---|---|---|---|---|---|
| $65,000, Boston | $4,279 | $4,265 | $2,700 | $2,980 | $1,416 | $1,872 | **+$163** "Living lean" | **-$587** |
| $72,000, New York City, $300 loan | $4,475 | $4,475 | $3,200 | $4,610 | $1,560 | $1,905 | **-$585** | **-$2,340** |
| $58,000, Austin | $4,061 | $4,065 | $1,450 | $1,510 | $1,200 | $1,770 | **+$1,411** "Strong cushion" | **+$785** |
| $85,000, San Francisco | $5,391 | $5,334 | $3,500 | $4,430 | $1,620 | $1,941 | **+$271** "Living lean" | **-$1,037** |
| $60,000, Columbus, $250 loan, $100 other | $3,969 | $3,974 | $1,200 | $1,170 | $1,116 | $1,831 | **+$1,303** | **+$623** |
| $80,000, Seattle | $5,403 | $5,333 | $2,100 | $1,900 | $1,416 | $2,008 | **+$1,887** | **+$1,425** |

Worked example, $65,000 in Boston, 2026: federal taxable income 65,000 - 16,100 = 48,900; tax 12,400 x 10% + 36,500 x 12% = $5,620. FICA 65,000 x 7.65% = $4,972.50. Massachusetts: (65,000 - 2,000 FICA deduction - 4,400 exemption) x 5% = $2,930. Paid family and medical leave 0.46% = $299. Take-home (65,000 - 5,620 - 4,972.50 - 2,930 - 299) / 12 = **$4,264.88**. Rent $2,980 (Zumper, October 2026) and essentials (5,141 + 4,257 + 5,991 + 2,359 + 4,715) / 12 = $1,872 (MIT, Suffolk County) leave **-$587.12**.

Take-home is close in every profile, because the 2025 to 2026 changes are small at these incomes and partly cancel against the missing payroll premiums. The verdict moves because rent and essentials are wrong.

## Scoreboard

Measured with the kit on the live site on 2026-11-15 ([`results/2026-11-15-live`](results/2026-11-15-live/SUMMARY.md), one Lighthouse run per page). The kit is Loan Desk's, adapted to Offer Lab: its fixtures, user flow and INP journey now type an offer, override the rent and compare a second offer, and it serves locally on port 3202.

| Page | Perf | A11y | BP | SEO | LCP | FCP | CLS |
|---|---|---|---|---|---|---|---|
| First visit, phone | 99 | 89 | 100 | 100 | 2.13 s | 0.78 s | 0 |
| First visit, desktop | 100 | 89 | 100 | 100 | 0.46 s | 0.22 s | 0 |
| Saved offer, phone | 98 | 89 | 100 | 100 | 2.19 s | 0.84 s | 0 |
| Saved offer, desktop | 100 | 89 | 100 | 100 | 0.46 s | 0.23 s | 0.01 |

| Measure | Live | After, local build of `audit-redesign` ([`results/2026-11-15-local`](results/2026-11-15-local/SUMMARY.md)) |
|---|---|---|
| Lighthouse accessibility | 89 on all 4 pages | 100 on all 4 pages |
| Security | 71 of 100 (headers 27) | Not comparable: the engine reads headers only over HTTPS. Header check 40 to 80; headers verified by curl and `security.spec.mjs` |
| GEO (AI-search readiness) | 44 of 100; 0 words in the server HTML, 220 after JavaScript | 80; 405 words in the server HTML |
| Design heuristics | 40 to 55 of 100 (F) across 4 screens | 68 (D) |
| User-flow INP, phone and desktop | 47 ms and 65 ms | |
| INP probe, worst step | 368 ms (editing the rent, 1x CPU) | 88 ms |
| Real content readable, slow 4G and 4x CPU | 2.95 s first visit, 3.05 s with a saved offer | 1.39 s both |
| Screens that scroll sideways | 0 of 20 | 0 of 20 |
| Budgets | 4 failed | 28 of 28 pass |

Watch item after the redesign: with a saved offer, desktop CLS went from 0.01 to 0.042 and phone LCP is 2,489 ms against a 2,500 ms budget, because the saved offer is restored after hydration.
| Lighthouse accessibility failures | color-contrast, aria-allowed-attr, label-content-name-mismatch, heading-order, target-size |

## Severity

| Severity | Means |
|---|---|
| P0 | A typical student in the main flow sees a wrong figure or verdict that could change a decision worth money. |
| P1 | The same harm for a recognizable group, misleading wording, a WCAG 2.2 A/AA failure in the core flow, or content invisible to crawlers. |
| P2 | A real but bounded defect, a misleading statement with no wrong number, or a missed opportunity. |
| P3 | Polish or hardening. |

## Money and claims

### MONEY-01
**P0. Essentials are $345 to $715 a month below the source the app cites.** Status: fixed.

- Evidence: `src/data/cities.ts` sets `NATIONAL_NECESSITIES_BASELINE = 1200` and scales it by a hand-set `colIndex` (Boston 1.18 gives $1,416). The page credits "MIT Living Wage Calculator (2024), BEA Regional Price Parities (2024)". MIT's current figures (data updated 2026-02-15) for one adult with no children, food + medical + transportation + internet and mobile + other, are $1,872 a month in Suffolk County (Boston), $1,770 in Travis County (Austin) and $1,831 in Franklin County (Columbus). The colIndex values match no published BEA RPP series.
- Effect: the left-over figure is overstated by $345 (New York) to $715 (Columbus) a month in every profile, which turns Boston's "Living lean" into a shortfall and Austin's "Strong cushion" into "Comfortable".
- Fix: per-city essentials from each city's MIT county page, stored with the county and the five parts, shown as a breakdown, still editable.
- Source: https://livingwage.mit.edu/counties/25025 (and the county page for each city, listed in `src/data/cities.ts`).
- Test: `money-oracle.spec.mjs` "essentials match MIT".

### MONEY-02
**P0. Rents do not match the cited Zumper report and are a year old.** Status: fixed.

- Evidence: the app says "median 1-bedroom rents as of November 2025 (Zumper National Rent Report)". Zumper's October 2026 report (published 2026-10-27, national median $1,519) gives New York $4,610 (app $3,200), San Francisco $4,430 ($3,500), Honolulu $2,380 ($2,000), Boston $2,980 ($2,700); Phoenix $1,210 ($1,450) and Jacksonville $1,100 ($1,400) run the other way. Most report cities differ from the app by more than $50.
- Effect: a student weighing New York is shown $1,410 a month more room than the median listing leaves.
- Fix: every report city takes its October 2026 figure. The ten cities the report does not cover (Ann Arbor, Burlington, Albany, Hartford, Wilmington, Grand Rapids, Boulder, Fort Collins, Birmingham, Little Rock) take Zumper's city page (30-day average, 2026-11-15) and say so.
- Source: https://www.zumper.com/blog/rental-price-data/ and https://www.zumper.com/rent-research/<city>.
- Test: `money-oracle.spec.mjs` "rent matches Zumper October 2026".

### MONEY-03
**P1. Taxes use 2025 rules although 2026 rules are published.** Status: fixed.

- Evidence: federal standard deduction $15,750 and 2025 brackets (2026: $16,100; 10% to $12,400, 12% to $50,400, 22% to $105,700, 24% to $201,775, 32% to $256,225, 35% to $640,600); Social Security wage base $176,100 (2026: $184,500). For 2026, among others: Kentucky 4% to 3.5%, North Carolina 4.25% to 3.99%, Georgia 5.19% to 4.99% with a $15,000 deduction, Indiana 3% to 2.95%, Ohio a flat 2.75% above $26,050, Oklahoma a new 0 / 2.5 / 3.5 / 4.5% schedule, Nebraska 4.55% top rate, Arkansas 3.7% top rate, Utah 4.45%, Hawaii's deduction $4,400 to $8,000, New York's first five rates cut by 0.1 point, and indexed amounts in CA, IL, KY, MD, MI, MN, MO, NE, OR, RI, VT and WI.
- Effect: small at these incomes ($5 to $40 a month), larger in states that cut rates.
- Fix: 2026 everywhere, with a source per state in `src/data/taxes.ts`. Where a state has not yet published a 2026 figure the statute's formula is used and marked (SCOPE-02).
- Sources: https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill ; https://www.govinfo.gov/content/pkg/FR-2025-11-03/pdf/2025-19763.pdf ; state sources in `src/data/taxes.ts`.
- Test: `money-oracle.spec.mjs` take-home for six profiles.

### MONEY-04
**P1. Mandatory state payroll premiums are left out.** Status: fixed.

- Evidence: employees in CA (SDI 1.3%, no cap), WA (paid leave 0.8072% plus WA Cares 0.58%), NY (paid family leave 0.432% up to $411.91, disability $0.60 a week), MA (0.46%), OR (paid leave 0.6% and the 0.1% statewide transit tax), CO (0.44%), CT (0.5%), RI (1.1% to $100,000), MN (0.44%, new in 2026), DE (0.4%), HI (up to $7.50 a week), PA (unemployment 0.07%) and VT (up to 0.11%) have these withheld. Only CA SDI was mentioned, as "not included".
- Effect: Seattle at $80,000 shows $92 a month more than the paycheck; San Francisco at $85,000, $92 more. "No state income tax" in Washington reads as no state deductions at all.
- Fix: a 2026 table of employee rates and caps per state, shown as its own line ("State paid leave and disability").
- Sources: https://edd.ca.gov/en/payroll_taxes/rates_and_withholding/ ; https://paidleave.wa.gov/app/uploads/2021/12/Employer-Wage-Reporting-and-Premiums-Toolkit-v25.1-2026.06.26.pdf ; https://wacaresfund.wa.gov/employers/ ; https://paidfamilyleave.ny.gov/2026 ; https://www.wcb.ny.gov/content/main/DisabilityBenefits/employer-disability-benefits.jsp ; https://www.mass.gov/info-details/paid-family-and-medical-leave-employer-contribution-rates-and-calculator ; https://paidleave.oregon.gov/employers/ ; https://www.oregon.gov/dor/programs/businesses/pages/statewide-transit-tax.aspx ; https://famli.colorado.gov/employers ; https://www.ctpaidleave.org/how-ct-paid-leave-works/contributions ; https://dlt.ri.gov/sites/g/files/xkgbur571/files/2026-06/7.1.26%20UI%20%26%20TDI%20Quick%20Reference.pdf ; https://pl.mn.gov/resources/calculators/premium-rate-and-contributions ; https://delcode.delaware.gov/title19/c037/index.html ; https://labor.hawaii.gov/dcd/files/2025/12/2026-Maximum-Weekly-Wage-Base.pdf ; https://www.pa.gov/agencies/dli/resources/for-employers-and-educators/how-to-file/uc-tax/calculating-contributions--penalties-and-interest.html ; https://tax.vermont.gov/business/child-care-contribution
- Test: `money-oracle.spec.mjs` Seattle and San Francisco profiles.

### MONEY-05
**P1. The verdict states the outcome as certain.** Status: fixed.

- Evidence: "You're in good shape ... you can save, have fun, and handle surprises without stress"; "real savings, investing, and flexibility"; "You can survive on this, but barely". These rest on two estimates (median rent, a cost-of-living budget) the student has not confirmed.
- Fix: plain, hedged copy that names what the number assumes and gives one next step (put in your real rent).
- Test: `ux-copy.spec.mjs`.

### MONEY-06
**P2. The 0.9% Additional Medicare Tax above $200,000 is missing.** Status: fixed. IRC 3101(b)(2); https://www.irs.gov/taxtopics/tc560 . At $250,000 take-home is overstated by $37.50 a month.

### MONEY-07
**P2. Minnesota's deduction phase-out overcharges above $330,300.** Status: fixed. The code applies 3% to all AGI over the first threshold with no cap, so above the second threshold it reduces the deduction by 13% instead of 10% (up to about $210 of extra tax). The worksheet caps the 3% part. https://www.revisor.mn.gov/statutes/cite/290.0123 ; https://www.revenue.state.mn.us/sites/default/files/2025-12/inflation-adjusted-amounts-2026.pdf

### MONEY-08
**P2. NYC school tax credit cutoff tested on the wrong income.** Status: fixed. The rate-reduction credit ends when income (federal AGI) is over $500,000; the code tested city taxable income, so wages of $500,001 to $508,000 got about $1,100 of credit they do not qualify for. https://www.tax.ny.gov/pdf/2025/inc/it201i_2025.pdf (line 69a)

### MONEY-09
**P2. Colorado's high-income deduction add-back and California's 1% tax over $1M are missing.** Status: fixed. Colorado: from 2026, AGI of $300,000 or more keeps only $1,000 of the standard deduction (HB25-1274, Proposition MM), https://leg.colorado.gov/sites/default/files/documents/2025A/bills/2025a_1274_enr.pdf . California: Behavioral Health Services Tax, 1% of taxable income over $1,000,000, https://www.ftb.ca.gov/forms/2025/2025-540-instructions.html .

### MONEY-10
**P2. Local items missing or stale.** Status: fixed. Pittsburgh's $52 local services tax (https://www.pittsburghpa.gov/City-Government/Finance-Budget/Taxes); Portland's Arts Tax, $50 for 2026 (https://www.portland.gov/revenue/arts-tax); Metro's threshold indexed to $128,000 for 2026 (https://www.portland.gov/revenue/personal-tax); Philadelphia's resident rate 3.74% to June and 3.735% from July 2026 (https://www.phila.gov/services/payments-assistance-taxes/business-taxes/wage-tax-employers/).

### MONEY-11
**P3. Arkansas's low-income table is not modeled.** Status: known issue. Single filers owe nothing up to about $14,600 of income and pay less up to $17,500; the code overstates tax there by up to about $93 a year. The 2026 table is not published yet. https://www.dfa.arkansas.gov/wp-content/uploads/2025_AR1000F_and_AR1000NR_Instructions.pdf

### MONEY-12
**P2. Utilities are in neither number.** Status: needs Ben. Zumper's figure is the listed rent, which usually excludes electricity and heat. The old essentials copy said it included utilities, but the $1,200 was not built from any utility figure; MIT counts utilities inside housing, so the MIT categories used now exclude them. The page now says utilities are not included. Choosing a utilities source (for example EIA average residential bills by state) is a product call.

### MONEY-13
**P2. 401(k) and pre-tax benefits are not mentioned.** Status: fixed. Take-home is before any 401(k) contribution or pre-tax health premium; the page now says so, and that health costs sit in essentials.

### MONEY-14
**P3. A tie reads as a win.** Status: fixed. Two offers with the same left-over figure showed "Offer A leaves you with $0/month more". Within $25 a month the page now says they come out about even.

### MONEY-15
**P2. The loan field points to "Loan Lab".** Status: fixed. The tool is Cense Loan Desk (https://cense-loan-desk.vercel.app); the helper now links to it.

## Who the model does not fit

### SCOPE-01
**P2. The model assumes living alone in a median 1-bedroom.** Status: disclosed; needs Ben for a roommate option. Most new grads in New York and San Francisco share. The page now says the rent is a median 1-bedroom listing and that the student can enter their real share. A "split rent with roommates" control would help but is a product decision.

### SCOPE-02
**P2. Seven 2026 state figures are not published yet.** Status: known issue. The statute's formula is used and marked in `src/data/taxes.ts`: Idaho's zero bracket ($4,938), Louisiana's return deduction (the department's withholding figure $12,875 is used), California's credit phase-out threshold ($260,778 estimated), Arizona's deduction ($16,100 by statute), Arkansas's indexed thresholds (2025 thresholds with the 3.7% rate), Vermont's brackets (derived from the 2026 withholding tables) and Utah's credit phase-out base ($18,696). Re-check when the 2026 forms come out in December and January.

### SCOPE-03
**P3. 2027 federal figures are out.** Status: needs Ben. Rev. Proc. 2026-35 (5 November 2026) sets 2027 (single deduction $16,600). A May 2027 graduate's first paycheck falls under 2027 rules, but most states have not published 2027 figures, so the app uses 2026 consistently and says so. Switching federal alone would change take-home by about $5 a month.

### SCOPE-04
**P3. Employer-optional premiums are shown at their maximum.** Status: disclosed. Several paid-leave programs set the most an employer may withhold (WA, OR, CO, MA, MN, DE, HI, VT, NY); some employers pay part. The figure is the conservative one.

## Data safety and resilience

### RES-01
**P2. A bad share link shows a blank page.** Status: fixed. `decodeShareState` checked only the first offer's salary and that `cityId` was a string; an unknown city, a malformed second offer or a negative override left the results area empty. Links are now validated and anything unusable falls back to the form.

## Accessibility

### A11Y-01
**P1. Text below 4.5:1.** Status: fixed. `slate-400` (#8CA98E) is used for helper and footer text on white and cream (about 2.7:1); placeholders use `slate-300`. Lighthouse `color-contrast` fails on every page.

### A11Y-02
**P2. The city picker is not a combobox.** Status: fixed. `aria-expanded` sits on a plain text input (`aria-allowed-attr` fails), the list has no id or `aria-controls`, and arrow-key focus is not exposed with `aria-activedescendant`, so a screen reader user hears no options.

### A11Y-03
**P2. Accessible names do not include the visible text.** Status: fixed. Lighthouse `label-content-name-mismatch` fails: the edit buttons are named "Edit value, currently $2,700" while showing "$2,700", which voice-control users cannot target by what they see.

### A11Y-04
**P2. Touch targets are 12 to 20 px.** Status: fixed. The pencil, info, reset, share and close controls are far below the 40 px floor (Lighthouse `target-size` fails on results).

### A11Y-05
**P3. Heading order skips levels and type drops to 10 px.** Status: fixed. `h1` is followed by `h3`; badges use `text-[10px]`, under the 13 px floor.

## Security

### SEC-01
**P2. No security headers.** Status: fixed. No Content-Security-Policy, X-Content-Type-Options, X-Frame-Options, Referrer-Policy or Permissions-Policy (security score 71, headers 27 of 100). Added in `next.config.ts`.

### SEC-02
**P2. Next.js 16.2.6 is inside the range of 20 published advisories.** Status: fixed. `npm audit` reports critical and high advisories for `next` up to 16.4.0 (for example GHSA-2xp9-vwfh-vxw4, GHSA-6gpp-xcg3-4w24). This static page uses no middleware, server actions or image optimization, so the exposure is small, but the fix is a minor upgrade within 16: `next@16.4.3` (released 2026-10-23).

## SEO and findability

### SEO-01
**P1. Crawlers and AI assistants see an empty page.** Status: fixed. The whole page renders inside a client `Suspense` boundary that reads `useSearchParams`, so the server HTML has 0 of the 220 words a student reads (GEO 44). The heading, explainer and method now render on the server.

### SEO-02
**P2. No robots.txt, sitemap, canonical URL or structured data.** Status: fixed.

### SEO-03
**P3. Title and description carry em dashes and "2025".** Status: fixed.

## UX, design and performance

### UX-01
**P2. Not on the Cense design system.** Status: fixed. The page background is cool gray #F8FAFC, not cream #FFFCEC; Inter replaces Bricolage Grotesque and Instrument Sans; the focus ring is navy blue; the verdict uses stock red, amber and emerald; buttons are rounded rectangles, not pills; design score 40 to 55 (F).

### UX-02
**P2. Methodology popovers misplace on phones.** Status: fixed. The popover positions itself with a guessed 220 px height and a fixed 320 px width, so it can cover the figure it explains; the copy says "Click any number with a pencil" on touch screens. The math now opens in place under each figure.

### UX-03
**P2. The comparison buries its answer.** Status: fixed. Two full breakdowns and two summary cards repeat the same figures; the difference and why it happens are hard to see. Both paychecks now sit on one scale, one bar each, with the difference stated once.

### UX-04
**P3. The verdict bands are not explained.** Status: fixed. The $0, $300 and $800 cut-offs are now stated in the method.

### PERF-01
**P2. Entrances are scripted with framer-motion.** Status: fixed. Content starts at opacity 0 and waits for script, which leaves it invisible in a background tab, and framer-motion is the largest client dependency. Replaced with CSS keyframes that respect reduced motion.

### PERF-02
**P2. Editing the rent took up to 368 ms.** Status: fixed. The INP probe's worst step after the redesign is 88 ms, and editing the rent takes 16 to 24 ms (results/2026-11-15-local).

## Not covered

- Living outside the city's county, part-year residents, commuting across a state or city line (for example a Philadelphia job and a New Jersey home), and nonresident city tax rates.
- Bonuses, equity, overtime, tips, signing bonuses and relocation pay; itemized deductions; credits other than those listed.
- Washington's hourly workers' compensation deduction (about $0.10 an hour for office work, varies by job class) and Oregon's Workers' Benefit Fund (0.9 cents an hour).
- Whether each city's MIT county figure reflects someone who uses transit rather than a car.

## Method

Every figure the app shows or computes was listed from `src/` and checked against a primary source as of November 2026. State rules were read from each revenue department's 2026 withholding formula, indexed-amount notice, 2026 form or statute; city rules from the city's own page or form. Six profiles were computed by hand and by the oracle, and compared with the live site. The scans are the kit from Loan Desk with Offer Lab fixtures; run them with `node run.mjs --url <url> --runs 1` from this folder.
