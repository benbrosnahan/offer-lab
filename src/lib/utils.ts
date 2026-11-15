import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Offer } from "@/types";
import { MAX_ROOMMATES } from "@/data/cities";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Whole dollars with a leading minus for negatives, e.g. "-$587". */
export function formatCurrency(n: number): string {
  if (!isFinite(n)) return "$0";
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.round(abs).toLocaleString("en-US")}`;
}

export function formatDollarInput(value: string): string {
  const digits = value.replace(/[^\d]/g, "").slice(0, 9);
  if (!digits) return "";
  return parseInt(digits, 10).toLocaleString("en-US");
}

export function parseDollarInput(formatted: string): number {
  const digits = formatted.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

// Share URL (base64-encoded offer state)

export interface ShareState {
  a: Offer;
  b?: Offer;
}

const MAX_SALARY = 10_000_000;
const MAX_MONTHLY = 100_000;

/** A whole-dollar amount in [0, max], or undefined when it is not one. */
function amount(v: unknown, max: number): number | undefined {
  return typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= max
    ? Math.round(v)
    : undefined;
}

/**
 * Rebuilds an offer from untrusted input (a share link or storage), keeping
 * only known fields with sane values. Returns null when the offer cannot be
 * shown: no positive salary, or a city the app does not cover.
 */
export function sanitizeOffer(
  raw: unknown,
  cityExists: (id: string) => boolean
): Offer | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const salary = amount(o.salary, MAX_SALARY);
  const cityId = typeof o.cityId === "string" ? o.cityId : "";
  if (!salary || !cityExists(cityId)) return null;
  const offer: Offer = {
    salary,
    cityId,
    loanPayment: amount(o.loanPayment, MAX_MONTHLY) ?? 0,
    otherFixed: amount(o.otherFixed, MAX_MONTHLY) ?? 0,
  };
  const rent = amount(o.rentOverride, MAX_MONTHLY);
  const essentials = amount(o.necessitiesOverride, MAX_MONTHLY);
  const utilities = amount(o.utilitiesOverride, MAX_MONTHLY);
  if (rent !== undefined) offer.rentOverride = rent;
  if (essentials !== undefined) offer.necessitiesOverride = essentials;
  if (utilities !== undefined) offer.utilitiesOverride = utilities;
  // Roommates: a whole number from 1 to MAX_ROOMMATES; anything else is living alone.
  const roommates = o.roommates;
  if (typeof roommates === "number" && Number.isInteger(roommates) && roommates >= 1 && roommates <= MAX_ROOMMATES) {
    offer.roommates = roommates;
  }
  return offer;
}

export function parseShareState(
  raw: unknown,
  cityExists: (id: string) => boolean
): ShareState | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const a = sanitizeOffer(r.a, cityExists);
  if (!a) return null;
  const b = r.b === undefined ? null : sanitizeOffer(r.b, cityExists);
  return b ? { a, b } : { a };
}

export function encodeShareState(state: ShareState): string {
  try {
    return btoa(JSON.stringify(state));
  } catch {
    return "";
  }
}

export function decodeShareState(
  encoded: string,
  cityExists: (id: string) => boolean
): ShareState | null {
  try {
    return parseShareState(JSON.parse(atob(encoded)), cityExists);
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

// Storage (sessionStorage, wrapped for private modes that block it)

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
