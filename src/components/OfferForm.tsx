"use client";

import { useState } from "react";
import MoneyInput from "@/components/MoneyInput";
import CityPicker from "@/components/CityPicker";
import { Offer } from "@/types";
import { formatDollarInput, parseDollarInput } from "@/lib/utils";

interface Props {
  /** Prefix for field ids, so two forms never share one. */
  idPrefix?: string;
  initial?: Partial<Offer>;
  onSubmit: (offer: Offer) => void;
  submitLabel?: string;
  /** Second offer: no loan and bills fields (they carry over from the first). */
  compact?: boolean;
  onCancel?: () => void;
}

const LOAN_DESK = "https://cense-loan-desk.vercel.app";

export default function OfferForm({
  idPrefix = "",
  initial,
  onSubmit,
  submitLabel = "See what is left",
  compact = false,
  onCancel,
}: Props) {
  const fmt = (n?: number) => (n ? formatDollarInput(String(n)) : "");
  const [salary, setSalary] = useState(fmt(initial?.salary));
  const [cityId, setCityId] = useState(initial?.cityId ?? "");
  const [loan, setLoan] = useState(fmt(initial?.loanPayment));
  const [other, setOther] = useState(fmt(initial?.otherFixed));
  const [showBills, setShowBills] = useState(Boolean(initial?.loanPayment || initial?.otherFixed));
  const [errors, setErrors] = useState<{ salary?: string; city?: string }>({});

  const fid = (name: string) => `${idPrefix}${name}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const salaryNum = parseDollarInput(salary);
    const next = {
      salary: salaryNum > 0 ? undefined : "Enter the yearly salary from the offer.",
      city: cityId ? undefined : "Pick a city from the list.",
    };
    setErrors(next);
    if (next.salary || next.city) {
      document.getElementById(next.salary ? fid("salary") : fid("city"))?.focus();
      return;
    }
    onSubmit({
      salary: salaryNum,
      cityId,
      loanPayment: compact ? initial?.loanPayment ?? 0 : parseDollarInput(loan),
      otherFixed: compact ? initial?.otherFixed ?? 0 : parseDollarInput(other),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <MoneyInput
        id={fid("salary")}
        label="Salary in the offer"
        helper="Yearly base pay, before tax."
        value={salary}
        onChange={(v) => {
          setSalary(v);
          if (errors.salary) setErrors((x) => ({ ...x, salary: undefined }));
        }}
        placeholder="e.g. 65,000"
        suffix="a year"
        error={errors.salary}
      />

      <CityPicker
        id={fid("city")}
        label="City"
        helper="Where you would live and work."
        value={cityId}
        onChange={(v) => {
          setCityId(v);
          if (errors.city) setErrors((x) => ({ ...x, city: undefined }));
        }}
        error={errors.city}
      />

      {!compact && (
        <div>
          <button
            type="button"
            aria-expanded={showBills}
            aria-controls={fid("bills")}
            onClick={() => setShowBills((s) => !s)}
            className="inline-flex min-h-10 items-center gap-2 rounded-full px-1 text-base font-semibold text-foreground underline decoration-border-strong decoration-2 underline-offset-4 hover:decoration-primary"
          >
            {showBills ? "Hide loan and bills" : "Add a loan payment or other bills"}
          </button>
          <div id={fid("bills")} hidden={!showBills} className="mt-3 space-y-5 rounded-3xl bg-muted p-4 sm:p-5">
            <MoneyInput
              id={fid("loan")}
              label="Student loan payment"
              helper={
                <>
                  Your servicer shows it. Not sure?{" "}
                  <a
                    href={LOAN_DESK}
                    className="font-semibold text-foreground underline underline-offset-2"
                  >
                    Loan Desk
                  </a>{" "}
                  estimates it.
                </>
              }
              value={loan}
              onChange={setLoan}
              placeholder="0"
              suffix="a month"
            />
            <MoneyInput
              id={fid("other")}
              label="Other monthly bills"
              helper="A car loan, insurance, subscriptions. Not rent, food or phone."
              value={other}
              onChange={setOther}
              placeholder="0"
              suffix="a month"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row-reverse sm:items-center">
        <button
          type="submit"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-hover active:scale-[0.99] sm:flex-1"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full px-5 text-base font-semibold text-foreground hover:bg-secondary sm:w-auto"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
