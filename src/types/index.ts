export interface Offer {
  salary: number;
  cityId: string; // matches City.id
  loanPayment: number;
  otherFixed: number;
  // Optional overrides (user can edit on results page)
  rentOverride?: number;
  necessitiesOverride?: number;
}

export interface City {
  id: string; // slug like "new-york-ny"
  name: string;
  state: string; // 2-letter abbreviation
  /** Median 1-bedroom asking rent, monthly USD (see src/data/cities.ts). */
  rent: number;
  rentSource: "report" | "cityPage";
  /** The county whose MIT Living Wage figures are used. */
  county: string;
  /** MIT annual costs: food, medical, transportation, internet and mobile, other. */
  mit: [number, number, number, number, number];
}

export interface PayrollLine {
  label: string;
  amount: number;
}

export interface TaxBreakdown {
  gross: number;
  federalTax: number;
  stateTax: number;
  localTax: number;
  fica: number;
  /** State paid leave, disability and similar premiums withheld from pay. */
  payroll: number;
  payrollLines: PayrollLine[];
  totalTax: number;
  takeHome: number;
  takeHomeMonthly: number;
  effectiveRate: number;
}

export interface OfferAnalysis {
  offer: Offer;
  city: City;
  tax: TaxBreakdown;
  rent: number;
  rentIsOverride: boolean;
  necessities: number;
  necessitiesIsOverride: boolean;
  loanPayment: number;
  otherFixed: number;
  totalMonthlyCosts: number;
  discretionary: number;
  verdict: Verdict;
}

export type VerdictTier = "tight" | "lean" | "comfortable" | "strong";

export interface Verdict {
  tier: VerdictTier;
  /** The band's name, e.g. "Some room". */
  label: string;
  /** Short heading, e.g. "About $587 short each month". */
  headline: string;
  /** One or two plain sentences: what it means and one next step. */
  description: string;
}

export type AppView = "quiz" | "results" | "comparison";
