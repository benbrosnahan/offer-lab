/**
 * Electricity: the average monthly residential bill by state, from the U.S.
 * Energy Information Administration, "Electric Sales, Revenue, and Average
 * Price", Table 5A, data year 2024 (released 2025-10-07; EIA lists the next
 * release as discontinued, so 2024 is the latest annual year).
 * https://www.eia.gov/electricity/sales_revenue_price/xls/table_5A.xlsx
 *
 * It is the average across every residential customer in the state, houses
 * included, so it tends to run above a small apartment's bill. It covers
 * electricity only. Gas and other heating fuels are left out: whether a renter
 * pays a heating bill at all depends on the building (heat is often in the
 * rent, or electric and so already in this bill), and no federal source gives
 * a current per-state renter's gas bill.
 */
export const ELECTRICITY_YEAR = 2024;

/** Dollars a month, Table 5A "Average Monthly Bill", rounded to the cent. */
export const ELECTRICITY_BILL: Record<string, number> = {
  AL: 173.5, AR: 129.13, AZ: 160.24, CA: 160.86, CO: 100.57, CT: 199.66,
  DC: 113.23, DE: 150.87, FL: 156.09, GA: 151.25, HI: 212.12, IA: 111.54,
  ID: 108.73, IL: 109.99, IN: 133.06, KS: 123.9, KY: 133.81, LA: 140.96,
  MA: 167.2, MD: 165.87, MI: 119.31, MN: 110.06, MO: 129.18, NC: 143.5,
  NE: 110.28, NM: 92.88, NV: 139.39, NY: 139.53, OH: 135.16, OK: 132.05,
  OR: 129.62, PA: 145.17, RI: 162.4, TN: 143.32, TX: 163.72, UT: 94.57,
  VA: 148.77, VT: 125.66, WA: 113.68, WI: 110.87,
};

/** U.S. average, Table 5A. Used only if a state were ever missing above. */
export const ELECTRICITY_US = 142.26;

/** Your share of the household's electricity bill, whole dollars a month. */
export function electricityShare(state: string, people: number): number {
  const bill = ELECTRICITY_BILL[state] ?? ELECTRICITY_US;
  return Math.round(bill / Math.max(1, people));
}
