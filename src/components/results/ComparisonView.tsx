"use client";

import { motion } from "framer-motion";
import { Offer, OfferAnalysis } from "@/types";
import { formatCurrency } from "@/lib/utils";
import BudgetBreakdown from "./BudgetBreakdown";

interface Props {
  a: OfferAnalysis;
  b: OfferAnalysis;
  onUpdateA: (updates: Partial<Offer>) => void;
  onUpdateB: (updates: Partial<Offer>) => void;
  onClearB: () => void;
}

export default function ComparisonView({
  a,
  b,
  onUpdateA,
  onUpdateB,
  onClearB,
}: Props) {
  const aWins = a.discretionary >= b.discretionary;
  const delta = Math.abs(a.discretionary - b.discretionary);
  const winner = aWins ? a : b;
  const loser = aWins ? b : a;
  const winnerLabel = aWins ? "Offer A" : "Offer B";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Verdict banner */}
      <div className="rounded-2xl border-2 border-navy bg-navy text-white p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-200">
          The verdict
        </p>
        <h2 className="mt-2 text-2xl sm:text-3xl font-bold leading-tight">
          {winnerLabel} leaves you with{" "}
          <span className="tabular text-emerald-300">
            {formatCurrency(delta)}/month more
          </span>
        </h2>
        <p className="mt-3 text-sm text-blue-100 leading-relaxed">
          {winner.city.name} at {formatCurrency(winner.tax.gross)} beats{" "}
          {loser.city.name} at {formatCurrency(loser.tax.gross)} by{" "}
          {formatCurrency(delta * 12)}/year
          {winner.tax.gross < loser.tax.gross && " — even though the salary is lower"}
          .
        </p>
      </div>

      {/* Side-by-side full breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-4">
        <BudgetBreakdown
          analysis={a}
          offerLabel="Offer A"
          isWinner={aWins}
          showSalarySubtitle
          onUpdateRent={(v) => onUpdateA({ rentOverride: v })}
          onResetRent={() => onUpdateA({ rentOverride: undefined })}
          onUpdateNecessities={(v) => onUpdateA({ necessitiesOverride: v })}
          onResetNecessities={() =>
            onUpdateA({ necessitiesOverride: undefined })
          }
          onUpdateLoan={(v) => onUpdateA({ loanPayment: v })}
          onUpdateOther={(v) => onUpdateA({ otherFixed: v })}
        />
        <BudgetBreakdown
          analysis={b}
          offerLabel="Offer B"
          isWinner={!aWins}
          showSalarySubtitle
          onRemove={onClearB}
          onUpdateRent={(v) => onUpdateB({ rentOverride: v })}
          onResetRent={() => onUpdateB({ rentOverride: undefined })}
          onUpdateNecessities={(v) => onUpdateB({ necessitiesOverride: v })}
          onResetNecessities={() =>
            onUpdateB({ necessitiesOverride: undefined })
          }
          onUpdateLoan={(v) => onUpdateB({ loanPayment: v })}
          onUpdateOther={(v) => onUpdateB({ otherFixed: v })}
        />
      </div>

      {/* Discretionary income summary */}
      <div className="grid grid-cols-2 gap-4">
        <DiscretionarySummary
          label="Offer A"
          analysis={a}
          isWinner={aWins}
        />
        <DiscretionarySummary
          label="Offer B"
          analysis={b}
          isWinner={!aWins}
        />
      </div>
    </motion.div>
  );
}

function DiscretionarySummary({
  label,
  analysis,
  isWinner,
}: {
  label: string;
  analysis: OfferAnalysis;
  isWinner: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 text-center">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label} — Left over each month
      </p>
      <p
        className={`mt-2 text-3xl sm:text-4xl font-bold tabular ${
          analysis.discretionary >= 0 ? "text-emerald-700" : "text-red-700"
        }`}
      >
        {analysis.discretionary >= 0 ? "+" : ""}
        {formatCurrency(analysis.discretionary)}
      </p>
      <p className="mt-1 text-xs font-semibold text-slate-500">
        {analysis.verdict.label}
        {isWinner && " ✓"}
      </p>
    </div>
  );
}
