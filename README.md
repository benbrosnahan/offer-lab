# Offer Lab

**Live: [offer-lab-ivory.vercel.app](https://offer-lab-ivory.vercel.app)**

You got a job offer. Is the number good? Offer Lab converts a salary into what it actually
means in a specific city: take-home after federal and state tax, real rent, and what is left
over each month.

## Why it works this way

A salary is not comparable across cities and almost every new graduate compares them anyway.
The interesting output is not take-home pay, it is the monthly surplus, because that is the
number that determines whether the offer is livable.

Two decisions worth calling out:

- **The methodology is a popover, not a footnote.** Every assumption behind the number is one
  click away. A tool that produces a confident dollar figure from hidden assumptions is worse
  than no tool, because people act on it.
- **The results are editable in place.** The city rent estimate will be wrong for a specific
  person's situation, so they can overwrite it and watch the verdict change, rather than
  distrusting the whole output because one input was off.

## How it is built

- Next.js App Router, TypeScript, Tailwind, Framer Motion
- `src/lib/calculator.ts` for tax and budget math, `src/data/taxes.ts` for 2025 state and
  local income tax rules (with sources), `src/data/cities.ts` for cost of living
- 2025 federal, state, and local tax brackets; rent as of November 2025
- Client side only, shareable by URL, nothing stored

## Run it

```bash
npm install
npm run dev
```

Part of [Cense](https://cense.beehiiv.com).
