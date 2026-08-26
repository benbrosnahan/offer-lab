"use client";

import { motion } from "framer-motion";
import { OfferAnalysis, VerdictTier } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  analysis: OfferAnalysis;
}

const TIER_STYLES: Record<
  VerdictTier,
  {
    bg: string;
    border: string;
    badge: string;
    badgeText: string;
    numberColor: string;
    icon: React.ReactNode;
  }
> = {
  tight: {
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100",
    badgeText: "text-red-800",
    numberColor: "text-red-700",
    icon: (
      <svg
        className="w-5 h-5 text-red-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
  },
  lean: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100",
    badgeText: "text-amber-900",
    numberColor: "text-amber-700",
    icon: (
      <svg
        className="w-5 h-5 text-amber-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  comfortable: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badge: "bg-emerald-100",
    badgeText: "text-emerald-900",
    numberColor: "text-emerald-700",
    icon: (
      <svg
        className="w-5 h-5 text-emerald-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
  },
  strong: {
    bg: "bg-green-50",
    border: "border-green-300",
    badge: "bg-green-100",
    badgeText: "text-green-900",
    numberColor: "text-green-700",
    icon: (
      <svg
        className="w-5 h-5 text-green-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
  },
};

export default function VerdictHero({ analysis }: Props) {
  const style = TIER_STYLES[analysis.verdict.tier];
  const isPositive = analysis.discretionary >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "rounded-2xl border-2 p-6 sm:p-8",
        style.bg,
        style.border
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",
            style.badge
          )}
        >
          {style.icon}
          <span
            className={cn("text-xs font-bold uppercase tracking-wider", style.badgeText)}
          >
            {analysis.verdict.label}
          </span>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-600">After all your essentials:</p>
      <div className="mt-1">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={cn(
            "text-5xl sm:text-6xl font-bold tabular",
            style.numberColor
          )}
        >
          {isPositive ? "+" : ""}
          {formatCurrency(analysis.discretionary)}
        </motion.div>
        <p className="mt-1 text-sm text-slate-500 font-medium">
          left over each month
        </p>
      </div>
      <p className="mt-5 text-sm text-slate-700 leading-relaxed">
        {analysis.verdict.description}
      </p>
    </motion.div>
  );
}
