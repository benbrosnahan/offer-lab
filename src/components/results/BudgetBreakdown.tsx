"use client";

import { motion } from "framer-motion";
import { OfferAnalysis } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import MethodologyPopover from "./MethodologyPopover";
import EditableNumber from "./EditableNumber";

interface Props {
  analysis: OfferAnalysis;
  onUpdateRent: (n: number) => void;
  onResetRent: () => void;
  onUpdateNecessities: (n: number) => void;
  onResetNecessities: () => void;
  onUpdateLoan: (n: number) => void;
  onUpdateOther: (n: number) => void;
  /** Optional label shown above the standard header (e.g., "Offer A"). */
  offerLabel?: string;
  /** Show wins badge on this card. */
  isWinner?: boolean;
  /** Optional callback to remove this offer (e.g., "X" on Offer B). */
  onRemove?: () => void;
  /** When true, replaces "Where the money goes" with the salary + city subtitle. */
  showSalarySubtitle?: boolean;
}

export default function BudgetBreakdown({
  analysis,
  onUpdateRent,
  onResetRent,
  onUpdateNecessities,
  onResetNecessities,
  onUpdateLoan,
  onUpdateOther,
  offerLabel,
  isWinner,
  onRemove,
  showSalarySubtitle,
}: Props) {
  const {
    tax,
    rent,
    rentIsOverride,
    necessities,
    necessitiesIsOverride,
    loanPayment,
    otherFixed,
    totalMonthlyCosts,
    discretionary,
    city,
  } = analysis;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className={cn(
        "rounded-2xl bg-white border relative",
        isWinner ? "border-emerald-300 ring-1 ring-emerald-300" : "border-slate-200"
      )}
    >
      {isWinner && (
        <div className="absolute -top-2.5 left-5 inline-flex px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider z-10">
          Wins
        </div>
      )}
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 text-slate-300 hover:text-slate-600 transition-colors z-10"
          aria-label="Remove this offer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
        {offerLabel && (
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            {offerLabel}
          </p>
        )}
        {showSalarySubtitle ? (
          <>
            <h3 className="text-base font-bold text-slate-900">
              ${analysis.offer.salary.toLocaleString()} in {city.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any number with a pencil to override.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-sm font-bold text-slate-900">
              Where the money goes
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any number with a pencil to override with your own value.
            </p>
          </>
        )}
      </div>

      <div className="divide-y divide-slate-100">
        {/* Take-home — the starting point */}
        <Row label="Take-home pay" highlight>
          <MethodologyPopover
            title="Take-home pay"
            trigger={
              <span className="tabular font-bold text-slate-900">
                {formatCurrency(tax.takeHomeMonthly)}/mo
              </span>
            }
          >
            <p>
              Your <strong>{formatCurrency(tax.gross)}</strong> salary minus taxes:
            </p>
            <ul className="space-y-1 mt-2 pl-3">
              <li>
                Federal: <span className="tabular">{formatCurrency(tax.federalTax)}</span>
              </li>
              <li>
                FICA (SS + Medicare):{" "}
                <span className="tabular">{formatCurrency(tax.fica)}</span>
              </li>
              <li>
                {city.state} state tax:{" "}
                <span className="tabular">{formatCurrency(tax.stateTax)}</span>
              </li>
              {tax.localTax > 0 && (
                <li>
                  {city.name} local tax:{" "}
                  <span className="tabular">{formatCurrency(tax.localTax)}</span>
                </li>
              )}
            </ul>
            <p className="mt-2 text-slate-500">
              Effective tax rate: {(tax.effectiveRate * 100).toFixed(1)}%.
              Calculations use 2025 federal brackets with the $15,750 standard
              deduction, 2025 FICA rates, and Tax Foundation state effective
              rates. Assumes single filer, no other deductions.
            </p>
          </MethodologyPopover>
        </Row>

        <Row label={`Rent (1-bedroom in ${city.name})`}>
          <div className="flex items-center gap-2">
            <EditableNumber
              value={rent}
              onChange={onUpdateRent}
              onReset={onResetRent}
              isOverride={rentIsOverride}
            />
            <MethodologyPopover
              title={`Median rent in ${city.name}, ${city.state}`}
              trigger={<span className="sr-only">View source</span>}
            >
              <p>
                <strong>{formatCurrency(city.median1BR)}/month</strong> is the
                median rent for a 1-bedroom apartment in {city.name},{" "}
                {city.state}.
              </p>
              <p className="mt-2">
                Source: Zumper National Rent Report (November 2025) and
                Apartment List metro-level rent data (2025). National median 1BR
                rent is currently <span className="tabular">$1,501/month</span>.
              </p>
              <p className="mt-2 text-slate-500">
                This is the median — half of 1-bedroom rentals are cheaper,
                half are more expensive. Click the rent number to override with
                your actual rent.
              </p>
            </MethodologyPopover>
          </div>
        </Row>

        <Row label="Essentials (food, utilities, transit)">
          <div className="flex items-center gap-2">
            <EditableNumber
              value={necessities}
              onChange={onUpdateNecessities}
              onReset={onResetNecessities}
              isOverride={necessitiesIsOverride}
            />
            <MethodologyPopover
              title="Monthly essentials estimate"
              trigger={<span className="sr-only">View source</span>}
            >
              <p>
                We start with a national baseline of{" "}
                <strong>$1,200/month</strong> for essentials (food, utilities,
                transit, phone, personal care, healthcare premiums), then scale
                by {city.name}&apos;s cost-of-living index ({city.colIndex.toFixed(2)}× national average).
              </p>
              <p className="mt-2">
                Sources: MIT Living Wage Calculator (2024), BEA Regional Price
                Parities (2024), BLS Consumer Expenditure Survey.
              </p>
              <p className="mt-2 text-slate-500">
                Your actual spending will vary. Click to override with your
                real number.
              </p>
            </MethodologyPopover>
          </div>
        </Row>

        <Row label="Student loan payment">
          <EditableNumber
            value={loanPayment}
            onChange={onUpdateLoan}
            inline
          />
        </Row>

        <Row label="Other fixed costs">
          <EditableNumber
            value={otherFixed}
            onChange={onUpdateOther}
            inline
          />
        </Row>

        {/* Total costs */}
        <Row label="Total monthly costs" subtle>
          <span className="tabular font-semibold text-slate-900">
            −{formatCurrency(totalMonthlyCosts)}
          </span>
        </Row>

        {/* Bottom line */}
        <Row label="Left over each month" highlight>
          <span
            className={cn(
              "tabular font-bold",
              discretionary >= 0 ? "text-emerald-600" : "text-red-600"
            )}
          >
            {discretionary >= 0 ? "+" : ""}
            {formatCurrency(discretionary)}
          </span>
        </Row>
      </div>
    </motion.div>
  );
}

function Row({
  label,
  children,
  highlight,
  subtle,
}: {
  label: string;
  children: React.ReactNode;
  highlight?: boolean;
  subtle?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-5 py-3.5",
        highlight && "bg-slate-50/50",
        subtle && "bg-slate-50/30"
      )}
    >
      <span
        className={cn(
          "text-sm",
          highlight ? "font-semibold text-slate-900" : "text-slate-600"
        )}
      >
        {label}
      </span>
      <div className="text-sm">{children}</div>
    </div>
  );
}
