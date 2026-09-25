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
  median1BR: number; // monthly rent in USD
  colIndex: number; // necessities cost multiplier (1.0 = national avg)
}

export interface TaxBreakdown {
  gross: number;
  federalTax: number;
  stateTax: number;
  localTax: number;
  fica: number;
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
  label: string;
  description: string;
}

export type AppView = "quiz" | "results" | "comparison";
