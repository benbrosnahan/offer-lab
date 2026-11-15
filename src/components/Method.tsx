import { CITIES, COSTS_AS_OF, NATIONAL_MEDIAN_RENT_1BR, RENT_AS_OF } from "@/data/cities";
import { LOCAL_TAX, STATE_PAYROLL, TAX_YEAR } from "@/data/taxes";
import { FEDERAL_STANDARD_DEDUCTION, SS_WAGE_BASE, VERDICT_BANDS } from "@/lib/calculator";
import { formatCurrency } from "@/lib/utils";

const cityTaxCount = Object.keys(LOCAL_TAX).length;
const payrollStates = Object.keys(STATE_PAYROLL).length;

const ITEMS: Array<{ title: string; body: React.ReactNode }> = [
  {
    title: "Taxes",
    body: (
      <>
        {TAX_YEAR} federal brackets and the {formatCurrency(FEDERAL_STANDARD_DEDUCTION)} standard
        deduction from the IRS. Social Security at 6.2% up to {formatCurrency(SS_WAGE_BASE)} and Medicare
        at 1.45%, plus 0.9% above $200,000. Each state&apos;s {TAX_YEAR} brackets, deductions and credits from
        its revenue department, and the income taxes of {cityTaxCount} cities. The paid-leave and
        disability premiums {payrollStates} states take from paychecks, at the most an employer may
        withhold. It assumes you file single, live and work in the city, take the standard deduction and
        have no other income.
      </>
    ),
  },
  {
    title: "Rent",
    body: (
      <>
        The median asking rent for a 1-bedroom listing in the city, from Zumper&apos;s National Rent Report
        for {RENT_AS_OF} (national median {formatCurrency(NATIONAL_MEDIAN_RENT_1BR)}). For ten smaller
        cities that report leaves out, Zumper&apos;s 30-day city average from November 2026. New listings
        run above what current tenants pay, and most do not include utilities. Sharing a place? Put in
        your part.
      </>
    ),
  },
  {
    title: "Everyday costs",
    body: (
      <>
        The MIT Living Wage Calculator&apos;s budget for one adult in the city&apos;s county (data from{" "}
        {COSTS_AS_OF}): food, health care, getting around, phone and internet, and clothing and personal
        items. Housing and child care are left out, and so is MIT&apos;s line for entertainment and
        community, since that is your call. Utilities are not counted yet.
      </>
    ),
  },
  {
    title: "The verdict",
    body: (
      <>
        Short: costs run past take-home. Little left: {formatCurrency(VERDICT_BANDS.lean)} to{" "}
        {formatCurrency(VERDICT_BANDS.comfortable - 1)} a month. Some room:{" "}
        {formatCurrency(VERDICT_BANDS.comfortable)} to {formatCurrency(VERDICT_BANDS.strong - 1)}. Room to
        save: {formatCurrency(VERDICT_BANDS.strong)} or more. These are rough bands, not advice.
        Your real rent and spending decide where you land.
      </>
    ),
  },
  {
    title: "Not included",
    body: (
      <>
        401(k) contributions and other pre-tax benefits, bonuses and equity, itemized deductions, credits
        for low incomes, living in one city and working in another, and small hourly payroll fees in
        Washington and Oregon. This is an estimate for planning, not tax or financial advice.
      </>
    ),
  },
];

/** Server-rendered, so the method is in the page for every reader and crawler. */
export default function Method() {
  return (
    <footer className="mt-16 w-full px-4 pb-16 sm:px-6">
      <section aria-labelledby="method" className="mx-auto max-w-2xl border-t border-border pt-8">
        <h2 id="method" className="font-display text-2xl font-bold text-foreground">
          How the numbers work
        </h2>
        <p className="mt-2 text-base text-soft">
          Every figure is an estimate you can change. Here is where each one comes from, for{" "}
          {CITIES.length} US cities.
        </p>
        <div className="mt-5 divide-y divide-border rounded-3xl bg-card ring-1 ring-border">
          {ITEMS.map((item) => (
            <details key={item.title} className="group px-5 sm:px-6">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 text-base font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                {item.title}
                <svg
                  aria-hidden
                  className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <p className="pb-5 text-base leading-relaxed text-soft">{item.body}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Made by{" "}
          <a href="https://cense.beehiiv.com" className="font-semibold text-foreground underline underline-offset-2">
            Cense
          </a>
          , free money tools for students. This tab keeps your offer until you close it. Sources checked
          November 2026.
        </p>
      </section>
    </footer>
  );
}
