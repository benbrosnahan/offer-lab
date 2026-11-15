import { OfferAnalysis } from "@/types";
import { cn, formatCurrency } from "@/lib/utils";

interface Segment {
  key: string;
  label: string;
  amount: number;
  className: string;
}

/** One month of pay, split the way the money actually leaves. */
export function paycheckSegments(a: OfferAnalysis): Segment[] {
  const monthlyGross = a.tax.gross / 12;
  const taxes = monthlyGross - a.tax.takeHomeMonthly;
  const bills = a.loanPayment + a.otherFixed;
  const segments: Segment[] = [
    { key: "tax", label: "Taxes and payroll", amount: taxes, className: "bg-seg-tax" },
    { key: "rent", label: "Rent and electricity", amount: a.rent + a.utilities, className: "bg-seg-rent" },
    { key: "essentials", label: "Everyday costs", amount: a.necessities, className: "bg-seg-essentials" },
  ];
  if (bills > 0) {
    segments.push({
      key: "bills",
      label: "Loan and other bills",
      amount: bills,
      className: "bg-seg-bills ring-1 ring-inset ring-input",
    });
  }
  if (a.discretionary >= 0) {
    segments.push({
      key: "left",
      label: "Left over",
      amount: a.discretionary,
      className: "bg-mark ring-1 ring-inset ring-mark-strong",
    });
  }
  return segments;
}

/** The bar's full width in dollars: the monthly pay, plus any shortfall past it. */
export function paycheckExtent(a: OfferAnalysis): number {
  return a.tax.gross / 12 + Math.max(0, -a.discretionary);
}

interface Props {
  analysis: OfferAnalysis;
  /** Dollars the full width stands for; pass the same value to bars you compare. */
  scale?: number;
  /** Shown above the bar, e.g. the city in a comparison. */
  title?: string;
  /** Leave the legend out (a comparison shows it once). */
  compactLegend?: boolean;
}

/**
 * The signature element: the month's pay as one bar, split into taxes, rent
 * and electricity,
 * everyday costs, bills and what is left. A shortfall runs past the end of
 * the pay, striped. The list underneath carries the same figures in text, so
 * the bar itself is hidden from screen readers.
 */
export default function PaycheckBar({ analysis, scale, title, compactLegend }: Props) {
  const segments = paycheckSegments(analysis);
  const monthlyGross = analysis.tax.gross / 12;
  const shortBy = Math.max(0, -analysis.discretionary);
  // The legend lists the shortfall too; in the bar it is the striped stretch
  // of costs that runs past the end of the pay.
  const legend = shortBy
    ? [...segments, { key: "short", label: "Short", amount: shortBy, className: "seg-short" }]
    : segments;
  const extent = scale ?? paycheckExtent(analysis);
  const pct = (n: number) => `${Math.max(0, (n / extent) * 100)}%`;
  const short = analysis.discretionary < 0;

  return (
    <figure className="m-0">
      <figcaption className="flex items-baseline justify-between gap-3 text-sm text-muted-foreground">
        <span>
          {title ? <span className="font-semibold text-foreground">{title}: </span> : null}
          {formatCurrency(monthlyGross)} a month before tax
        </span>
      </figcaption>

      <div aria-hidden className={cn("relative mt-2", short && "mb-8")}>
        <div className="bar-grow relative flex h-11 w-full gap-[2px] overflow-hidden rounded-xl">
          {segments.map((s) => (
            <div
              key={s.key}
              className={cn("h-full shrink-0 first:rounded-l-xl last:rounded-r-xl", s.className)}
              style={{ width: pct(s.amount) }}
            />
          ))}
          {short && (
            <div
              className="seg-short-over absolute inset-y-0 rounded-r-xl"
              style={{ left: pct(monthlyGross), width: pct(shortBy) }}
            />
          )}
        </div>
        {short && (
          <div
            className="absolute -top-1 bottom-[-4px] w-[2px] bg-foreground"
            style={{ left: `calc(${pct(monthlyGross)} - 1px)` }}
          >
            <span
              className={cn(
                "absolute top-full mt-0.5 whitespace-nowrap text-xs font-semibold text-foreground",
                monthlyGross / extent > 0.4 ? "right-1.5" : "left-1.5"
              )}
            >
              Your pay ends here
            </span>
          </div>
        )}
      </div>

      {!compactLegend && (
        <ul className="mt-4 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
          {legend.map((s) => (
            <li key={s.key} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-soft">
                <span aria-hidden className={cn("inline-block h-3 w-3 shrink-0 rounded-[4px]", s.className)} />
                {s.label}
              </span>
              <span
                className={cn(
                  "tabular font-semibold",
                  s.key === "short" ? "text-brand-orange" : "text-foreground"
                )}
              >
                {formatCurrency(s.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}
