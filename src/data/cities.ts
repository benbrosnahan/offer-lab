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
 * - State and local income taxes: see src/data/taxes.ts (2025 brackets).
 */
export type CityRecord = City;

export const CITIES: CityRecord[] = [
  // ── HIGHEST COST METROS ─────────────────────────────────────────────────
  { id: "san-francisco-ca", name: "San Francisco", state: "CA", median1BR: 3500, colIndex: 1.35 },
  { id: "new-york-ny", name: "New York City", state: "NY", median1BR: 3200, colIndex: 1.30 },
  { id: "boston-ma", name: "Boston", state: "MA", median1BR: 2700, colIndex: 1.18 },
  { id: "san-jose-ca", name: "San Jose", state: "CA", median1BR: 2900, colIndex: 1.28 },
  { id: "oakland-ca", name: "Oakland", state: "CA", median1BR: 2200, colIndex: 1.22 },
  { id: "los-angeles-ca", name: "Los Angeles", state: "CA", median1BR: 2300, colIndex: 1.22 },
  { id: "san-diego-ca", name: "San Diego", state: "CA", median1BR: 2400, colIndex: 1.18 },
  { id: "seattle-wa", name: "Seattle", state: "WA", median1BR: 2100, colIndex: 1.18 },
  { id: "washington-dc", name: "Washington, D.C.", state: "DC", median1BR: 2350, colIndex: 1.18 },
  { id: "honolulu-hi", name: "Honolulu", state: "HI", median1BR: 2000, colIndex: 1.25 },

  // ── HIGH COST ───────────────────────────────────────────────────────────
  { id: "chicago-il", name: "Chicago", state: "IL", median1BR: 2200, colIndex: 1.05 },
  { id: "miami-fl", name: "Miami", state: "FL", median1BR: 2400, colIndex: 1.10 },
  { id: "denver-co", name: "Denver", state: "CO", median1BR: 1700, colIndex: 1.05 },
  { id: "portland-or", name: "Portland", state: "OR", median1BR: 1500, colIndex: 1.05 },
  { id: "philadelphia-pa", name: "Philadelphia", state: "PA", median1BR: 1500, colIndex: 1.02 },
  { id: "atlanta-ga", name: "Atlanta", state: "GA", median1BR: 1600, colIndex: 0.99 },
  { id: "minneapolis-mn", name: "Minneapolis", state: "MN", median1BR: 1500, colIndex: 1.00 },
  { id: "austin-tx", name: "Austin", state: "TX", median1BR: 1450, colIndex: 1.00 },
  { id: "nashville-tn", name: "Nashville", state: "TN", median1BR: 1550, colIndex: 0.98 },
  { id: "raleigh-nc", name: "Raleigh", state: "NC", median1BR: 1400, colIndex: 0.96 },
  { id: "charlotte-nc", name: "Charlotte", state: "NC", median1BR: 1500, colIndex: 0.97 },
  { id: "baltimore-md", name: "Baltimore", state: "MD", median1BR: 1450, colIndex: 1.02 },
  { id: "providence-ri", name: "Providence", state: "RI", median1BR: 1700, colIndex: 1.05 },
  { id: "sacramento-ca", name: "Sacramento", state: "CA", median1BR: 1700, colIndex: 1.08 },
  { id: "long-beach-ca", name: "Long Beach", state: "CA", median1BR: 1900, colIndex: 1.18 },
  { id: "anaheim-ca", name: "Anaheim", state: "CA", median1BR: 2100, colIndex: 1.18 },

  // ── MID-COST METROS ─────────────────────────────────────────────────────
  { id: "dallas-tx", name: "Dallas", state: "TX", median1BR: 1400, colIndex: 0.98 },
  { id: "houston-tx", name: "Houston", state: "TX", median1BR: 1350, colIndex: 0.96 },
  { id: "phoenix-az", name: "Phoenix", state: "AZ", median1BR: 1450, colIndex: 0.99 },
  { id: "tampa-fl", name: "Tampa", state: "FL", median1BR: 1700, colIndex: 1.00 },
  { id: "orlando-fl", name: "Orlando", state: "FL", median1BR: 1700, colIndex: 0.99 },
  { id: "las-vegas-nv", name: "Las Vegas", state: "NV", median1BR: 1450, colIndex: 0.99 },
  { id: "salt-lake-city-ut", name: "Salt Lake City", state: "UT", median1BR: 1400, colIndex: 0.99 },
  { id: "richmond-va", name: "Richmond", state: "VA", median1BR: 1400, colIndex: 0.98 },
  { id: "columbus-oh", name: "Columbus", state: "OH", median1BR: 1200, colIndex: 0.93 },
  { id: "indianapolis-in", name: "Indianapolis", state: "IN", median1BR: 1200, colIndex: 0.92 },
  { id: "milwaukee-wi", name: "Milwaukee", state: "WI", median1BR: 1300, colIndex: 0.95 },
  { id: "kansas-city-mo", name: "Kansas City", state: "MO", median1BR: 1200, colIndex: 0.93 },
  { id: "pittsburgh-pa", name: "Pittsburgh", state: "PA", median1BR: 1300, colIndex: 0.94 },
  { id: "jacksonville-fl", name: "Jacksonville", state: "FL", median1BR: 1400, colIndex: 0.97 },
  { id: "new-orleans-la", name: "New Orleans", state: "LA", median1BR: 1500, colIndex: 0.97 },
  { id: "ann-arbor-mi", name: "Ann Arbor", state: "MI", median1BR: 1600, colIndex: 1.00 },
  { id: "madison-wi", name: "Madison", state: "WI", median1BR: 1450, colIndex: 0.98 },

  // ── LOWER COST METROS ───────────────────────────────────────────────────
  { id: "cleveland-oh", name: "Cleveland", state: "OH", median1BR: 1100, colIndex: 0.91 },
  { id: "cincinnati-oh", name: "Cincinnati", state: "OH", median1BR: 1150, colIndex: 0.91 },
  { id: "detroit-mi", name: "Detroit", state: "MI", median1BR: 1100, colIndex: 0.92 },
  { id: "memphis-tn", name: "Memphis", state: "TN", median1BR: 1100, colIndex: 0.90 },
  { id: "louisville-ky", name: "Louisville", state: "KY", median1BR: 1100, colIndex: 0.91 },
  { id: "oklahoma-city-ok", name: "Oklahoma City", state: "OK", median1BR: 950, colIndex: 0.89 },
  { id: "st-louis-mo", name: "St. Louis", state: "MO", median1BR: 1150, colIndex: 0.91 },
  { id: "birmingham-al", name: "Birmingham", state: "AL", median1BR: 1100, colIndex: 0.90 },
  { id: "tulsa-ok", name: "Tulsa", state: "OK", median1BR: 1000, colIndex: 0.89 },
  { id: "albuquerque-nm", name: "Albuquerque", state: "NM", median1BR: 1100, colIndex: 0.94 },
  { id: "tucson-az", name: "Tucson", state: "AZ", median1BR: 1100, colIndex: 0.93 },
  { id: "des-moines-ia", name: "Des Moines", state: "IA", median1BR: 1050, colIndex: 0.92 },
  { id: "omaha-ne", name: "Omaha", state: "NE", median1BR: 1100, colIndex: 0.92 },
  { id: "lincoln-ne", name: "Lincoln", state: "NE", median1BR: 1000, colIndex: 0.91 },
  { id: "buffalo-ny", name: "Buffalo", state: "NY", median1BR: 1200, colIndex: 0.94 },
  { id: "rochester-ny", name: "Rochester", state: "NY", median1BR: 1200, colIndex: 0.94 },
  { id: "wichita-ks", name: "Wichita", state: "KS", median1BR: 900, colIndex: 0.89 },
  { id: "little-rock-ar", name: "Little Rock", state: "AR", median1BR: 950, colIndex: 0.89 },
  { id: "knoxville-tn", name: "Knoxville", state: "TN", median1BR: 1300, colIndex: 0.92 },
  { id: "lexington-ky", name: "Lexington", state: "KY", median1BR: 1100, colIndex: 0.92 },

  // ── OTHER NOTABLE GRAD DESTINATIONS ─────────────────────────────────────
  { id: "boulder-co", name: "Boulder", state: "CO", median1BR: 2000, colIndex: 1.10 },
  { id: "fort-collins-co", name: "Fort Collins", state: "CO", median1BR: 1500, colIndex: 1.02 },
  { id: "burlington-vt", name: "Burlington", state: "VT", median1BR: 1700, colIndex: 1.05 },
  { id: "albany-ny", name: "Albany", state: "NY", median1BR: 1400, colIndex: 0.98 },
  { id: "syracuse-ny", name: "Syracuse", state: "NY", median1BR: 1200, colIndex: 0.95 },
  { id: "hartford-ct", name: "Hartford", state: "CT", median1BR: 1600, colIndex: 1.05 },
  { id: "new-haven-ct", name: "New Haven", state: "CT", median1BR: 1700, colIndex: 1.05 },
  { id: "wilmington-de", name: "Wilmington", state: "DE", median1BR: 1500, colIndex: 1.00 },
  { id: "norfolk-va", name: "Norfolk", state: "VA", median1BR: 1400, colIndex: 0.99 },
  { id: "grand-rapids-mi", name: "Grand Rapids", state: "MI", median1BR: 1300, colIndex: 0.95 },
  { id: "spokane-wa", name: "Spokane", state: "WA", median1BR: 1200, colIndex: 0.96 },
  { id: "boise-id", name: "Boise", state: "ID", median1BR: 1300, colIndex: 0.97 },
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
