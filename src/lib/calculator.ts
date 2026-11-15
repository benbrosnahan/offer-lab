import {
  Offer,
  OfferAnalysis,
  PayrollLine,
  TaxBreakdown,
  Verdict,
  VerdictTier,
} from "@/types";
import { CityRecord, essentialsFor, getCityById, MAX_ROOMMATES, rentShare } from "@/data/cities";
import { electricityShare } from "@/data/utilities";
import {
  Brackets,
  LOCAL_TAX,
  NYC_BRACKETS,
  STATE_PAYROLL,
  STATE_TAX,
} from "@/data/taxes";

/**
 * 2026 federal income tax, single filer.
 * Source: IRS Rev. Proc. 2025-32, "IRS releases tax inflation adjustments for
 * tax year 2026": standard deduction $16,100; 10% to $12,400, 12% to $50,400,
 * 22% to $105,700, 24% to $201,775, 32% to $256,225, 35% to $640,600, 37% above.
 */
const FEDERAL_BRACKETS_SINGLE: Array<[number, number]> = [
  [12400, 0.10],
  [50400, 0.12],
  [105700, 0.22],
  [201775, 0.24],
  [256225, 0.32],
  [640600, 0.35],
  [Infinity, 0.37],
];

export const FEDERAL_STANDARD_DEDUCTION = 16100;

/**
 * FICA 2026, employee share.
 * - Social Security: 6.2% up to the $184,500 wage base (SSA, Federal Register
 *   2025-19763)
 * - Medicare: 1.45% on all wages, plus the 0.9% Additional Medicare Tax on
 *   wages over $200,000 (IRC 3101(b)(2), not indexed)
 */
export const SS_WAGE_BASE = 184500;
const SS_RATE = 0.062;
const MEDICARE_RATE = 0.0145;
const ADDITIONAL_MEDICARE_RATE = 0.009;
const ADDITIONAL_MEDICARE_THRESHOLD = 200000;

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
  // Use standard deduction (assumes the student doesn't itemize)
  const taxable = Math.max(0, gross - FEDERAL_STANDARD_DEDUCTION);
  return applyBrackets(taxable, FEDERAL_BRACKETS_SINGLE);
}

function calcFica(gross: number): number {
  const ss = Math.min(gross, SS_WAGE_BASE) * SS_RATE;
  const medicare = gross * MEDICARE_RATE;
  const additional =
    Math.max(0, gross - ADDITIONAL_MEDICARE_THRESHOLD) * ADDITIONAL_MEDICARE_RATE;
  return ss + medicare + additional;
}

/** State paid leave, disability and similar premiums withheld from pay, 2026. */
function calcStatePayroll(gross: number, state: string): PayrollLine[] {
  const rules = STATE_PAYROLL[state] ?? [];
  return rules.map((r) => {
    let amount = r.rate * Math.min(gross, r.wageCap ?? Infinity);
    if (r.maxAnnual !== undefined) amount = Math.min(amount, r.maxAnnual);
    if (r.flatAnnual !== undefined && gross > 0) amount += r.flatAnnual;
    return { label: r.label, amount };
  });
}

/**
 * 2026 state income tax for a single filer whose only income is wages
 * (so AGI = gross). Rules and sources live in src/data/taxes.ts; the
 * state-specific adjustments below follow each state's 2026 rules.
 * Returns the tax and the state taxable income (some local taxes use it).
 */
function calcStateTax(
  gross: number,
  state: string,
  federalTax: number,
  fica: number
): { tax: number; taxable: number } {
  const rule = STATE_TAX[state];
  if (!rule) return { tax: 0, taxable: 0 }; // no tax on wages
  const agi = gross;

  let income = rule.startsFromFederalTaxable
    ? Math.max(0, agi - FEDERAL_STANDARD_DEDUCTION)
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
      // Exemption credit shrinks $6 per $2,500 of AGI over the threshold.
      // 2026 threshold not yet published: 2025's $252,203 indexed by FTB's
      // 3.4% gives $260,778.
      if (agi > 260778) {
        credit = Math.max(0, credit - 6 * Math.ceil((agi - 260778) / 2500));
      }
      break;
    case "CO":
      // From 2026, AGI of $300,000 or more keeps only $1,000 of the standard
      // deduction (HB25-1274, Proposition MM).
      if (agi >= 300000) income = Math.max(0, agi - 1000);
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
      // 3% of AGI between the two thresholds plus 10% above the second,
      // capped at 80% of the deduction (Minn. Stat. 290.0123 subd. 5).
      const t1 = 244400;
      const t2 = 337800;
      const reduction =
        0.03 * Math.max(0, Math.min(agi, t2) - t1) + 0.1 * Math.max(0, agi - t2);
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
      // Indexing suspended for 2025-2026 (HB 96); no exemption at $500,000+.
      exemption =
        agi <= 40000 ? 2400 : agi <= 80000 ? 2150 : agi < 500000 ? 1900 : 0;
      break;
    case "OR": {
      // Federal income tax subtraction, capped at $8,750 and phased out
      // between $125,000 and $145,000 AGI. Exemption credit ends above $100,000.
      const cap =
        agi < 125000
          ? 8750
          : agi < 130000
            ? 7000
            : agi < 135000
              ? 5250
              : agi < 140000
                ? 3500
                : agi < 145000
                  ? 1750
                  : 0;
      income -= Math.min(federalTax, cap);
      if (agi > 100000) credit = 0;
      break;
    }
    case "RI":
      // Deduction and exemption phase out from $261,000 to $290,800.
      if (agi > 261000) {
        const steps = Math.ceil((agi - 261000) / 7450);
        const keep = agi - 261000 > 29800 ? 0 : Math.max(0, 1 - 0.2 * steps);
        deduction *= keep;
        exemption *= keep;
      }
      break;
    case "UT":
      // Taxpayer tax credit: 6% of the federal standard deduction, phased
      // out at 1.3% of income over $18,696 (2026, indexed by statute).
      credit = Math.max(
        0,
        0.06 * FEDERAL_STANDARD_DEDUCTION - 0.013 * Math.max(0, agi - 18696)
      );
      break;
    case "WI":
      deduction =
        agi < 20120 ? 13960 : Math.max(0, 13960 - 0.12 * (agi - 20120));
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
      // 2026 and later: $332 plus 2.75% over $26,050 (R.C. 5747.02(A)(c)).
      tax = taxable <= 26050 ? 0 : 332 + 0.0275 * (taxable - 26050);
      if (taxable < 30000) credit = 20;
      break;
    case "CA":
      // Behavioral Health Services Tax: 1% of taxable income over $1,000,000.
      tax += 0.01 * Math.max(0, taxable - 1000000);
      break;
    case "UT":
      if (agi <= FEDERAL_STANDARD_DEDUCTION) tax = 0;
      break;
    case "VT":
      // Minimum tax of 3% of AGI above $150,000.
      if (agi > 150000) tax = Math.max(tax, 0.03 * agi);
      break;
  }

  return { tax: Math.max(0, tax - credit), taxable };
}

/**
 * Arkansas 2026: net taxable income x rate - adjustment (DFA withholding
 * formula effective 2026-01-01; 3.7% top rate from 2026 HB1001). The 2026
 * indexed thresholds are not published yet, so 2025's are used.
 */
function calcArkansasTax(nti: number): number {
  if (nti < 5600) return 0;
  if (nti < 11200) return nti * 0.02 - 111.98;
  if (nti < 16000) return nti * 0.03 - 223.97;
  if (nti < 26400) return nti * 0.034 - 287.97;
  if (nti <= 94700) return nti * 0.037 - 367.16;
  if (nti <= 97600) {
    const step = Math.ceil((nti - 94700) / 100) - 1;
    return nti * 0.037 - (369.9 - 10 * step);
  }
  return nti * 0.037 - 79.9;
}

/** Connecticut 2026 (unchanged from 2025): 2% phase-out add-back, recapture, and personal credit. */
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
 * New York 2026 supplemental tax (IT-2105-I 2026 worksheets, single): above
 * $107,650 AGI the benefit of the lower brackets is recaptured.
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
    const flat = taxable * 0.059;
    if (agi >= 157650) return flat;
    return scheduleTax + (flat - scheduleTax) * phase(107650);
  }
  if (taxable <= 1077550) return scheduleTax + 567 + 2047 * phase(215400);
  if (taxable <= 5000000) return scheduleTax + 2614 + 30172 * phase(1077550);
  return scheduleTax + 32786 + 32500 * phase(5000000);
}

/** 2026 local income tax for someone who lives and works in the city. */
function calcLocalTax(
  gross: number,
  cityId: string,
  stateTaxable: number
): number {
  const rule = LOCAL_TAX[cityId];
  if (!rule) return 0;
  switch (rule.kind) {
    case "wages":
      return gross * rule.rate;
    case "wagesLessExemption":
      return Math.max(0, gross - rule.exemption) * rule.rate;
    case "stateTaxable":
      return stateTaxable * rule.rate;
    case "pittsburgh":
      // 3% earned income tax, plus the $52 local services tax (refunded
      // when total income is under $12,000).
      return 0.03 * gross + (gross >= 12000 ? 52 : 0);
    case "nyc": {
      // NYC tax on NY taxable income, less the NYC school tax credits:
      // $63 fixed up to $250,000 of income, and the rate reduction amount
      // up to $500,000 of income (federal AGI, which is gross here).
      const tax = applyBrackets(stateTaxable, NYC_BRACKETS);
      const fixedCredit = gross <= 250000 ? 63 : 0;
      const rateReduction =
        gross > 500000
          ? 0
          : stateTaxable <= 12000
            ? 0.00171 * stateTaxable
            : 21 + 0.00228 * (stateTaxable - 12000);
      return Math.max(0, tax - fixedCredit - rateReduction);
    }
    case "portland": {
      // On Oregon taxable income: Metro SHS 1% over $128,000 (2026);
      // Multnomah PFA 1.5% over $125,000 plus 1.5% more over $250,000;
      // Arts Tax $50 above $20,000.
      const metro = 0.01 * Math.max(0, stateTaxable - 128000);
      const pfa =
        0.015 * Math.max(0, stateTaxable - 125000) +
        0.015 * Math.max(0, stateTaxable - 250000);
      const arts = stateTaxable > 20000 ? 50 : 0;
      return metro + pfa + arts;
    }
  }
}

export function calcTax(gross: number, city: CityRecord): TaxBreakdown {
  const federalTax = calcFederalTax(gross);
  const fica = calcFica(gross);
  const state = calcStateTax(gross, city.state, federalTax, fica);
  const stateTax = state.tax;
  const localTax = calcLocalTax(gross, city.id, state.taxable);
  const payrollLines = calcStatePayroll(gross, city.state);
  const payroll = payrollLines.reduce((sum, l) => sum + l.amount, 0);
  const totalTax = federalTax + stateTax + localTax + fica + payroll;
  const takeHome = gross - totalTax;
  return {
    gross,
    federalTax,
    stateTax,
    localTax,
    fica,
    payroll,
    payrollLines,
    totalTax,
    takeHome,
    takeHomeMonthly: takeHome / 12,
    effectiveRate: gross > 0 ? totalTax / gross : 0,
  };
}

/**
 * The verdict bands, in dollars left each month after rent, essentials,
 * loans and other fixed costs: under $0, under $300, under $800, and more.
 */
export const VERDICT_BANDS = { lean: 0, comfortable: 300, strong: 800 } as const;

/** What the rent in the answer stands for, so the copy can name it. */
interface RentBasis {
  shared: boolean;
  ownRent: boolean;
}

function getVerdict(discretionary: number, basis: RentBasis): Verdict {
  const amount = formatMoney(Math.abs(discretionary));
  let tier: VerdictTier;
  let label: string;
  let headline: string;
  let description: string;

  if (discretionary < VERDICT_BANDS.lean) {
    tier = "tight";
    label = "Short";
    headline = `About ${amount} short each month`;
    description = basis.ownRent
      ? "That is with your rent and typical costs here. Check the other costs below against your own numbers."
      : basis.shared
        ? "That is with your share of a typical shared place and typical costs here. Try the rent you would really pay."
        : "That is with a median 1-bedroom and typical costs here. Splitting rent with roommates or a cheaper place would close the gap, so try the roommates setting or the rent you would really pay.";
  } else if (discretionary < VERDICT_BANDS.comfortable) {
    tier = "lean";
    label = "Little left";
    headline = `About ${amount} left each month`;
    description =
      "That leaves little for surprises or savings. Check the rent and costs below against your own numbers.";
  } else if (discretionary < VERDICT_BANDS.strong) {
    tier = "comfortable";
    label = "Some room";
    headline = `About ${amount} left each month`;
    description =
      "Room to start saving, if your rent and costs land near these estimates.";
  } else {
    tier = "strong";
    label = "Room to save";
    headline = `About ${amount} left each month`;
    description =
      "Room to build savings, if your rent and costs land near these estimates.";
  }

  return { tier, label, headline, description };
}

export function analyzeOffer(offer: Offer): OfferAnalysis | null {
  const city = getCityById(offer.cityId);
  if (!city) return null;

  const tax = calcTax(offer.salary, city);

  const roommates = Math.min(Math.max(0, Math.round(offer.roommates ?? 0)), MAX_ROOMMATES);
  const people = roommates + 1;

  const rentIsOverride =
    typeof offer.rentOverride === "number" && offer.rentOverride >= 0;
  const rentEstimate = rentShare(city, roommates);
  const rent = rentIsOverride ? offer.rentOverride! : rentEstimate;

  const utilitiesIsOverride =
    typeof offer.utilitiesOverride === "number" && offer.utilitiesOverride >= 0;
  const utilitiesEstimate = electricityShare(city.state, people);
  const utilities = utilitiesIsOverride ? offer.utilitiesOverride! : utilitiesEstimate;

  const necessitiesIsOverride =
    typeof offer.necessitiesOverride === "number" &&
    offer.necessitiesOverride >= 0;
  const necessities = necessitiesIsOverride
    ? offer.necessitiesOverride!
    : essentialsFor(city);

  const loanPayment = Math.max(0, offer.loanPayment ?? 0);
  const otherFixed = Math.max(0, offer.otherFixed ?? 0);

  const totalMonthlyCosts = rent + utilities + necessities + loanPayment + otherFixed;
  const discretionary = tax.takeHomeMonthly - totalMonthlyCosts;

  return {
    offer,
    city,
    tax,
    rent,
    rentIsOverride,
    rentEstimate,
    roommates,
    people,
    utilities,
    utilitiesIsOverride,
    utilitiesEstimate,
    necessities,
    necessitiesIsOverride,
    loanPayment,
    otherFixed,
    totalMonthlyCosts,
    discretionary,
    verdict: getVerdict(discretionary, { shared: roommates > 0, ownRent: rentIsOverride }),
  };
}

function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}
