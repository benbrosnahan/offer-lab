# Audit summary

- Target: https://offer-lab-ivory.vercel.app/ (given with --url)
- Started: 2026-11-15T17:41:00.295Z
- Command: `node run.mjs --url https://offer-lab-ivory.vercel.app/ --runs 1`
- Budgets: FAIL: 25 passed, 4 failed

| Step | Result | Time |
|---|---|---|
| lighthouse | ok | 29.8 s |
| flow | ok | 101.4 s |
| security | ok | 0.1 s |
| geo | ok | 11.6 s |
| design | ok | 68.7 s |
| ux | ok | under 0.1 s |
| tools | ok | 1.3 s |
| responsive | ok | 64.7 s |
| inp | ok | 41.1 s |
| readable | ok | 9.5 s |

## Scoreboard

| Page | Perf | A11y | BP | SEO | LCP | FCP | CLS |
|---|---|---|---|---|---|---|---|
| Empty, mobile | 99 | 89 | 100 | 100 | 2129 ms | 784 ms | 0 |
| Empty, desktop | 100 | 89 | 100 | 100 | 460 ms | 222 ms | 0 |
| Seeded, mobile | 98 | 89 | 100 | 100 | 2191 ms | 842 ms | 0 |
| Seeded, desktop | 100 | 89 | 100 | 100 | 463 ms | 225 ms | 0.01 |

Median of 1 Lighthouse run per page, chosen by performance score. Empty is a first visit; seeded has the eight-loan fixture in localStorage before load. TBT: empty, mobile 54 ms, empty, desktop 0 ms, seeded, mobile 108 ms, seeded, desktop 0 ms.

## Budgets

| Budget | Measured | Limit | Result |
|---|---|---|---|
| Performance, empty, mobile | 99 | ≥ 90 | pass |
| Accessibility, empty, mobile | 89 | ≥ 100 | **FAIL** |
| Best practices, empty, mobile | 100 | ≥ 95 | pass |
| SEO, empty, mobile | 100 | ≥ 100 | pass |
| LCP, empty, mobile | 2129 ms | ≤ 2500 ms | pass |
| FCP, empty, mobile | 784 ms | ≤ 1800 ms | pass |
| CLS, empty, mobile | 0 | ≤ 0.1 | pass |
| TBT, empty, mobile | 54 ms | ≤ 200 ms | pass |
| Performance, empty, desktop | 100 | ≥ 90 | pass |
| Accessibility, empty, desktop | 89 | ≥ 100 | **FAIL** |
| Best practices, empty, desktop | 100 | ≥ 95 | pass |
| SEO, empty, desktop | 100 | ≥ 100 | pass |
| Performance, seeded, mobile | 98 | ≥ 90 | pass |
| Accessibility, seeded, mobile | 89 | ≥ 100 | **FAIL** |
| Best practices, seeded, mobile | 100 | ≥ 95 | pass |
| SEO, seeded, mobile | 100 | ≥ 100 | pass |
| LCP, seeded, mobile | 2191 ms | ≤ 2500 ms | pass |
| FCP, seeded, mobile | 842 ms | ≤ 1800 ms | pass |
| CLS, seeded, mobile | 0 | ≤ 0.1 | pass |
| TBT, seeded, mobile | 108 ms | ≤ 200 ms | pass |
| Performance, seeded, desktop | 100 | ≥ 90 | pass |
| Accessibility, seeded, desktop | 89 | ≥ 100 | **FAIL** |
| Best practices, seeded, desktop | 100 | ≥ 95 | pass |
| SEO, seeded, desktop | 100 | ≥ 100 | pass |
| Flow INP (worst timespan), mobile | 47 ms (Enter an offer) | ≤ 200 ms | pass |
| Flow INP (worst timespan), desktop | 65 ms (Enter an offer) | ≤ 200 ms | pass |
| Security score, live (floor) | 71 | ≥ 71 | pass |
| GEO score (floor) | 44 | ≥ 44 | pass |
| Readable, first visit (floor) | 2949 ms (median of 1 cold load) | ≤ 3500 ms | pass |

First-load JS is read from the local build, so it is checked only when the target is served from this machine.
Floors are not goals: they are the scores measured on 2026-11-02, so falling below one means something regressed.
The readable floor is a time, so going over it fails. It sits well above the times measured on 2026-11-02, because throttled loads on a shared machine are noisy: a regression guard, not a goal.

Targets, which never fail a run:

| Measure | Now | Target | Status |
|---|---|---|---|
| Security score, live | 71 | 90 | 19 to go |
| GEO score | 44 | 80 | 36 to go |
| Readable, first visit | 2949 ms | 1600 ms | 1349 ms to go |

## User flow

Lighthouse user flow: first load, an offer typed and submitted, the rent overridden, and a second offer compared. Timespans measure INP, CLS and TBT; snapshots audit the state for accessibility, best practices and SEO.

### Mobile

| Step | Mode | Perf | A11y | BP | SEO | INP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| First load (empty) | navigation | 99 | 89 | 100 | 100 | – | 0 | 70 ms |
| Enter an offer | timespan | 100 | – | 100 | – | 47 ms | 0 | 0 ms |
| Results | snapshot | – | 89 | 100 | 100 | – | – | – |
| Override the rent | timespan | 100 | – | 100 | – | 27 ms | 0 | 0 ms |
| Compare a second offer | timespan | 100 | – | 100 | – | 35 ms | 0 | 0 ms |
| Comparison | snapshot | – | 91 | 100 | 100 | – | – | – |

Failing audits: `[aria-*]` attributes do not match their roles (First load (empty)); Background and foreground colors do not have a sufficient contrast ratio. (First load (empty)); Elements with visible text labels do not have matching accessible names. (First load (empty)); Reduce unused JavaScript (First load (empty)); Network dependency tree (First load (empty)); Background and foreground colors do not have a sufficient contrast ratio. (Results); Heading elements are not in a sequentially-descending order (Results); Elements with visible text labels do not have matching accessible names. (Results); 4 more.

### Desktop

| Step | Mode | Perf | A11y | BP | SEO | INP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| First load (empty) | navigation | 100 | 89 | 100 | 100 | – | 0 | 0 ms |
| Enter an offer | timespan | 100 | – | 100 | – | 65 ms | 0 | 0 ms |
| Results | snapshot | – | 89 | 100 | 100 | – | – | – |
| Override the rent | timespan | 100 | – | 100 | – | 28 ms | 0 | 0 ms |
| Compare a second offer | timespan | 100 | – | 100 | – | 28 ms | 0 | 0 ms |
| Comparison | snapshot | – | 91 | 100 | 100 | – | – | – |

Failing audits: `[aria-*]` attributes do not match their roles (First load (empty)); Background and foreground colors do not have a sufficient contrast ratio. (First load (empty)); Elements with visible text labels do not have matching accessible names. (First load (empty)); Reduce unused JavaScript (First load (empty)); Network dependency tree (First load (empty)); Background and foreground colors do not have a sufficient contrast ratio. (Results); Heading elements are not in a sequentially-descending order (Results); Elements with visible text labels do not have matching accessible names. (Results); 4 more.


## Security

**71** of 100. HTTPS 100, headers 27, cookies 100, content 80, dependencies not measured.

Lighthouse-based checks: included, from the median mobile Lighthouse run of the empty page.

- critical: Missing Content-Security-Policy (0/10 points)
- warning: Missing X-Content-Type-Options (0/4 points)
- warning: Missing X-Frame-Options (0/4 points)
- warning: CORS allows all origins

## GEO

**44** of 100: crawl access 20/20, server content 12/30, structured data 0/20, social and meta 7/15, LLM discovery 0/10, indexability 5/5.

Words in the raw HTML: 0. Words once rendered: 220. Content parity 0%.

- fail: H1 Tag in SSR (0/5)
- fail: Heading Hierarchy (0/3)
- fail: Body Text Parity (SSR vs CSR) (0/10)
- fail: JSON-LD in SSR (0/12)
- fail: Rich Schema Types (0/8)
- warn: Open Graph Tags (3/7)
- warn: Canonical URL (0/4)

High-priority recommendations: Add JSON-LD structured data; Move JS-injected page body into the server response.

## Design

| State | Desktop | Mobile | Score | Grade | Accessibility | Consistency | Motion | Performance |
|---|---|---|---|---|---|---|---|---|
| empty | 54.7 F | 54.7 F | 55 | F | 42 | 88 | 32 | 66 |
| debts-open | 54.7 F | 54.7 F | 55 | F | 42 | 88 | 32 | 66 |
| results | 39.7 F | 39.7 F | 40 | F | 0 | 76 | 32 | 66 |
| comparison | 42.1 F | 42.1 F | 42 | F | 8 | 76 | 32 | 66 |

Design engine 1.3.0. Score is the mean of the rounded desktop (1440x900) and mobile (375x812) scores; buckets are 0 to 100. The engine scores against Material 3 conventions and this app does not use Material, so a radius or target-size rule is advisory unless it is also a WCAG failure.

## UX deterministic

| Screen | Rule findings | P1 | P2 | P3 | Probe findings | Design |
|---|---|---|---|---|---|---|
| empty-desktop | 6 | 3 | 3 | 0 | 0 | 54.7 |
| empty-mobile | 6 | 3 | 3 | 0 | 0 | 54.7 |
| debts-open-desktop | 6 | 3 | 3 | 0 | 0 | 54.7 |
| debts-open-mobile | 6 | 3 | 3 | 0 | 0 | 54.7 |
| results-desktop | 9 | 4 | 5 | 0 | 1 | 39.7 |
| results-mobile | 9 | 4 | 5 | 0 | 0 | 39.7 |
| comparison-desktop | 8 | 4 | 4 | 0 | 1 | 42.1 |
| comparison-mobile | 8 | 4 | 4 | 0 | 0 | 42.1 |

Distinct findings, with how many screens show each:

- P1 No @media (prefers-reduced-motion: reduce) rule found (8 screens)
- P1 2 pointer target(s) below the WCAG 2.5.8 minimum of 24×24px at 1440px wide (2… (1 screen)
- P1 4 pointer target(s) below the WCAG 2.5.8 minimum of 24×24px at 1440px wide (4… (1 screen)
- P1 2 tap target(s) below the WCAG 2.5.8 minimum of 24×24px at 375px wide (2 unde… (1 screen)
- P1 4 tap target(s) below the WCAG 2.5.8 minimum of 24×24px at 375px wide (4 unde… (1 screen)
- P1 7 to 14 text node(s) below WCAG contrast (4.5:1 normal / 3:1 large). (8 screens)
- P1 1 transition(s) animate layout props (width/height/top/left/margin) (8 screens)
- P2 1 border-radius value(s) off the 7-step scale (0/4/8/12/16/28/full). (4 screens)
- P2 1 heading-order jump(s) (e.g (2 screens)
- P2 Missing landmark(s): nav. (8 screens)
- P2 1 to 14 pointer target(s) smaller than M3's comfortable 48×48px at 1440px wide (4 screens)
- P2 7 to 14 reading-copy text node(s) below 16px (or any text below 11px). (8 screens)
- P2 1 to 13 tap target(s) smaller than M3's comfortable 48×48px at 375px wide (4 screens)
- P3 Primary controls show no hover feedback (2 screens)

These are rule findings only. UX scores come from the AI review, which reads ux/<screen>.jpg and ux/<screen>.dom.json and writes ux/ai/<screen>.json; then `node lib/merge-ux.mjs <results>/ux` scores and merges them.

## Responsive overflow

| State | 320 | 375 | 768 | 1024 | 1440 |
|---|---|---|---|---|---|
| empty | ok, 912 px | ok, 912 px | ok, 1024 px | ok, 869 px | ok, 900 px |
| debts-open | ok, 1237 px | ok, 1237 px | ok, 1145 px | ok, 1145 px | ok, 1145 px |
| results | ok, 1450 px | ok, 1358 px | ok, 1269 px | ok, 1269 px | ok, 1269 px |
| comparison | ok, 1927 px | ok, 1842 px | ok, 1694 px | ok, 1213 px | ok, 1213 px |

0 of 20 pages scroll sideways. Each cell: horizontal overflow (document scrollWidth beyond the viewport), then page height. Full-page screenshots are in responsive/.

## INP probe

| CPU | Loans | Runs | typeSalary5 | pickCity | submit | editRent | openCompare | typeSalaryB5 | pickCityB | submitCompare |
|---|---|---|---|---|---|---|---|---|---|---|
| 1x | 1 | 2 | 48 (82) | 16 (23) | 16 (37) | 368 (50) | 16 (22) | 16 (17) | 16 (22) | 16 (39) |
| 4x | 1 | 2 | 80 (145) | 24 (93) | 32 (182) | 272 (75) | 24 (82) | 16 (60) | 16 (87) | 24 (130) |

Each cell: the worst Event Timing interaction in ms that started inside the step, then main-thread task ms in parentheses, the higher of the runs. 0 means no interaction reached 16 ms. The page stops scrolling before every step and each field is centred before typing, so no click lands mid-scroll or on the edge of the viewport.

## What a borrower sees and when

| Scenario | First paint | Real content | Readable | LCP (in page) |
|---|---|---|---|---|
| First visit | 1580 ms | 2949 ms | 2949 ms | 3016 ms |
| Returning, one saved offer | 1664 ms | 3050 ms | 3050 ms | 3464 ms |

One cold load per scenario, each in a fresh browser, on slow 4G and 4x CPU applied for real with devtools throttling, at 412x823 and DPR 1.75; ms from navigation start. First paint is Paint Timing's first-paint, the skeleton here. Real content is the first frame with `main h1` and no skeleton, readable the first frame with the first `.rise` block fully faded in. FCP and the other marks are in readable.json.

Lighthouse's simulated LCP sees only the skeleton for this app (2129 ms on the empty mobile page in this run), so the Scoreboard's LCP is not when a borrower can read anything: the Readable column is.

## Site tools

| Tool | Result |
|---|---|
| header-check | score 40: 4 good, 1 warnings, 5 missing |
| meta-validate | score 67: 10 good, 3 warnings, 2 missing |
| structured-data | 0 schemas, 0 errors, 0 warnings |
| sitemap-validate | not found (Sitemap not found at https://offer-lab-ivory.vercel.app/sitemap.xml. HTTP 404) |
| redirect-check | 0 redirects, final status 200: No redirects detected. URL resolves directly. |
| broken-links | 11 links, 0 broken, 0 redirects, 0 errors, 0 timeouts |
| webmcp-check | AI readiness 0 |
