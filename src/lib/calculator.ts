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
import {
  Brackets,
  LOCAL_TAX_2025,
  NYC_BRACKETS_2025,
  STATE_TAX_2025,
} from "@/data/taxes";

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

function applyBrackets(taxable: number, brackets: Brackets): number {
  let tax = 0;
  let lastThreshold = 0;
  for (const [threshold, rate] of brackets) {
    if (taxable <= threshold) {
      tax += (taxable - lastThreshold) * rate;
      break;
    }
    tax += (threshold - lastThreshold) * rate;
    lastThreshold = threshold;
  }
  return Math.max(0, tax);
}

function calcFederalTax(gross: number): number {
  // Use standard deduction (assumes student doesn't itemize)
  const taxable = Math.max(0, gross - STANDARD_DEDUCTION_2025_SINGLE);
  return applyBrackets(taxable, FEDERAL_BRACKETS_2025_SINGLE);
}

function calcFica(gross: number): number {
  const ssTaxable = Math.min(gross, SS_WAGE_BASE_2025);
  const ss = ssTaxable * SS_RATE;
  const medicare = gross * MEDICARE_RATE;
  return ss + medicare;
}

/**
 * 2025 state income tax for a single filer whose only income is wages
 * (so AGI = gross). Rules and sources live in src/data/taxes.ts; the
 * state-specific adjustments below follow each state's 2025 instructions.
 * Returns the tax and the state taxable income (some local taxes use it).
 */
function calcStateTax(
  gross: number,
  state: string,
  federalTax: number,
  fica: number
): { tax: number; taxable: number } {
  const rule = STATE_TAX_2025[state];
  if (!rule) return { tax: 0, taxable: 0 }; // no tax on wages
  const agi = gross;

  let income = rule.startsFromFederalTaxable
    ? Math.max(0, agi - STANDARD_DEDUCTION_2025_SINGLE)
    : agi;
  let deduction = rule.standardDeduction ?? 0;
  let exemption = rule.personalExemption ?? 0;
  let credit = rule.personalCredit ?? 0;

  switch (state) {
    case "AL": {
      // Standard deduction slides from $3,000 to $2,500 by AGI; federal
      // income tax is deductible.
      deduction =
        agi < 26000
          ? 3000
          : Math.max(2500, 3000 - 25 * (Math.floor((agi - 26000) / 500) + 1));
      income -= federalTax;
      break;
    }
    case "CA":
      // Exemption credit shrinks $6 per $2,500 of AGI over $252,203.
      if (agi > 252203) {
        credit = Math.max(0, credit - 6 * Math.ceil((agi - 252203) / 2500));
      }
      break;
    case "CT":
      // Table A: $15,000 exemption, reduced $1,000 per $1,000 over $30,000.
      exemption =
        agi <= 30000
          ? 15000
          : Math.max(0, 15000 - 1000 * Math.ceil((agi - 30000) / 1000));
      break;
    case "IL":
      if (agi > 250000) exemption = 0;
      break;
    case "MA":
      // Employee Social Security and Medicare, up to $2,000.
      income -= Math.min(fica, 2000);
      break;
    case "MD":
      exemption =
        agi <= 100000 ? 3200 : agi <= 125000 ? 1600 : agi <= 150000 ? 800 : 0;
      break;
    case "MN": {
      const reduction =
        0.03 * Math.max(0, agi - 238950) + 0.1 * Math.max(0, agi - 330300);
      deduction -= Math.min(reduction, 0.8 * deduction);
      break;
    }
    case "MO": {
      // Federal income tax deduction: a percentage set by AGI, max $5,000.
      const pct =
        agi <= 25000
          ? 0.35
          : agi <= 50000
            ? 0.25
            : agi <= 100000
              ? 0.15
              : agi <= 125000
                ? 0.05
                : 0;
      income -= Math.min(5000, federalTax * pct);
      break;
    }
    case "NM":
      // Low- and middle-income exemption, gone above $36,667.
      if (agi <= 36667) {
        exemption = Math.min(2500, Math.max(0, 2500 - 0.15 * (agi - 20000)));
      }
      break;
    case "OH":
      exemption =
        agi <= 40000 ? 2400 : agi <= 80000 ? 2150 : agi < 750000 ? 1900 : 0;
      break;
    case "OR": {
      // Federal income tax subtraction, capped at $8,500 and phased out
      // between $125,000 and $145,000 AGI. Exemption credit ends above $100,000.
      const cap =
        agi < 125000
          ? 8500
          : agi < 130000
            ? 6800
            : agi < 135000
              ? 5100
              : agi < 140000
                ? 3400
                : agi < 145000
                  ? 1700
                  : 0;
      income -= Math.min(federalTax, cap);
      if (agi > 100000) credit = 0;
      break;
    }
    case "RI":
      if (agi > 254250) {
        const steps = Math.ceil((agi - 254250) / 7250);
        const keep = agi - 254250 > 29000 ? 0 : Math.max(0, 1 - 0.2 * steps);
        deduction *= keep;
        exemption *= keep;
      }
      break;
    case "UT":
      // Taxpayer tax credit: 6% of the federal standard deduction, phased
      // out at 1.3% of income over $18,213.
      credit = Math.max(
        0,
        0.06 * STANDARD_DEDUCTION_2025_SINGLE - 0.013 * Math.max(0, agi - 18213)
      );
      break;
    case "WI":
      deduction =
        agi < 19550 ? 13560 : Math.max(0, 13560 - 0.12 * (agi - 19550));
      break;
  }

  const taxable = Math.max(0, income - deduction - exemption);
  let tax = applyBrackets(taxable, rule.brackets);

  switch (state) {
    case "AR":
      tax = calcArkansasTax(taxable);
      break;
    case "CT":
      tax = adjustConnecticutTax(tax, agi);
      break;
    case "NY":
      tax = adjustNewYorkTax(tax, taxable, agi);
      break;
    case "OH":
      // Statutory 2025 schedule (base amounts as published).
      tax =
        taxable <= 26050
          ? 0
          : taxable <= 100000
            ? 342 + 0.0275 * (taxable - 26050)
            : 2394.32 + 0.03125 * (taxable - 100000);
      if (taxable < 30000) credit = 20;
      break;
    case "UT":
      if (agi <= STANDARD_DEDUCTION_2025_SINGLE) tax = 0;
      break;
    case "VT":
      // Minimum tax of 3% of AGI above $150,000.
      if (agi > 150000) tax = Math.max(tax, 0.03 * agi);
      break;
  }

  return { tax: Math.max(0, tax - credit), taxable };
}

/** Arkansas 2025 indexed brackets: net taxable income × rate − adjustment. */
function calcArkansasTax(nti: number): number {
  if (nti < 5600) return 0;
  if (nti < 11200) return nti * 0.02 - 111.98;
  if (nti < 16000) return nti * 0.03 - 223.97;
  if (nti < 26400) return nti * 0.034 - 287.97;
  if (nti <= 94700) return nti * 0.039 - 419.96;
  if (nti <= 97800) {
    const step = Math.ceil((nti - 94700) / 100) - 1;
    return nti * 0.039 - (399.3 - 10 * step);
  }
  if (nti <= 100000) return nti * 0.039 - 89.3;
  return 3809 + 0.039 * (nti - 100000);
}

/** Connecticut 2025: 2% phase-out add-back, recapture, and personal credit. */
function adjustConnecticutTax(initialTax: number, agi: number): number {
  const band = (over: number, width: number) =>
    Math.ceil((agi - over) / width);
  const addBack = agi <= 56500 ? 0 : 25 * Math.min(10, band(56500, 5000));
  const recapture =
    agi <= 105000
      ? 0
      : agi <= 200000
        ? 25 * Math.min(10, band(105000, 5000))
        : agi <= 500000
          ? 250 + 90 * Math.min(30, band(200000, 5000))
          : 2950 + 50 * Math.min(9, band(500000, 5000));
  const tax = initialTax + addBack + recapture;

  // Table E: personal tax credit decimal (single).
  const creditTable: Array<[number, number]> = [
    [15000, 0], [18800, 0.75], [19300, 0.7], [19800, 0.65], [20300, 0.6],
    [20800, 0.55], [21300, 0.5], [21800, 0.45], [22300, 0.4], [25000, 0.35],
    [25500, 0.3], [26000, 0.25], [26500, 0.2], [31300, 0.15], [31800, 0.14],
    [32300, 0.13], [32800, 0.12], [33300, 0.11], [60000, 0.1],
  ];
  let decimal = 0;
  const row = creditTable.find(([upTo]) => agi <= upTo);
  if (row) decimal = row[1];
  else if (agi <= 64500) decimal = 0.1 - 0.01 * Math.ceil((agi - 60000) / 500);
  if (agi <= 15000) return 0;
  return tax * (1 - decimal);
}

/**
 * New York 2025 supplemental tax (tax computation worksheets 7-11, single):
 * above $107,650 AGI the benefit of the lower brackets is recaptured.
 */
function adjustNewYorkTax(
  scheduleTax: number,
  taxable: number,
  agi: number
): number {
  if (agi <= 107650) return scheduleTax;
  if (agi > 25000000) return taxable * 0.109;
  const phase = (over: number) =>
    Math.round((Math.min(Math.max(agi - over, 0), 50000) / 50000) * 10000) /
    10000;
  if (taxable <= 215400) {
    const flat = taxable * 0.06;
    if (agi >= 157650) return flat;
    return scheduleTax + (flat - scheduleTax) * phase(107650);
  }
  if (taxable <= 1077550) return scheduleTax + 568 + 1831 * phase(215400);
  if (taxable <= 5000000) return scheduleTax + 2399 + 30172 * phase(1077550);
  return scheduleTax + 32571 + 32500 * phase(5000000);
}

/** 2025 local income tax for someone who lives and works in the city. */
function calcLocalTax(
  gross: number,
  cityId: string,
  stateTaxable: number
): number {
  const rule = LOCAL_TAX_2025[cityId];
  if (!rule) return 0;
  switch (rule.kind) {
    case "wages":
      return gross * rule.rate;
    case "wagesLessExemption":
      return Math.max(0, gross - rule.exemption) * rule.rate;
    case "stateTaxable":
      return stateTaxable * rule.rate;
    case "nyc": {
      // NYC tax on NY taxable income, less the NYC school tax credits
      // ($63 fixed up to $250k income, plus the rate reduction amount).
      const tax = applyBrackets(stateTaxable, NYC_BRACKETS_2025);
      const fixedCredit = gross <= 250000 ? 63 : 0;
      const rateReduction =
        stateTaxable > 500000
          ? 0
          : stateTaxable <= 12000
            ? 0.00171 * stateTaxable
            : 21 + 0.00228 * (stateTaxable - 12000);
      return Math.max(0, tax - fixedCredit - rateReduction);
    }
    case "portland": {
      // Metro SHS: 1% over $125,000. Multnomah PFA: 1.5% over $125,000,
      // plus 1.5% more over $250,000. Both on Oregon taxable income.
      const over125 = Math.max(0, stateTaxable - 125000);
      const over250 = Math.max(0, stateTaxable - 250000);
      return 0.01 * over125 + 0.015 * over125 + 0.015 * over250;
    }
  }
}

export function calcTax(gross: number, city: CityRecord): TaxBreakdown {
  const federalTax = calcFederalTax(gross);
  const fica = calcFica(gross);
  const state = calcStateTax(gross, city.state, federalTax, fica);
  const stateTax = state.tax;
  const localTax = calcLocalTax(gross, city.id, state.taxable);
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
