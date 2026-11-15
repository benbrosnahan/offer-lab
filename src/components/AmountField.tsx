"use client";

import { useState } from "react";
import { cn, formatDollarInput, parseDollarInput } from "@/lib/utils";

interface Props {
  id: string;
  value: number;
  onChange: (n: number) => void;
  /** Ids of the visible label and any note, read as the field's name and description. */
  labelledBy: string;
  describedBy?: string;
  className?: string;
}

/**
 * An always-editable monthly amount inside a breakdown row. Every keystroke
 * updates the answer, so there is no edit mode to discover.
 */
export default function AmountField({ id, value, onChange, labelledBy, describedBy, className }: Props) {
  const [draft, setDraft] = useState(formatDollarInput(String(value)));
  const [seen, setSeen] = useState(value);

  // The value changed from outside (a reset), so show it.
  if (value !== seen) {
    setSeen(value);
    if (parseDollarInput(draft) !== value) setDraft(formatDollarInput(String(value)));
  }

  return (
    <div className={cn("relative w-32 shrink-0", className)}>
      <span
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-muted-foreground"
      >
        $
      </span>
      <input
        id={id}
        name={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={draft}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        onChange={(e) => {
          const next = formatDollarInput(e.target.value);
          setDraft(next);
          const n = parseDollarInput(next);
          setSeen(n);
          onChange(n);
        }}
        onFocus={(e) => e.currentTarget.select()}
        className="tabular block min-h-11 w-full rounded-xl border border-input bg-card py-2 pl-7 pr-3 text-right text-base font-semibold text-foreground transition-colors focus:border-primary focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
    </div>
  );
}
