import { City } from "@/types";

/**
 * City dataset for Offer Lab.
 *
 * Sources:
 * - median1BR: Zumper National Rent Report (November 2025) and Apartment List
 *   National Rent Data (2025) metro-level medians for 1-bedroom apartments.
 *   National median 1BR per Zumper Nov 2025: $1,501.
 * - colIndex: Cost-of-living index for necessities (food, utilities, transit,
 *   personal care, healthcare) relative to national average (1.00). Derived
 *   from BEA Regional Price Parities (2024) and MIT Living Wage Calculator.
 * - stateTaxRate: effective state income tax for a single filer earning
 *   $60,000 (2025 brackets). Tax Foundation 2025 state tax data.
 * - localTaxRate: city/county additional income tax (where applicable).
 */
export interface CityRecord extends City {
  stateTaxRate: number; // effective rate for typical grad income
}

export const CITIES: CityRecord[] = [
  // ── HIGHEST COST METROS ─────────────────────────────────────────────────
  { id: "san-francisco-ca", name: "San Francisco", state: "CA", median1BR: 3500, colIndex: 1.35, stateTaxRate: 0.065, localTaxRate: 0 },
  { id: "new-york-ny", name: "New York City", state: "NY", median1BR: 3200, colIndex: 1.30, stateTaxRate: 0.058, localTaxRate: 0.034 },
  { id: "boston-ma", name: "Boston", state: "MA", median1BR: 2700, colIndex: 1.18, stateTaxRate: 0.05, localTaxRate: 0 },
  { id: "san-jose-ca", name: "San Jose", state: "CA", median1BR: 2900, colIndex: 1.28, stateTaxRate: 0.065, localTaxRate: 0 },
  { id: "oakland-ca", name: "Oakland", state: "CA", median1BR: 2200, colIndex: 1.22, stateTaxRate: 0.065, localTaxRate: 0 },
  { id: "los-angeles-ca", name: "Los Angeles", state: "CA", median1BR: 2300, colIndex: 1.22, stateTaxRate: 0.065, localTaxRate: 0 },
  { id: "san-diego-ca", name: "San Diego", state: "CA", median1BR: 2400, colIndex: 1.18, stateTaxRate: 0.065, localTaxRate: 0 },
  { id: "seattle-wa", name: "Seattle", state: "WA", median1BR: 2100, colIndex: 1.18, stateTaxRate: 0, localTaxRate: 0 },
  { id: "washington-dc", name: "Washington, D.C.", state: "DC", median1BR: 2350, colIndex: 1.18, stateTaxRate: 0.075, localTaxRate: 0 },
  { id: "honolulu-hi", name: "Honolulu", state: "HI", median1BR: 2000, colIndex: 1.25, stateTaxRate: 0.072, localTaxRate: 0 },

  // ── HIGH COST ───────────────────────────────────────────────────────────
  { id: "chicago-il", name: "Chicago", state: "IL", median1BR: 2200, colIndex: 1.05, stateTaxRate: 0.0495, localTaxRate: 0 },
  { id: "miami-fl", name: "Miami", state: "FL", median1BR: 2400, colIndex: 1.10, stateTaxRate: 0, localTaxRate: 0 },
  { id: "denver-co", name: "Denver", state: "CO", median1BR: 1700, colIndex: 1.05, stateTaxRate: 0.044, localTaxRate: 0 },
  { id: "portland-or", name: "Portland", state: "OR", median1BR: 1500, colIndex: 1.05, stateTaxRate: 0.085, localTaxRate: 0 },
  { id: "philadelphia-pa", name: "Philadelphia", state: "PA", median1BR: 1500, colIndex: 1.02, stateTaxRate: 0.0307, localTaxRate: 0.0375 },
  { id: "atlanta-ga", name: "Atlanta", state: "GA", median1BR: 1600, colIndex: 0.99, stateTaxRate: 0.0539, localTaxRate: 0 },
  { id: "minneapolis-mn", name: "Minneapolis", state: "MN", median1BR: 1500, colIndex: 1.00, stateTaxRate: 0.068, localTaxRate: 0 },
  { id: "austin-tx", name: "Austin", state: "TX", median1BR: 1450, colIndex: 1.00, stateTaxRate: 0, localTaxRate: 0 },
  { id: "nashville-tn", name: "Nashville", state: "TN", median1BR: 1550, colIndex: 0.98, stateTaxRate: 0, localTaxRate: 0 },
  { id: "raleigh-nc", name: "Raleigh", state: "NC", median1BR: 1400, colIndex: 0.96, stateTaxRate: 0.045, localTaxRate: 0 },
  { id: "charlotte-nc", name: "Charlotte", state: "NC", median1BR: 1500, colIndex: 0.97, stateTaxRate: 0.045, localTaxRate: 0 },
  { id: "baltimore-md", name: "Baltimore", state: "MD", median1BR: 1450, colIndex: 1.02, stateTaxRate: 0.0475, localTaxRate: 0.032 },
  { id: "providence-ri", name: "Providence", state: "RI", median1BR: 1700, colIndex: 1.05, stateTaxRate: 0.0375, localTaxRate: 0 },
  { id: "sacramento-ca", name: "Sacramento", state: "CA", median1BR: 1700, colIndex: 1.08, stateTaxRate: 0.065, localTaxRate: 0 },
  { id: "long-beach-ca", name: "Long Beach", state: "CA", median1BR: 1900, colIndex: 1.18, stateTaxRate: 0.065, localTaxRate: 0 },
  { id: "anaheim-ca", name: "Anaheim", state: "CA", median1BR: 2100, colIndex: 1.18, stateTaxRate: 0.065, localTaxRate: 0 },

  // ── MID-COST METROS ─────────────────────────────────────────────────────
  { id: "dallas-tx", name: "Dallas", state: "TX", median1BR: 1400, colIndex: 0.98, stateTaxRate: 0, localTaxRate: 0 },
  { id: "houston-tx", name: "Houston", state: "TX", median1BR: 1350, colIndex: 0.96, stateTaxRate: 0, localTaxRate: 0 },
  { id: "phoenix-az", name: "Phoenix", state: "AZ", median1BR: 1450, colIndex: 0.99, stateTaxRate: 0.025, localTaxRate: 0 },
  { id: "tampa-fl", name: "Tampa", state: "FL", median1BR: 1700, colIndex: 1.00, stateTaxRate: 0, localTaxRate: 0 },
  { id: "orlando-fl", name: "Orlando", state: "FL", median1BR: 1700, colIndex: 0.99, stateTaxRate: 0, localTaxRate: 0 },
  { id: "las-vegas-nv", name: "Las Vegas", state: "NV", median1BR: 1450, colIndex: 0.99, stateTaxRate: 0, localTaxRate: 0 },
  { id: "salt-lake-city-ut", name: "Salt Lake City", state: "UT", median1BR: 1400, colIndex: 0.99, stateTaxRate: 0.0455, localTaxRate: 0 },
  { id: "richmond-va", name: "Richmond", state: "VA", median1BR: 1400, colIndex: 0.98, stateTaxRate: 0.0475, localTaxRate: 0 },
  { id: "columbus-oh", name: "Columbus", state: "OH", median1BR: 1200, colIndex: 0.93, stateTaxRate: 0.029, localTaxRate: 0.025 },
  { id: "indianapolis-in", name: "Indianapolis", state: "IN", median1BR: 1200, colIndex: 0.92, stateTaxRate: 0.0305, localTaxRate: 0 },
  { id: "milwaukee-wi", name: "Milwaukee", state: "WI", median1BR: 1300, colIndex: 0.95, stateTaxRate: 0.053, localTaxRate: 0 },
  { id: "kansas-city-mo", name: "Kansas City", state: "MO", median1BR: 1200, colIndex: 0.93, stateTaxRate: 0.045, localTaxRate: 0.01 },
  { id: "pittsburgh-pa", name: "Pittsburgh", state: "PA", median1BR: 1300, colIndex: 0.94, stateTaxRate: 0.0307, localTaxRate: 0.03 },
  { id: "jacksonville-fl", name: "Jacksonville", state: "FL", median1BR: 1400, colIndex: 0.97, stateTaxRate: 0, localTaxRate: 0 },
  { id: "new-orleans-la", name: "New Orleans", state: "LA", median1BR: 1500, colIndex: 0.97, stateTaxRate: 0.03, localTaxRate: 0 },
  { id: "ann-arbor-mi", name: "Ann Arbor", state: "MI", median1BR: 1600, colIndex: 1.00, stateTaxRate: 0.0425, localTaxRate: 0 },
  { id: "madison-wi", name: "Madison", state: "WI", median1BR: 1450, colIndex: 0.98, stateTaxRate: 0.053, localTaxRate: 0 },

  // ── LOWER COST METROS ───────────────────────────────────────────────────
  { id: "cleveland-oh", name: "Cleveland", state: "OH", median1BR: 1100, colIndex: 0.91, stateTaxRate: 0.029, localTaxRate: 0.025 },
  { id: "cincinnati-oh", name: "Cincinnati", state: "OH", median1BR: 1150, colIndex: 0.91, stateTaxRate: 0.029, localTaxRate: 0.018 },
  { id: "detroit-mi", name: "Detroit", state: "MI", median1BR: 1100, colIndex: 0.92, stateTaxRate: 0.0425, localTaxRate: 0.024 },
  { id: "memphis-tn", name: "Memphis", state: "TN", median1BR: 1100, colIndex: 0.90, stateTaxRate: 0, localTaxRate: 0 },
  { id: "louisville-ky", name: "Louisville", state: "KY", median1BR: 1100, colIndex: 0.91, stateTaxRate: 0.04, localTaxRate: 0.022 },
  { id: "oklahoma-city-ok", name: "Oklahoma City", state: "OK", median1BR: 950, colIndex: 0.89, stateTaxRate: 0.045, localTaxRate: 0 },
  { id: "st-louis-mo", name: "St. Louis", state: "MO", median1BR: 1150, colIndex: 0.91, stateTaxRate: 0.045, localTaxRate: 0.01 },
  { id: "birmingham-al", name: "Birmingham", state: "AL", median1BR: 1100, colIndex: 0.90, stateTaxRate: 0.045, localTaxRate: 0.01 },
  { id: "tulsa-ok", name: "Tulsa", state: "OK", median1BR: 1000, colIndex: 0.89, stateTaxRate: 0.045, localTaxRate: 0 },
  { id: "albuquerque-nm", name: "Albuquerque", state: "NM", median1BR: 1100, colIndex: 0.94, stateTaxRate: 0.045, localTaxRate: 0 },
  { id: "tucson-az", name: "Tucson", state: "AZ", median1BR: 1100, colIndex: 0.93, stateTaxRate: 0.025, localTaxRate: 0 },
  { id: "des-moines-ia", name: "Des Moines", state: "IA", median1BR: 1050, colIndex: 0.92, stateTaxRate: 0.038, localTaxRate: 0 },
  { id: "omaha-ne", name: "Omaha", state: "NE", median1BR: 1100, colIndex: 0.92, stateTaxRate: 0.05, localTaxRate: 0 },
  { id: "lincoln-ne", name: "Lincoln", state: "NE", median1BR: 1000, colIndex: 0.91, stateTaxRate: 0.05, localTaxRate: 0 },
  { id: "buffalo-ny", name: "Buffalo", state: "NY", median1BR: 1200, colIndex: 0.94, stateTaxRate: 0.058, localTaxRate: 0 },
  { id: "rochester-ny", name: "Rochester", state: "NY", median1BR: 1200, colIndex: 0.94, stateTaxRate: 0.058, localTaxRate: 0 },
  { id: "wichita-ks", name: "Wichita", state: "KS", median1BR: 900, colIndex: 0.89, stateTaxRate: 0.057, localTaxRate: 0 },
  { id: "little-rock-ar", name: "Little Rock", state: "AR", median1BR: 950, colIndex: 0.89, stateTaxRate: 0.044, localTaxRate: 0 },
  { id: "knoxville-tn", name: "Knoxville", state: "TN", median1BR: 1300, colIndex: 0.92, stateTaxRate: 0, localTaxRate: 0 },
  { id: "lexington-ky", name: "Lexington", state: "KY", median1BR: 1100, colIndex: 0.92, stateTaxRate: 0.04, localTaxRate: 0.0275 },

  // ── OTHER NOTABLE GRAD DESTINATIONS ─────────────────────────────────────
  { id: "boulder-co", name: "Boulder", state: "CO", median1BR: 2000, colIndex: 1.10, stateTaxRate: 0.044, localTaxRate: 0 },
  { id: "fort-collins-co", name: "Fort Collins", state: "CO", median1BR: 1500, colIndex: 1.02, stateTaxRate: 0.044, localTaxRate: 0 },
  { id: "burlington-vt", name: "Burlington", state: "VT", median1BR: 1700, colIndex: 1.05, stateTaxRate: 0.05, localTaxRate: 0 },
  { id: "albany-ny", name: "Albany", state: "NY", median1BR: 1400, colIndex: 0.98, stateTaxRate: 0.058, localTaxRate: 0 },
  { id: "syracuse-ny", name: "Syracuse", state: "NY", median1BR: 1200, colIndex: 0.95, stateTaxRate: 0.058, localTaxRate: 0 },
  { id: "hartford-ct", name: "Hartford", state: "CT", median1BR: 1600, colIndex: 1.05, stateTaxRate: 0.05, localTaxRate: 0 },
  { id: "new-haven-ct", name: "New Haven", state: "CT", median1BR: 1700, colIndex: 1.05, stateTaxRate: 0.05, localTaxRate: 0 },
  { id: "wilmington-de", name: "Wilmington", state: "DE", median1BR: 1500, colIndex: 1.00, stateTaxRate: 0.0555, localTaxRate: 0.0125 },
  { id: "norfolk-va", name: "Norfolk", state: "VA", median1BR: 1400, colIndex: 0.99, stateTaxRate: 0.0475, localTaxRate: 0 },
  { id: "grand-rapids-mi", name: "Grand Rapids", state: "MI", median1BR: 1300, colIndex: 0.95, stateTaxRate: 0.0425, localTaxRate: 0.015 },
  { id: "spokane-wa", name: "Spokane", state: "WA", median1BR: 1200, colIndex: 0.96, stateTaxRate: 0, localTaxRate: 0 },
  { id: "boise-id", name: "Boise", state: "ID", median1BR: 1300, colIndex: 0.97, stateTaxRate: 0.057, localTaxRate: 0 },
];

export const NATIONAL_AVG_RENT_1BR = 1501; // Zumper Nov 2025 national median
export const NATIONAL_NECESSITIES_BASELINE = 1200; // monthly food + utilities + transit + phone + personal care + insurance

// Reverse lookup
export function getCityById(id: string): CityRecord | undefined {
  return CITIES.find((c) => c.id === id);
}

export function searchCities(query: string): CityRecord[] {
  if (!query) return CITIES.slice(0, 12);
  const q = query.toLowerCase().trim();
  return CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.state.toLowerCase().includes(q) ||
      `${c.name}, ${c.state}`.toLowerCase().includes(q)
  ).slice(0, 12);
}
