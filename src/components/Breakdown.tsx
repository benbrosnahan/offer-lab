"use client";

import { Offer, OfferAnalysis } from "@/types";
import AmountField from "@/components/AmountField";
import { ESSENTIAL_PARTS, MAX_ROOMMATES, RENT_AS_OF } from "@/data/cities";
import { ELECTRICITY_YEAR } from "@/data/utilities";
import { TAX_YEAR } from "@/data/taxes";
import { cn, formatCurrency } from "@/lib/utils";

const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AR: "Arkansas", AZ: "Arizona", CA: "California", CO: "Colorado",
  CT: "Connecticut", DC: "D.C.", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", IA: "Iowa", ID: "Idaho", IL: "Illinois", IN: "Indiana", KS: "Kansas",
  KY: "Kentucky", LA: "Louisiana", MA: "Massachusetts", MD: "Maryland", MI: "Michigan",
  MN: "Minnesota", MO: "Missouri", NC: "North Carolina", NE: "Nebraska", NM: "New Mexico",
  NV: "Nevada", NY: "New York", OH: "Ohio", OK: "Oklahoma", OR: "Oregon",
  PA: "Pennsylvania", RI: "Rhode Island", TN: "Tennessee", TX: "Texas", UT: "Utah",
  VA: "Virginia", VT: "Vermont", WA: "Washington", WI: "Wisconsin",
};

interface Props {
  analysis: OfferAnalysis;
  /** "a" or "b": keeps field ids unique when two breakdowns are on screen. */
  slot: "a" | "b";
  onUpdate: (updates: Partial<Offer>) => void;
  heading?: string;
  onRemove?: () => void;
}

export default function Breakdown({ analysis, slot, onUpdate, heading, onRemove }: Props) {
  const { tax, city } = analysis;
  const id = (name: string) => `${name}-${slot}`;
  const monthly = (n: number) => n / 12;
  const taxesMonthly = monthly(tax.gross) - tax.takeHomeMonthly;
  const stateName = STATE_NAMES[city.state] ?? city.state;
  const parts = city.mit.map((v) => Math.round(v / 12));
  const short = analysis.discretionary < 0;

  return (
    <section
      aria-labelledby={id("breakdown")}
      className="rounded-3xl bg-card ring-1 ring-border card-soft"
    >
      <div className="flex items-start justify-between gap-3 px-5 pt-5 sm:px-6">
        <h2 id={id("breakdown")} className="font-display text-xl font-bold leading-tight text-foreground">
          {heading ?? "Your month, line by line"}
        </h2>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="-mr-2 -mt-1 inline-flex min-h-10 items-center rounded-full px-3 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            Remove
          </button>
        )}
      </div>

      <div className="mt-2 divide-y divide-border">
        <Row label="Pay before tax" note={`${formatCurrency(tax.gross)} a year`}>
          <div className="tabular text-base font-semibold text-foreground">
            {formatCurrency(monthly(tax.gross))}
          </div>
        </Row>

        <div className="px-5 py-3 sm:px-6">
          <details className="group">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
              <span className="text-base text-foreground">
                Taxes and payroll
                <span className="block text-sm font-semibold text-foreground underline decoration-border-strong underline-offset-4 group-open:hidden">
                  Show the math
                </span>
                <span className="hidden text-sm font-semibold text-foreground underline decoration-border-strong underline-offset-4 group-open:block">
                  Hide the math
                </span>
              </span>
              <span className="tabular text-base font-semibold text-foreground">
                -{formatCurrency(taxesMonthly)}
              </span>
            </summary>
            <ul className="mt-2 space-y-1.5 rounded-2xl bg-muted p-4 text-sm text-soft">
              <MathLine label="Federal income tax" value={monthly(tax.federalTax)} />
              <MathLine label="Social Security and Medicare" value={monthly(tax.fica)} />
              <MathLine
                label={tax.stateTax > 0 ? `${stateName} income tax` : `${stateName} income tax (none on wages)`}
                value={monthly(tax.stateTax)}
              />
              {tax.localTax > 0 && <MathLine label={`${city.name} local tax`} value={monthly(tax.localTax)} />}
              {tax.payrollLines.map((l) => (
                <MathLine key={l.label} label={l.label} value={monthly(l.amount)} />
              ))}
              <li className="pt-2 text-muted-foreground">
                {(tax.effectiveRate * 100).toFixed(1)}% of your pay. {TAX_YEAR} rules, single filer, standard
                deduction. Before any 401(k) or other pre-tax benefits your employer takes out.
              </li>
            </ul>
          </details>
        </div>

        <Row label="Take-home pay" strong>
          <div className="tabular text-base font-bold text-foreground">
            {formatCurrency(tax.takeHomeMonthly)}
          </div>
        </Row>

        <Roommates
          name={id("roommates")}
          value={analysis.roommates}
          onChange={(n) => onUpdate({ roommates: n || undefined })}
        />

        <EditRow
          id={id("rent")}
          label={analysis.roommates ? "Your rent" : "Rent"}
          note={
            analysis.rentIsOverride
              ? "Your number"
              : analysis.roommates
                ? `Your ${SHARE[analysis.people]} of a typical ${analysis.people}-bedroom. Zumper ${
                    analysis.people === 2 && city.rent2 ? "2-bedroom median" : "median scaled by HUD"
                  }, ${RENT_AS_OF}.`
                : `Median 1-bedroom listing, Zumper, ${city.rentSource === "report" ? RENT_AS_OF : "November 2026"}. Sharing a place? Set roommates above or put in your part.`
          }
          value={analysis.rent}
          onChange={(v) => onUpdate({ rentOverride: v })}
          onReset={analysis.rentIsOverride ? () => onUpdate({ rentOverride: undefined }) : undefined}
          resetLabel={`Use the ${analysis.roommates ? "estimate" : "median"}, ${formatCurrency(analysis.rentEstimate)}`}
        />

        <EditRow
          id={id("electricity")}
          label="Electricity"
          note={
            analysis.utilitiesIsOverride
              ? "Your number"
              : `Average home's bill in ${stateName}, EIA ${ELECTRICITY_YEAR}${
                  analysis.people > 1 ? `, split ${analysis.people} ways` : ""
                }. Gas or heat not included.`
          }
          value={analysis.utilities}
          onChange={(v) => onUpdate({ utilitiesOverride: v })}
          onReset={analysis.utilitiesIsOverride ? () => onUpdate({ utilitiesOverride: undefined }) : undefined}
          resetLabel={`Use the EIA average, ${formatCurrency(analysis.utilitiesEstimate)}`}
        />

        <EditRow
          id={id("essentials")}
          label="Everyday costs"
          note={analysis.necessitiesIsOverride ? "Your number" : `MIT estimate for one adult in ${city.county}.`}
          value={analysis.necessities}
          onChange={(v) => onUpdate({ necessitiesOverride: v })}
          onReset={
            analysis.necessitiesIsOverride ? () => onUpdate({ necessitiesOverride: undefined }) : undefined
          }
          resetLabel="Use the MIT estimate"
        >
          <details className="group mt-1">
            <summary className="inline-flex min-h-10 cursor-pointer list-none items-center text-sm font-semibold text-foreground underline decoration-border-strong underline-offset-4 [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">What is in it</span>
              <span className="hidden group-open:inline">Hide</span>
            </summary>
            <ul className="mt-1 space-y-1.5 rounded-2xl bg-muted p-4 text-sm text-soft">
              {ESSENTIAL_PARTS.map((name, i) => (
                <MathLine key={name} label={name} value={parts[i]} plain />
              ))}
              <li className="pt-2 text-muted-foreground">
                Electricity is its own line, under the rent. Gas or heating bills are not counted.
                Health care is your share of premiums plus typical out-of-pocket costs.
              </li>
            </ul>
          </details>
        </EditRow>

        <EditRow
          id={id("loan")}
          label="Student loan"
          value={analysis.loanPayment}
          onChange={(v) => onUpdate({ loanPayment: v })}
        />

        <EditRow
          id={id("other")}
          label="Other bills"
          value={analysis.otherFixed}
          onChange={(v) => onUpdate({ otherFixed: v })}
        />

        <div className="flex items-center justify-between gap-3 rounded-b-3xl bg-muted px-5 py-4 sm:px-6">
          <div className="text-base font-semibold text-foreground">{short ? "Short each month" : "Left each month"}</div>
          <div
            className={cn(
              "tabular font-display text-2xl font-bold",
              short ? "text-brand-orange" : "text-foreground"
            )}
          >
            {formatCurrency(analysis.discretionary)}
          </div>
        </div>
      </div>
    </section>
  );
}

const SHARE: Record<number, string> = { 2: "half", 3: "third", 4: "quarter" };
const ROOMMATE_OPTIONS = Array.from({ length: MAX_ROOMMATES + 1 }, (_, n) => n);

/**
 * Who splits the rent: native radios drawn as one pill track, so arrow keys,
 * labels and screen readers all work the way they do for any radio group.
 */
function Roommates({ name, value, onChange }: { name: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="px-5 py-3 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <span id={`${name}-label`} className="text-base text-foreground">
          Roommates
        </span>
        <div
          role="radiogroup"
          aria-labelledby={`${name}-label`}
          aria-describedby={`${name}-note`}
          className="flex w-full rounded-full bg-muted p-1 ring-1 ring-inset ring-border sm:w-auto"
        >
          {ROOMMATE_OPTIONS.map((n) => (
            <label
              key={n}
              className={cn(
                "relative inline-flex min-h-10 min-w-12 flex-1 cursor-pointer items-center justify-center rounded-full px-4 text-base font-semibold transition-colors",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
                value === n ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
              )}
            >
              <input
                type="radio"
                name={name}
                value={n}
                checked={value === n}
                onChange={() => onChange(n)}
                className="absolute inset-0 m-0 cursor-pointer appearance-none rounded-full opacity-0"
              />
              {n === 0 ? "None" : n}
            </label>
          ))}
        </div>
      </div>
      <p id={`${name}-note`} className="mt-1 text-sm leading-snug text-muted-foreground">
        {value === 0
          ? "Living alone. Pick a number to split rent and electricity evenly."
          : `Rent and electricity split ${value + 1} ways, one bedroom each.`}
      </p>
    </div>
  );
}

function Row({
  label,
  note,
  strong,
  children,
}: {
  label: string;
  note?: string;
  strong?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-3 px-5 py-3 sm:px-6">
      <div>
        <span className={cn("block text-base text-foreground", strong && "font-semibold")}>{label}</span>
        {note && <span className="block text-sm text-muted-foreground">{note}</span>}
      </div>
      {children}
    </div>
  );
}

function EditRow({
  id,
  label,
  note,
  value,
  onChange,
  onReset,
  resetLabel,
  children,
}: {
  id: string;
  label: string;
  note?: string;
  value: number;
  onChange: (n: number) => void;
  onReset?: () => void;
  resetLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="px-5 py-3 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <label id={`${id}-label`} htmlFor={id} className="min-w-0 text-base text-foreground">
          {label}
        </label>
        <AmountField
          id={id}
          value={value}
          onChange={onChange}
          labelledBy={`${id}-label`}
          describedBy={note ? `${id}-note` : undefined}
        />
      </div>
      {note && (
        <p id={`${id}-note`} className="mt-1 text-sm leading-snug text-muted-foreground">
          {note}
        </p>
      )}
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-1 inline-flex min-h-10 items-center text-sm font-semibold text-foreground underline decoration-border-strong underline-offset-4 hover:decoration-primary"
        >
          {resetLabel}
        </button>
      )}
      {children}
    </div>
  );
}

function MathLine({ label, value, plain }: { label: string; value: number; plain?: boolean }) {
  return (
    <li className="flex items-baseline justify-between gap-3">
      <span>{label}</span>
      <span className="tabular font-semibold text-foreground">
        {plain ? "" : "-"}
        {formatCurrency(value)}
      </span>
    </li>
  );
}
