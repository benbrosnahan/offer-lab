"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NumberInput from "@/components/shared/NumberInput";
import CityPicker from "@/components/shared/CityPicker";
import { Offer } from "@/types";
import { formatDollarInput, parseDollarInput } from "@/lib/utils";

interface Props {
  initial?: Partial<Offer>;
  onSubmit: (offer: Offer) => void;
  submitLabel?: string;
  compact?: boolean;
}

export default function OfferForm({
  initial,
  onSubmit,
  submitLabel = "See my results",
  compact = false,
}: Props) {
  const [salary, setSalary] = useState(
    initial?.salary ? formatDollarInput(String(initial.salary)) : ""
  );
  const [cityId, setCityId] = useState(initial?.cityId ?? "");
  const [showOptional, setShowOptional] = useState(false);
  const [loanPayment, setLoanPayment] = useState(
    initial?.loanPayment ? formatDollarInput(String(initial.loanPayment)) : ""
  );
  const [otherFixed, setOtherFixed] = useState(
    initial?.otherFixed ? formatDollarInput(String(initial.otherFixed)) : ""
  );

  const salaryNum = parseDollarInput(salary);
  const canSubmit = salaryNum > 0 && cityId.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      salary: salaryNum,
      cityId,
      loanPayment: parseDollarInput(loanPayment),
      otherFixed: parseDollarInput(otherFixed),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <NumberInput
        id="salary"
        label="Annual salary"
        helperText="Your base offer before taxes — what's in the offer letter."
        value={salary}
        onChange={(v) => setSalary(formatDollarInput(v))}
        placeholder="e.g. 65,000"
        prefix="$"
      />

      <CityPicker
        id="city"
        label="City"
        helperText="Where you'll be living and working."
        value={cityId}
        onChange={setCityId}
      />

      {!compact && (
        <div>
          {!showOptional ? (
            <button
              type="button"
              onClick={() => setShowOptional(true)}
              className="text-sm text-navy hover:text-navy-hover font-medium flex items-center gap-1 transition-colors"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add monthly debts (optional)
            </button>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4 overflow-hidden"
              >
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                  <p className="text-xs text-slate-500 leading-snug">
                    Adding fixed monthly costs makes your results more
                    accurate. Skip if you&apos;re not sure — we&apos;ll use
                    defaults.
                  </p>
                  <NumberInput
                    id="loan-payment"
                    label="Monthly student loan payment"
                    helperText="From your loan servicer or Loan Lab. Leave blank if none."
                    value={loanPayment}
                    onChange={(v) => setLoanPayment(formatDollarInput(v))}
                    placeholder="e.g. 318"
                    prefix="$"
                  />
                  <NumberInput
                    id="other-fixed"
                    label="Other fixed monthly costs"
                    helperText="Car payment, subscriptions, gym, etc. Excludes rent and food."
                    value={otherFixed}
                    onChange={(v) => setOtherFixed(formatDollarInput(v))}
                    placeholder="e.g. 250"
                    prefix="$"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full py-4 rounded-xl bg-navy text-white text-sm font-semibold transition-colors hover:bg-navy-hover disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitLabel}
      </button>
    </form>
  );
}
