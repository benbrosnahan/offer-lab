"use client";

import { useState, useRef, useEffect } from "react";
import { CityRecord, searchCities, getCityById } from "@/data/cities";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  label: string;
  value: string; // cityId
  onChange: (cityId: string) => void;
  placeholder?: string;
  helperText?: string;
}

export default function CityPicker({
  id,
  label,
  value,
  onChange,
  placeholder = "Search a city...",
  helperText,
}: Props) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedCity = value ? getCityById(value) : null;
  const results = isOpen ? searchCities(query) : [];

  // Display value: show selected city when not actively searching
  const displayValue = isOpen
    ? query
    : selectedCity
      ? `${selectedCity.name}, ${selectedCity.state}`
      : "";

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (city: CityRecord) => {
    onChange(city.id);
    setQuery("");
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[focusedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
    }
  };

  const helperId = `${id}-helper`;

  return (
    <div ref={wrapperRef} className="relative">
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
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          id={id}
          type="text"
          autoComplete="off"
          value={displayValue}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setFocusedIndex(-1);
          }}
          onFocus={() => {
            setIsOpen(true);
            setQuery("");
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-describedby={helperText ? helperId : undefined}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          className="w-full min-h-[48px] pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-base text-slate-900 placeholder-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20 transition-colors"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1.5 w-full bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
          <ul
            role="listbox"
            className="max-h-72 overflow-y-auto scrollbar-thin"
          >
            {results.map((city, i) => (
              <li key={city.id} role="option" aria-selected={i === focusedIndex}>
                <button
                  type="button"
                  onClick={() => handleSelect(city)}
                  onMouseEnter={() => setFocusedIndex(i)}
                  className={cn(
                    "w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-50 transition-colors",
                    i === focusedIndex && "bg-slate-50"
                  )}
                >
                  <div>
                    <span className="text-sm font-medium text-slate-900">
                      {city.name}
                    </span>
                    <span className="text-sm text-slate-400 ml-1.5">
                      {city.state}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 tabular">
                    ${city.median1BR.toLocaleString()}/mo rent
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div className="absolute z-50 mt-1.5 w-full bg-white rounded-xl border border-slate-200 shadow-lg p-4">
          <p className="text-sm text-slate-500">
            No city found. We currently cover the top ~75 US metros — try a
            major city near you.
          </p>
        </div>
      )}
    </div>
  );
}
