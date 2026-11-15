# Offer Lab

**Live: [offer-lab-ivory.vercel.app](https://offer-lab-ivory.vercel.app)**

You got a job offer. Is the number good? Offer Lab converts a salary into what it actually
means in a specific city: take-home after federal, state and city tax and payroll premiums,
a typical rent (alone or split with roommates), electricity and everyday costs, and what is
left over each month.

## Why it works this way

A salary is not comparable across cities and almost every new graduate compares them anyway.
The interesting output is not take-home pay, it is the monthly surplus, because that is the
number that determines whether the offer is livable.

Two decisions worth calling out:

- **The math is one tap away, not a footnote.** Every assumption behind the number opens in
  place under the figure it explains. A tool that produces a confident dollar figure from
  hidden assumptions is worse than no tool, because people act on it.
- **The results are editable in place.** The city rent estimate will be wrong for a specific
  person's situation, so roommates, rent, electricity, everyday costs, loans and bills are fields: change one and the
  verdict moves, rather than distrusting the whole output because one input was off.
- **One picture: the paycheck bar.** A month of pay as one bar, split into taxes, rent,
  everyday costs, bills and what is left. A shortfall runs past the end of the pay, striped.

## How it is built

- Next.js App Router, TypeScript, Tailwind 4, CSS-only motion
- `src/lib/calculator.ts` for tax and budget math; `src/data/taxes.ts` for 2026 state, city
  and payroll rules (with sources); `src/data/cities.ts` for rent (Zumper, October 2026, with
  HUD FY2026 Fair Market Rents for shared places) and everyday costs (MIT Living Wage
  Calculator, by county); `src/data/utilities.ts` for electricity (EIA, 2024, by state)
- Client side only, shareable by URL; the offer is kept in this tab's session storage
- `audits/` holds the audit kit: Playwright tests with an independent money oracle, and the
  scans (`node run.mjs --url <url> --runs 1`)

## Run it

```bash
npm install
npm run dev
```

Check it:

```bash
npm run lint && npm run typecheck && npm run build
cd audits && npm ci && npm run setup && npx playwright test
```

Part of [Cense](https://cense.beehiiv.com).
