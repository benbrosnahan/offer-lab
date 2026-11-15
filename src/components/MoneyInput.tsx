"use client";

import { cn, formatDollarInput } from "@/lib/utils";

interface Props {
  id: string;
  label: string;
  helper?: React.ReactNode;
  error?: string;
  value: string;
  onChange: (formatted: string) => void;
  placeholder?: string;
  suffix?: string;
}

/** A labelled dollar field: 16px text so phones do not zoom, 48px tall. */
export default function MoneyInput({
  id,
  label,
  helper,
  error,
  value,
  onChange,
  placeholder,
  suffix,
}: Props) {
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div>
      <label htmlFor={id} className="block text-base font-semibold text-foreground">
        {label}
      </label>
      {helper && (
        <p id={helperId} className="mt-1 text-sm leading-snug text-muted-foreground">
          {helper}
        </p>
      )}
      <div className="relative mt-2">
        <span
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-medium text-muted-foreground"
        >
          $
        </span>
        <input
          id={id}
          name={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(formatDollarInput(e.target.value))}
          placeholder={placeholder}
          aria-describedby={[helperId, errorId].filter(Boolean).join(" ") || undefined}
          aria-invalid={error ? true : undefined}
          className={cn(
            "tabular block min-h-12 w-full rounded-2xl border bg-card py-3 pl-8 text-base text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            suffix ? "pr-16" : "pr-4",
            error ? "border-brand-orange" : "border-input"
          )}
        />
        {suffix && (
          <span
            aria-hidden
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
          >
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-brand-orange">
          {error}
        </p>
      )}
    </div>
  );
}
