"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CITIES, CityRecord, getCityById, searchCities } from "@/data/cities";
import { cn, formatCurrency } from "@/lib/utils";

interface Props {
  id: string;
  label: string;
  helper?: string;
  error?: string;
  value: string; // cityId
  onChange: (cityId: string) => void;
}

/**
 * A combobox in the WAI-ARIA pattern: the input owns a listbox, arrow keys
 * move the active option (announced through aria-activedescendant), Enter
 * picks it, Escape closes the list.
 */
export default function CityPicker({ id, label, helper, error, value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selected = value ? getCityById(value) : undefined;
  const results = open ? searchCities(query) : [];
  const shown = open ? query : selected ? `${selected.name}, ${selected.state}` : "";
  const optionId = (i: number) => `${listId}-opt-${i}`;

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const pick = (city: CityRecord) => {
    onChange(city.id);
    setQuery("");
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      setActive((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (open && results.length > 0) {
        e.preventDefault();
        pick(results[active >= 0 ? active : 0]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  };

  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div ref={wrapperRef} className="relative">
      <label htmlFor={id} className="block text-base font-semibold text-foreground">
        {label}
      </label>
      {helper && (
        <p id={helperId} className="mt-1 text-sm leading-snug text-muted-foreground">
          {helper}
        </p>
      )}
      <div className="relative mt-2">
        <svg
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          id={id}
          name={id}
          type="text"
          role="combobox"
          autoComplete="off"
          spellCheck={false}
          value={shown}
          placeholder={`Search ${CITIES.length} US cities`}
          aria-expanded={open && results.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
          aria-describedby={[helperId, errorId].filter(Boolean).join(" ") || undefined}
          aria-invalid={error ? true : undefined}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          onKeyDown={onKeyDown}
          className={cn(
            "block min-h-12 w-full rounded-2xl border bg-card py-3 pl-11 pr-4 text-base text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            error ? "border-brand-orange" : "border-input"
          )}
        />
      </div>

      <ul
        id={listId}
        role="listbox"
        aria-label={label}
        hidden={!(open && results.length > 0)}
        className="absolute z-40 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-border-strong bg-card py-1 card-soft"
      >
        {results.map((city, i) => (
          <li
            key={city.id}
            id={optionId(i)}
            role="option"
            aria-selected={i === active}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => pick(city)}
            onMouseEnter={() => setActive(i)}
            className={cn(
              "flex min-h-11 cursor-pointer items-center justify-between gap-3 px-4 py-2.5",
              i === active && "bg-secondary"
            )}
          >
            <span className="text-base text-foreground">
              {city.name}
              <span className="ml-1.5 text-muted-foreground">{city.state}</span>
            </span>
            <span className="tabular text-sm text-muted-foreground">
              {formatCurrency(city.rent)} rent
            </span>
          </li>
        ))}
      </ul>

      {open && query && results.length === 0 && (
        <p
          role="status"
          className="absolute z-40 mt-2 w-full rounded-2xl border border-border-strong bg-card p-4 text-sm text-muted-foreground card-soft"
        >
          No match. Offer Lab covers {CITIES.length} US cities; try the nearest large one.
        </p>
      )}

      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-brand-orange">
          {error}
        </p>
      )}
    </div>
  );
}
