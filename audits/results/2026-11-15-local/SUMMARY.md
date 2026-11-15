# Audit summary

- Target: http://localhost:3202/ (given with --url)
- Started: 2026-11-15T18:49:36.611Z
- Command: `node run.mjs --url http://localhost:3202/ --runs 1`
- Budgets: PASS: 28 passed, 0 failed

| Step | Result | Time |
|---|---|---|
| lighthouse | ok | 24.3 s |
| flow | ok | 97.5 s |
| security | ok | under 0.1 s |
| geo | ok | 10.7 s |
| design | ok | 66.4 s |
| ux | ok | under 0.1 s |
| tools | ok | 0.8 s |
| responsive | ok | 48.2 s |
| inp | ok | 39.1 s |
| readable | ok | 8.9 s |

## Scoreboard

| Page | Perf | A11y | BP | SEO | LCP | FCP | CLS |
|---|---|---|---|---|---|---|---|
| Empty, mobile | 100 | 100 | 100 | 100 | 758 ms | 758 ms | 0 |
| Empty, desktop | 100 | 100 | 100 | 100 | 206 ms | 206 ms | 0 |
| Seeded, mobile | 98 | 100 | 100 | 100 | 2489 ms | 755 ms | 0 |
| Seeded, desktop | 100 | 100 | 100 | 100 | 511 ms | 207 ms | 0.042 |

Median of 1 Lighthouse run per page, chosen by performance score. Empty is a first visit; seeded has the eight-loan fixture in localStorage before load. TBT: empty, mobile 49 ms, empty, desktop 0 ms, seeded, mobile 31 ms, seeded, desktop 0 ms.

## Budgets

| Budget | Measured | Limit | Result |
|---|---|---|---|
| Performance, empty, mobile | 100 | ≥ 90 | pass |
| Accessibility, empty, mobile | 100 | ≥ 100 | pass |
| Best practices, empty, mobile | 100 | ≥ 95 | pass |
| SEO, empty, mobile | 100 | ≥ 100 | pass |
| LCP, empty, mobile | 758 ms | ≤ 2500 ms | pass |
| FCP, empty, mobile | 758 ms | ≤ 1800 ms | pass |
| CLS, empty, mobile | 0 | ≤ 0.1 | pass |
| TBT, empty, mobile | 49 ms | ≤ 200 ms | pass |
| Performance, empty, desktop | 100 | ≥ 90 | pass |
| Accessibility, empty, desktop | 100 | ≥ 100 | pass |
| Best practices, empty, desktop | 100 | ≥ 95 | pass |
| SEO, empty, desktop | 100 | ≥ 100 | pass |
| Performance, seeded, mobile | 98 | ≥ 90 | pass |
| Accessibility, seeded, mobile | 100 | ≥ 100 | pass |
| Best practices, seeded, mobile | 100 | ≥ 95 | pass |
| SEO, seeded, mobile | 100 | ≥ 100 | pass |
| LCP, seeded, mobile | 2489 ms | ≤ 2500 ms | pass |
| FCP, seeded, mobile | 755 ms | ≤ 1800 ms | pass |
| CLS, seeded, mobile | 0 | ≤ 0.1 | pass |
| TBT, seeded, mobile | 31 ms | ≤ 200 ms | pass |
| Performance, seeded, desktop | 100 | ≥ 90 | pass |
| Accessibility, seeded, desktop | 100 | ≥ 100 | pass |
| Best practices, seeded, desktop | 100 | ≥ 95 | pass |
| SEO, seeded, desktop | 100 | ≥ 100 | pass |
| Flow INP (worst timespan), mobile | 61 ms (Enter an offer) | ≤ 200 ms | pass |
| Flow INP (worst timespan), desktop | 45 ms (Enter an offer) | ≤ 200 ms | pass |
| GEO score (floor) | 80 | ≥ 44 | pass |
| Readable, first visit (floor) | 1392 ms (median of 1 cold load) | ≤ 3500 ms | pass |

First-load JS: no production build next to audits/, so it was not checked.
Floors are not goals: they are the scores measured on 2026-11-02, so falling below one means something regressed.
The readable floor is a time, so going over it fails. It sits well above the times measured on 2026-11-02, because throttled loads on a shared machine are noisy: a regression guard, not a goal.

Targets, which never fail a run:

| Measure | Now | Target | Status |
|---|---|---|---|
| GEO score | 80 | 80 | met |
| Readable, first visit | 1392 ms | 1600 ms | met |

## User flow

Lighthouse user flow: first load, an offer typed and submitted, the rent overridden, and a second offer compared. Timespans measure INP, CLS and TBT; snapshots audit the state for accessibility, best practices and SEO.

### Mobile

| Step | Mode | Perf | A11y | BP | SEO | INP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| First load (empty) | navigation | 100 | 100 | 100 | 100 | – | 0 | 33 ms |
| Enter an offer | timespan | 100 | – | 100 | – | 61 ms | 0 | 2 ms |
| Results | snapshot | – | 100 | 100 | 100 | – | – | – |
| Override the rent | timespan | 100 | – | 100 | – | 20 ms | 0 | 0 ms |
| Compare a second offer | timespan | 100 | – | 100 | – | 46 ms | 0 | 0 ms |
| Comparison | snapshot | – | 100 | 100 | 100 | – | – | – |

Failing audits: Network dependency tree (First load (empty)); Render-blocking requests (First load (empty)).

### Desktop

| Step | Mode | Perf | A11y | BP | SEO | INP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| First load (empty) | navigation | 100 | 100 | 100 | 100 | – | 0 | 0 ms |
| Enter an offer | timespan | 100 | – | 100 | – | 45 ms | 0 | 0 ms |
| Results | snapshot | – | 100 | 100 | 100 | – | – | – |
| Override the rent | timespan | 100 | – | 100 | – | 21 ms | 0 | 0 ms |
| Compare a second offer | timespan | 100 | – | 100 | – | 24 ms | 0 | 0 ms |
| Comparison | snapshot | – | 100 | 100 | 100 | – | – | – |

Failing audits: Network dependency tree (First load (empty)).


## Security

**35** of 100. HTTPS 0, headers 0, cookies 100, content 100, dependencies not measured.

Lighthouse-based checks: included, from the median mobile Lighthouse run of the empty page.

This target is plain HTTP, so TLS and every header read as missing whatever the server sends. Judge security with --target live.

- critical: Page not served over HTTPS
- critical: Missing Content-Security-Policy (0/10 points)
- critical: Missing Strict-Transport-Security (0/8 points)
- warning: Missing X-Content-Type-Options (0/4 points)
- warning: Missing X-Frame-Options (0/4 points)

## GEO

**80** of 100: crawl access 20/20, server content 28/30, structured data 16/20, social and meta 11/15, LLM discovery 0/10, indexability 5/5.

Words in the raw HTML: 405. Words once rendered: 405. Content parity 100%.

- warn: Heading Hierarchy (1/3)
- warn: Rich Schema Types (4/8)
- warn: Open Graph Tags (3/7)

## Design

| State | Desktop | Mobile | Score | Grade | Accessibility | Consistency | Motion | Performance |
|---|---|---|---|---|---|---|---|---|
| empty | 68 D | 68 D | 68 | D | 76 | 76 | 54 | 66 |
| debts-open | 68 D | 68 D | 68 | D | 76 | 76 | 54 | 66 |
| results | 68 D | 68 D | 68 | D | 76 | 76 | 54 | 66 |
| comparison | 68 D | 68 D | 68 | D | 76 | 76 | 54 | 66 |

Design engine 1.3.0. Score is the mean of the rounded desktop (1440x900) and mobile (375x812) scores; buckets are 0 to 100. The engine scores against Material 3 conventions and this app does not use Material, so a radius or target-size rule is advisory unless it is also a WCAG failure.

## UX deterministic

| Screen | Rule findings | P1 | P2 | P3 | Probe findings | Design |
|---|---|---|---|---|---|---|
| empty-desktop | 6 | 1 | 5 | 0 | 1 | 68 |
| empty-mobile | 6 | 1 | 5 | 0 | 0 | 68 |
| debts-open-desktop | 6 | 1 | 5 | 0 | 1 | 68 |
| debts-open-mobile | 6 | 1 | 5 | 0 | 0 | 68 |
| results-desktop | 6 | 1 | 5 | 0 | 0 | 68 |
| results-mobile | 6 | 1 | 5 | 0 | 0 | 68 |
| comparison-desktop | 6 | 1 | 5 | 0 | 0 | 68 |
| comparison-mobile | 6 | 1 | 5 | 0 | 0 | 68 |

Distinct findings, with how many screens show each:

- P1 1 transition(s) animate layout props (width/height/top/left/margin) (8 screens)
- P2 1 animation/transition(s) under 50ms (non-instant but too fast to read). (8 screens)
- P2 2 border-radius value(s) off the 7-step scale (0/4/8/12/16/28/full). (8 screens)
- P2 Missing landmark(s): nav. (8 screens)
- P2 3 to 12 pointer target(s) smaller than M3's comfortable 48×48px at 1440px wide (4 screens)
- P2 4 to 12 reading-copy text node(s) below 16px (or any text below 11px). (8 screens)
- P2 3 to 12 tap target(s) smaller than M3's comfortable 48×48px at 375px wide (4 screens)
- P3 Primary controls show no hover feedback (2 screens)

These are rule findings only. UX scores come from the AI review, which reads ux/<screen>.jpg and ux/<screen>.dom.json and writes ux/ai/<screen>.json; then `node lib/merge-ux.mjs <results>/ux` scores and merges them.

## Responsive overflow

| State | 320 | 375 | 768 | 1024 | 1440 |
|---|---|---|---|---|---|
| empty | ok, 1563 px | ok, 1430 px | ok, 1416 px | ok, 1416 px | ok, 1416 px |
| debts-open | ok, 1888 px | ok, 1743 px | ok, 1699 px | ok, 1699 px | ok, 1699 px |
| results | ok, 2534 px | ok, 2370 px | ok, 2106 px | ok, 2106 px | ok, 2106 px |
| comparison | ok, 3357 px | ok, 3173 px | ok, 2844 px | ok, 2118 px | ok, 2118 px |

0 of 20 pages scroll sideways. Each cell: horizontal overflow (document scrollWidth beyond the viewport), then page height. Full-page screenshots are in responsive/.

## INP probe

| CPU | Loans | Runs | typeSalary5 | pickCity | submit | editRent | openCompare | typeSalaryB5 | pickCityB | submitCompare |
|---|---|---|---|---|---|---|---|---|---|---|
| 1x | 1 | 2 | 48 (70) | 24 (23) | 16 (26) | 24 (32) | 16 (15) | 24 (33) | 16 (33) | 16 (20) |
| 4x | 1 | 2 | 88 (117) | 24 (46) | 32 (48) | 24 (56) | 16 (26) | 24 (44) | 24 (51) | 24 (33) |

Each cell: the worst Event Timing interaction in ms that started inside the step, then main-thread task ms in parentheses, the higher of the runs. 0 means no interaction reached 16 ms. The page stops scrolling before every step and each field is centred before typing, so no click lands mid-scroll or on the edge of the viewport.

## What a borrower sees and when

| Scenario | First paint | Real content | Readable | LCP (in page) |
|---|---|---|---|---|
| First visit | 1404 ms | 1392 ms | 1392 ms | 1404 ms |
| Returning, one saved offer | 1404 ms | 1393 ms | 1393 ms | 2956 ms |

One cold load per scenario, each in a fresh browser, on slow 4G and 4x CPU applied for real with devtools throttling, at 412x823 and DPR 1.75; ms from navigation start. First paint is Paint Timing's first-paint, the skeleton here. Real content is the first frame with `main h1` and no skeleton, readable the first frame with the first `.rise` block fully faded in. FCP and the other marks are in readable.json.

Lighthouse's simulated LCP sees only the skeleton for this app (758 ms on the empty mobile page in this run), so the Scoreboard's LCP is not when a borrower can read anything: the Readable column is.

## Site tools

| Tool | Result |
|---|---|
| header-check | score 80: 8 good, 1 warnings, 1 missing |
| meta-validate | score 80: 12 good, 2 warnings, 1 missing |
| structured-data | 1 schemas, 0 errors, 1 warnings |
| sitemap-validate | found, 1 URLs, 1 issues |
| redirect-check | 0 redirects, final status 200: No redirects detected. URL resolves directly. |
| broken-links | 14 links, 0 broken, 0 redirects, 0 errors, 0 timeouts |
| webmcp-check | AI readiness 0 |

## Compared with results/2026-11-15-live

| Metric | Before | Now | Change |
|---|---|---|---|
| lighthouse.empty-mobile.tti | 2157.687 | 2511.032 | +353.345 (worse) |
| lighthouse.seeded-desktop.cls | 0.01 | 0.042 | +0.032 (worse) |
| lighthouse.seeded-mobile.lcp | 2190.826 | 2489.098 | +298.272 (worse) |
| lighthouse.seeded-mobile.tti | 2190.826 | 2489.098 | +298.272 (worse) |
| security.headers | 27 | 0 | -27 (worse) |
| security.https | 100 | 0 | -100 (worse) |
| security.score | 71 | 35 | -36 (worse) |
| ux.comparison-desktop.p2 | 4 | 5 | +1 (worse) |
| ux.comparison-mobile.p2 | 4 | 5 | +1 (worse) |
| ux.debts-open-desktop.extras | 0 | 1 | +1 (worse) |
| ux.debts-open-desktop.p2 | 3 | 5 | +2 (worse) |
| ux.debts-open-mobile.p2 | 3 | 5 | +2 (worse) |
| ux.empty-desktop.extras | 0 | 1 | +1 (worse) |
| ux.empty-desktop.p2 | 3 | 5 | +2 (worse) |
| ux.empty-mobile.p2 | 3 | 5 | +2 (worse) |
| design.comparison.desktop | 42.1 | 68 | +25.9 (better) |
| design.comparison.merged | 42 | 68 | +26 (better) |
| design.comparison.mobile | 42.1 | 68 | +25.9 (better) |
| design.debts-open.desktop | 54.7 | 68 | +13.3 (better) |
| design.debts-open.merged | 55 | 68 | +13 (better) |
| design.debts-open.mobile | 54.7 | 68 | +13.3 (better) |
| design.empty.desktop | 54.7 | 68 | +13.3 (better) |
| design.empty.merged | 55 | 68 | +13 (better) |
| design.empty.mobile | 54.7 | 68 | +13.3 (better) |
| design.results.desktop | 39.7 | 68 | +28.3 (better) |
| design.results.merged | 40 | 68 | +28 (better) |
| design.results.mobile | 39.7 | 68 | +28.3 (better) |
| flow.desktop.comparison.accessibility | 91 | 100 | +9 (better) |
| flow.desktop.first-load-empty.accessibility | 89 | 100 | +11 (better) |
| flow.desktop.results.accessibility | 89 | 100 | +11 (better) |
| flow.mobile.comparison.accessibility | 91 | 100 | +9 (better) |
| flow.mobile.first-load-empty.accessibility | 89 | 100 | +11 (better) |
| flow.mobile.first-load-empty.performance | 99 | 100 | +1 (better) |
| flow.mobile.results.accessibility | 89 | 100 | +11 (better) |
| geo.contentParity | 0 | 100 | +100 (better) |
| geo.score | 44 | 80 | +36 (better) |
| geo.serverContent | 12 | 28 | +16 (better) |
| geo.socialMeta | 7 | 11 | +4 (better) |
| geo.structuredData | 0 | 16 | +16 (better) |
| inp.cpu1x.loans1.editRent | 368 | 24 | -344 (better) |
| inp.cpu1x.loans1.worst | 368 | 48 | -320 (better) |
| inp.cpu4x.loans1.editRent | 272 | 24 | -248 (better) |
| inp.cpu4x.loans1.worst | 272 | 88 | -184 (better) |
| lighthouse.empty-desktop.accessibility | 89 | 100 | +11 (better) |
| lighthouse.empty-desktop.lcp | 459.705 | 206.112 | -253.593 (better) |
| lighthouse.empty-desktop.si | 308.824 | 206.112 | -102.712 (better) |
| lighthouse.empty-desktop.tti | 459.705 | 206.112 | -253.593 (better) |
| lighthouse.empty-mobile.accessibility | 89 | 100 | +11 (better) |
| lighthouse.empty-mobile.lcp | 2129.087 | 758.021 | -1371.066 (better) |
| lighthouse.empty-mobile.performance | 99 | 100 | +1 (better) |
| lighthouse.empty-mobile.si | 1089.973 | 758.021 | -331.952 (better) |
| lighthouse.seeded-desktop.accessibility | 89 | 100 | +11 (better) |
| lighthouse.seeded-desktop.si | 398.3 | 207.216 | -191.084 (better) |
| lighthouse.seeded-mobile.accessibility | 89 | 100 | +11 (better) |
| lighthouse.seeded-mobile.fcp | 841.826 | 755.399 | -86.427 (better) |
| lighthouse.seeded-mobile.si | 1297.804 | 755.399 | -542.405 (better) |
| lighthouse.seeded-mobile.tbt | 108 | 31 | -77 (better) |
| readable.first.fcp | 2992 | 1404 | -1588 (better) |
| readable.first.fp | 1580 | 1404 | -176 (better) |
| readable.first.lcp | 3016 | 1404 | -1612 (better) |
| readable.first.readable | 2949 | 1392 | -1557 (better) |
| readable.first.real | 2949 | 1392 | -1557 (better) |
| readable.returning.fcp | 3112 | 1404 | -1708 (better) |
| readable.returning.fp | 1664 | 1404 | -260 (better) |
| readable.returning.lcp | 3464 | 2956 | -508 (better) |
| readable.returning.readable | 3050 | 1393 | -1657 (better) |
| readable.returning.real | 3050 | 1393 | -1657 (better) |
| security.content | 80 | 100 | +20 (better) |
| tools.header-check.score | 40 | 80 | +40 (better) |
| tools.meta-validate.score | 67 | 80 | +13 (better) |
| tools.sitemap-validate.found | 0 | 1 | +1 (better) |
| tools.structured-data.totalSchemas | 0 | 1 | +1 (better) |
| ux.comparison-desktop.extras | 1 | 0 | -1 (better) |
| ux.comparison-desktop.findings | 8 | 6 | -2 (better) |
| ux.comparison-desktop.p1 | 4 | 1 | -3 (better) |
| ux.comparison-mobile.findings | 8 | 6 | -2 (better) |
| ux.comparison-mobile.p1 | 4 | 1 | -3 (better) |
| ux.debts-open-desktop.p1 | 3 | 1 | -2 (better) |
| ux.debts-open-mobile.p1 | 3 | 1 | -2 (better) |
| ux.empty-desktop.p1 | 3 | 1 | -2 (better) |
| ux.empty-mobile.p1 | 3 | 1 | -2 (better) |
| ux.results-desktop.extras | 1 | 0 | -1 (better) |
| ux.results-desktop.findings | 9 | 6 | -3 (better) |
| ux.results-desktop.p1 | 4 | 1 | -3 (better) |
| ux.results-mobile.findings | 9 | 6 | -3 (better) |
| ux.results-mobile.p1 | 4 | 1 | -3 (better) |

Timings within 50 ms or 10%, and CLS within 0.01, count as unchanged. 0 metrics exist only in the stored run and 0 only in this one (steps not run in both).
