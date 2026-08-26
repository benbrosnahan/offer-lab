"use client";

import { useState, useRef, useEffect } from "react";
import { formatDollarInput, parseDollarInput, formatCurrency, cn } from "@/lib/utils";

interface Props {
  value: number;
  onChange: (v: number) => void;
  onReset?: () => void;
  isOverride?: boolean;
  className?: string;
  /**
   * If true, render as a subtle inline editable; if false, render as a
   * prominent button-like affordance.
   */
  inline?: boolean;
}

export default function EditableNumber({
  value,
  onChange,
  onReset,
  isOverride,
  className,
  inline = false,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(formatDollarInput(String(value)));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    // Re-sync draft when value changes externally (e.g., reset)
    if (!editing) {
      setDraft(formatDollarInput(String(value)));
    }
  }, [value, editing]);

  const commit = () => {
    const num = parseDollarInput(draft);
    onChange(num);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(formatDollarInput(String(value)));
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="inline-flex items-center gap-1.5">
        <span className="text-slate-400 text-sm">$</span>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={draft}
          onChange={(e) => setDraft(formatDollarInput(e.target.value))}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            } else if (e.key === "Escape") {
              cancel();
            }
          }}
          className="w-20 text-right text-sm font-semibold border border-navy rounded-md px-1.5 py-0.5 focus:outline-none tabular"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={cn(
        "inline-flex items-center gap-1.5 group",
        inline
          ? "hover:text-navy transition-colors"
          : "px-2 py-0.5 -mx-2 -my-0.5 rounded-md hover:bg-slate-100 transition-colors",
        className
      )}
      aria-label={`Edit value, currently ${formatCurrency(value)}`}
    >
      <span className="tabular font-semibold">{formatCurrency(value)}</span>
      <svg
        className="w-3 h-3 text-slate-300 group-hover:text-navy transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
      {isOverride && onReset && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onReset();
          }}
          className="text-[10px] text-slate-400 hover:text-navy font-medium ml-1"
        >
          reset
        </button>
      )}
    </button>
  );
}
