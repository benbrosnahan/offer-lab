import {
  Offer,
  OfferAnalysis,
  TaxBreakdown,
  Verdict,
  VerdictTier,
} from "@/types";
import {
  CityRecord,
  getCityById,
  NATIONAL_NECESSITIES_BASELINE,
} from "@/data/cities";

/**
 * 2025 Federal Income Tax Brackets — Single Filer
 * Source: IRS Rev. Proc. 2024-40, confirmed via Tax Foundation 2025 brackets.
 * Standard deduction for single filers in 2025: $15,750 (per OBBB Act, July 2025).
 */
const FEDERAL_BRACKETS_2025_SINGLE: Array<[number, number]> = [
  [11925, 0.10],
  [48475, 0.12],
  [103350, 0.22],
  [197300, 0.24],
  [250525, 0.32],
  [626350, 0.35],
  [Infinity, 0.37],
];

const STANDARD_DEDUCTION_2025_SINGLE = 15750;

/**
 * FICA 2025
 * Source: SSA — 2025 Contribution and Benefit Base
 * - Social Security: 6.2% on wages up to $176,100 (employee portion)
 * - Medicare: 1.45% on all wages (employee portion)
 * - Total: 7.65% up to SS wage base, then 1.45% above
 */
const SS_WAGE_BASE_2025 = 176100;
const SS_RATE = 0.062;
const MEDICARE_RATE = 0.0145;

function calcFederalTax(gross: number): number {
  // Use standard deduction (assumes student doesn't itemize)
  const taxable = Math.max(0, gross - STANDARD_DEDUCTION_2025_SINGLE);

  let tax = 0;
  let lastThreshold = 0;
  for (const [threshold, rate] of FEDERAL_BRACKETS_2025_SINGLE) {
    if (taxable <= threshold) {
      tax += (taxable - lastThreshold) * rate;
      break;
    }
    tax += (threshold - lastThreshold) * rate;
    lastThreshold = threshold;
  }
  return Math.max(0, tax);
}

function calcFica(gross: number): number {
  const ssTaxable = Math.min(gross, SS_WAGE_BASE_2025);
  const ss = ssTaxable * SS_RATE;
  const medicare = gross * MEDICARE_RATE;
  return ss + medicare;
}

export function calcTax(gross: number, city: CityRecord): TaxBreakdown {
  const federalTax = calcFederalTax(gross);
  // State tax: use effective rate × gross (simplification — for typical
  // grad incomes this approximates progressive state calculations within
  // ~$200/year).
  const stateTax = gross * city.stateTaxRate;
  // Local tax: flat percent of gross (NYC, Philly, etc.)
  const localTax = gross * city.localTaxRate;
  const fica = calcFica(gross);
  const totalTax = federalTax + stateTax + localTax + fica;
  const takeHome = gross - totalTax;
  return {
    gross,
    federalTax,
    stateTax,
    localTax,
    fica,
    totalTax,
    takeHome,
    takeHomeMonthly: takeHome / 12,
    effectiveRate: gross > 0 ? totalTax / gross : 0,
  };
}

function getVerdict(discretionary: number): Verdict {
  let tier: VerdictTier;
  let label: string;
  let description: string;

  if (discretionary < 0) {
    tier = "tight";
    label = "Tight squeeze";
    description = `This offer doesn't quite cover the basics here. You'd be short about ${formatMoney(
      Math.abs(discretionary)
    )} every month. Negotiating salary, finding cheaper rent, or picking a different city could close the gap.`;
  } else if (discretionary < 300) {
    tier = "lean";
    label = "Living lean";
    description = `You can survive on this — but barely. About ${formatMoney(
      discretionary
    )}/month left over isn't much room for emergencies, savings, or anything unexpected.`;
  } else if (discretionary < 800) {
    tier = "comfortable";
    label = "Comfortable";
    description = `You're in good shape. With about ${formatMoney(
      discretionary
    )}/month after essentials, you can save, have fun, and handle surprises without stress.`;
  } else {
    tier = "strong";
    label = "Strong cushion";
    description = `This offer puts you in a strong position. ${formatMoney(
      discretionary
    )}/month left over means real savings, investing, and flexibility.`;
  }

  return { tier, label, description };
}

export function analyzeOffer(offer: Offer): OfferAnalysis | null {
  const city = getCityById(offer.cityId);
  if (!city) return null;

  const tax = calcTax(offer.salary, city);

  const rentIsOverride =
    typeof offer.rentOverride === "number" && offer.rentOverride >= 0;
  const rent = rentIsOverride ? offer.rentOverride! : city.median1BR;

  const necessitiesIsOverride =
    typeof offer.necessitiesOverride === "number" &&
    offer.necessitiesOverride >= 0;
  const necessities = necessitiesIsOverride
    ? offer.necessitiesOverride!
    : Math.round(NATIONAL_NECESSITIES_BASELINE * city.colIndex);

  const loanPayment = Math.max(0, offer.loanPayment ?? 0);
  const otherFixed = Math.max(0, offer.otherFixed ?? 0);

  const totalMonthlyCosts = rent + necessities + loanPayment + otherFixed;
  const discretionary = tax.takeHomeMonthly - totalMonthlyCosts;

  return {
    offer,
    city,
    tax,
    rent,
    rentIsOverride,
    necessities,
    necessitiesIsOverride,
    loanPayment,
    otherFixed,
    totalMonthlyCosts,
    discretionary,
    verdict: getVerdict(discretionary),
  };
}

function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}
