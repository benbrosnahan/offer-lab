"use client";

import { cn } from "@/lib/utils";

interface Props {
  id: string;
  label: string;
  helperText?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  inputMode?: "numeric" | "decimal";
  className?: string;
}

export default function NumberInput({
  id,
  label,
  helperText,
  value,
  onChange,
  placeholder,
  prefix,
  suffix,
  inputMode = "numeric",
  className,
}: Props) {
  const helperId = `${id}-helper`;
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-900"
      >
        {label}
      </label>
      {helperText && (
        <p id={helperId} className="text-xs text-slate-500 mt-1 leading-snug">
          {helperText}
        </p>
      )}
      <div className="relative mt-2">
        {prefix && (
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium pointer-events-none"
            aria-hidden="true"
          >
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="text"
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-describedby={helperText ? helperId : undefined}
          className={cn(
            "w-full min-h-[48px] py-3 rounded-xl border border-slate-300 bg-white text-base text-slate-900 placeholder-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20 transition-colors tabular",
            prefix ? "pl-9" : "pl-4",
            suffix ? "pr-12" : "pr-4"
          )}
        />
        {suffix && (
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium pointer-events-none"
            aria-hidden="true"
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
