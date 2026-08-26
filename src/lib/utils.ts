import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Offer } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(n: number): string {
  if (!isFinite(n)) return "$0";
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.round(abs).toLocaleString("en-US")}`;
}

export function formatCurrencyShort(n: number): string {
  if (!isFinite(n)) return "$0";
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1000) {
    return `${sign}$${(abs / 1000).toFixed(1)}k`;
  }
  return `${sign}$${Math.round(abs)}`;
}

export function formatDollarInput(value: string): string {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return "";
  return parseInt(digits, 10).toLocaleString("en-US");
}

export function parseDollarInput(formatted: string): number {
  const digits = formatted.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

// ── Share URL (base64-encoded offer state) ────────────────────────────────

interface ShareState {
  a: Offer;
  b?: Offer;
}

export function encodeShareState(state: ShareState): string {
  try {
    return btoa(JSON.stringify(state));
  } catch {
    return "";
  }
}

export function decodeShareState(encoded: string): ShareState | null {
  try {
    const parsed = JSON.parse(atob(encoded));
    if (
      parsed &&
      parsed.a &&
      typeof parsed.a.salary === "number" &&
      typeof parsed.a.cityId === "string" &&
      parsed.a.salary >= 0
    ) {
      return parsed as ShareState;
    }
    return null;
  } catch {
    return null;
  }
}

export function buildShareUrl(state: ShareState): string {
  const encoded = encodeShareState(state);
  if (!encoded) return "";
  const base = typeof window !== "undefined" ? window.location.origin : "";
  return `${base}/?q=${encodeURIComponent(encoded)}`;
}

// ── Storage (sessionStorage with try/catch for Safari private mode) ───────

export const storage = {
  get(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // ignore
    }
  },
  remove(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};
