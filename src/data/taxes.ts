/**
 * 2026 state, local and payroll rules for Offer Lab.
 *
 * Scope: single filer, under 65, no dependents, W-2 wages only, standard
 * deduction, full-year resident who lives and works in the city. Tax year
 * 2026 is used everywhere (federal, state, local, payroll) because it is the
 * latest year with published figures for the IRS, the SSA and nearly every
 * state. Checked against primary sources on 2026-11-15.
 *
 * Not yet published for 2026, so the statute's own formula is used (re-check
 * when the 2026 forms come out):
 * - AR: 2026 indexed thresholds, deduction and credit (2025 values with the
 *   3.7% top rate from HB1001 of the 2026 fiscal session)
 * - AZ: standard deduction ($16,100, indexed like the federal deduction,
 *   A.R.S. 43-1041(H))
 * - CA: exemption credit phase-out threshold ($252,203 x 1.034 = $260,778)
 * - ID: zero bracket ($2,500 x 2025 CPI-U 321.943 / 163.0 = $4,938)
 * - LA: return deduction (the department's 2026 withholding figure, $12,875)
 * - UT: credit phase-out base ($15,095 indexed by CPI-U = $18,696)
 * - VT: brackets (the 2026 withholding table less its $3,925 offset)
 *
 * Sources, 2026 (state revenue department pages, forms, withholding formulas
 * or statutes):
 * - AL: revenue.alabama.gov/wp-content/uploads/2026/01/whbooklet_0126.pdf
 * - AR: dfa.arkansas.gov/wp-content/uploads/Withholding-Tax-Formula.pdf (eff.
 *       2026-01-01, rev. 2026-05-29); arkleg.state.ar.us 2026S1 HB1001
 * - AZ: azleg.gov/ars/43/01041.htm; azdor.gov 2026 140ES
 * - CA: ftb.ca.gov/about-ftb/newsroom/tax-news/2026/10.html (2026 indexed
 *       amounts); 2025 540 instructions (Behavioral Health Services Tax)
 * - CO: leg.colorado.gov 2025a_1274_enr.pdf (deduction add-back from 2026);
 *       Legislative Council September 2026 forecast (4.40% rate)
 * - CT: portal.ct.gov/-/media/drs/publications/pubsip/2026/ip-2026-1.pdf
 *       ("unchanged from 2025")
 * - DC: code.dccouncil.gov/us/dc/council/code/sections/47-1801.04
 * - DE: delcode.delaware.gov/title30/c011 (sections 1102, 1108, 1110)
 * - GA: legis.ga.gov HB 463 (2026); dor.georgia.gov 2026 Employer's Tax Guide
 * - HI: files.hawaii.gov/tax/news/announce/ann24-03.pdf
 * - IA: revenue.iowa.gov press release 2025-10-21; Iowa Code 422.5, 422.12
 * - ID: Idaho Code 63-3024; 2026 H0559; tax.idaho.gov EPB00744 (2026)
 * - IL: tax.illinois.gov IL-700-T (2026 exemption $2,925)
 * - IN: in.gov/dor/files/dn01.pdf (Departmental Notice #1)
 * - KS: K.S.A. 79-32,110, 79-32,119, 79-32,121; ksrevenue.gov Notice 25-06
 * - KY: revenue.ky.gov/Forms/2026 Withholding Formula.pdf
 * - LA: dam.ldr.la.gov/taxforms/1306-1-26.pdf; R.S. 47:294
 * - MA: mass.gov/info-details/tax-rates; G.L. c.62 s.3
 * - MD: marylandcomptroller.gov 2026 withholding (pm330.pdf); Tax-General
 *       10-105, 10-211, 10-217
 * - MI: michigan.gov/taxes/business-taxes/withholding/calendar-year-tax-information
 * - MN: revenue.state.mn.us press release 2025-12-16 and
 *       inflation-adjusted-amounts-2026.pdf; Minn. Stat. 290.0123
 * - MO: dor.mo.gov/forms/4282_2026.pdf; RSMo 143.171
 * - NC: ncdor.gov tax rate schedules; G.S. 105-153.5, 105-153.7
 * - NE: revenue.nebraska.gov 2026 Form 1040N-ES
 * - NM: nmlegis.gov 2024 HB 252 (section 7-2-7); 2025 PIT-1 instructions
 * - NY: tax.ny.gov/pdf/2026/inc/it2105i_2026.pdf (rates, NYC schedule, school
 *       tax credits and the supplemental tax worksheets)
 * - OH: codes.ohio.gov R.C. 5747.02, 5747.022, 5747.025; LSC HB 96 analysis
 * - OK: 2025 HB 2764 (enrolled); oklahoma.gov WHTables-2026.pdf
 * - OR: oregon.gov/dor withholding-tax-formulas_206-436_2026.pdf
 * - PA: pa.gov personal income tax (3.07%)
 * - RI: tax.ri.gov ADV 2025-22 inflation adjustments
 * - UT: le.utah.gov 2026 SB 60 (4.45%); Utah Code 59-10-1018, 59-10-104.1
 * - VA: Va. Code 58.1-320, 58.1-322.03; tax.virginia.gov new laws (2026)
 * - VT: tax.vermont.gov GB-1210-2026; 2026 Fall Symposium slides
 * - WI: revenue.wi.gov/TaxForms2026/2026-Form1-ES-inst.pdf
 * - No tax on wages: FL, NV, TN, TX, WA.
 *
 * Local sources (2026):
 * - NYC: IT-2105-I (2026) NYC schedule and school tax credits
 * - Philadelphia: phila.gov wage tax (3.74% to Jun 30, 3.735% from Jul 1)
 * - Pittsburgh: pittsburghpa.gov taxes (EIT 1% city + 2% school; LST $52)
 * - Baltimore City: Maryland Withholding Tax Facts 2026 (3.20%)
 * - Columbus: columbus.gov; Cleveland: ccaohio.gov; Cincinnati: cincinnati-oh.gov
 * - Detroit: michigan.gov Form 5123 (2026); Grand Rapids: grandrapidsmi.gov
 * - Indianapolis: in.gov/dor/files/dn01.pdf (Marion 2.02%)
 * - Louisville: louisvilleky.gov 2026 Form W-1 (2.2%)
 * - Lexington: lexingtonky.gov (2.25%); fcps.net school tax (0.5%)
 * - Kansas City and St. Louis: 1% earnings tax; Birmingham: city code 3A-2
 * - Wilmington: wilmingtonde.gov earned income tax regulations (1.25%)
 * - Portland: portland.gov/revenue/personal-tax (Metro $128,000 for 2026,
 *   Multnomah PFA); portland.gov/revenue/arts-tax ($50)
 *
 * Not modeled: Washington's hourly workers' compensation deduction and
 * Oregon's Workers' Benefit Fund (cents per hour, vary by job), Denver's
 * $5.75/month occupational privilege tax, Idaho's $10 permanent building fund
 * tax and grocery credit, Arkansas's low-income table, refundable credits.
 */

/** [upper bound of taxable income band, marginal rate]; last bound is Infinity. */
export type Brackets = Array<[number, number]>;

export interface StateTaxRule {
  brackets: Brackets;
  /** Start from federal taxable income (wages minus federal standard deduction). */
  startsFromFederalTaxable?: boolean;
  standardDeduction?: number;
  personalExemption?: number;
  /** Nonrefundable personal credit subtracted from tax. */
  personalCredit?: number;
}

export const TAX_YEAR = 2026;

/** States with no tax on wage income are simply absent. */
export const STATE_TAX: Record<string, StateTaxRule> = {
  // Sliding standard deduction and federal income tax deduction handled in calculator.
  AL: { brackets: [[500, 0.02], [3000, 0.04], [Infinity, 0.05]], personalExemption: 1500 },
  // Rate-minus-adjustment table handled in calculator.
  AR: { brackets: [], standardDeduction: 2470, personalCredit: 29 },
  AZ: { brackets: [[Infinity, 0.025]], standardDeduction: 16100 },
  CA: {
    brackets: [
      [11456, 0.01], [27157, 0.02], [42861, 0.04], [59498, 0.06], [75197, 0.08],
      [384109, 0.093], [460927, 0.103], [768213, 0.113], [Infinity, 0.123],
    ],
    standardDeduction: 5900,
    personalCredit: 158,
  },
  // Deduction add-back at AGI of $300,000 or more handled in calculator.
  CO: { brackets: [[Infinity, 0.044]], startsFromFederalTaxable: true },
  // Exemption, 2% add-back, recapture, and credit tables handled in calculator.
  CT: {
    brackets: [
      [10000, 0.02], [50000, 0.045], [100000, 0.055], [200000, 0.06],
      [250000, 0.065], [500000, 0.069], [Infinity, 0.0699],
    ],
  },
  DC: {
    brackets: [
      [10000, 0.04], [40000, 0.06], [60000, 0.065], [250000, 0.085],
      [500000, 0.0925], [1000000, 0.0975], [Infinity, 0.1075],
    ],
    standardDeduction: 15000, // DC's own amount; first indexed in 2027
  },
  DE: {
    brackets: [
      [2000, 0], [5000, 0.022], [10000, 0.039], [20000, 0.048],
      [25000, 0.052], [60000, 0.0555], [Infinity, 0.066],
    ],
    standardDeduction: 3250,
    personalCredit: 110,
  },
  GA: { brackets: [[Infinity, 0.0499]], standardDeduction: 15000 },
  HI: {
    brackets: [
      [9600, 0.014], [14400, 0.032], [19200, 0.055], [24000, 0.064],
      [36000, 0.068], [48000, 0.072], [125000, 0.076], [175000, 0.079],
      [225000, 0.0825], [275000, 0.09], [325000, 0.1], [Infinity, 0.11],
    ],
    standardDeduction: 8000,
    personalExemption: 1144,
  },
  IA: { brackets: [[Infinity, 0.038]], startsFromFederalTaxable: true, personalCredit: 40 },
  ID: { brackets: [[4938, 0], [Infinity, 0.053]], standardDeduction: 16100 },
  // Exemption is lost entirely above $250,000 AGI (handled in calculator).
  IL: { brackets: [[Infinity, 0.0495]], personalExemption: 2925 },
  IN: { brackets: [[Infinity, 0.0295]], personalExemption: 1000 },
  KS: { brackets: [[23000, 0.052], [Infinity, 0.0558]], standardDeduction: 3605, personalExemption: 9160 },
  KY: { brackets: [[Infinity, 0.035]], standardDeduction: 3360 },
  LA: { brackets: [[Infinity, 0.03]], standardDeduction: 12875 },
  // Employee Social Security + Medicare deduction (max $2,000) handled in calculator.
  // 4% surtax on income over $1,107,750.
  MA: { brackets: [[1107750, 0.05], [Infinity, 0.09]], personalExemption: 4400 },
  // Personal exemption phase-out handled in calculator.
  MD: {
    brackets: [
      [1000, 0.02], [2000, 0.03], [3000, 0.04], [100000, 0.0475],
      [125000, 0.05], [150000, 0.0525], [250000, 0.055], [500000, 0.0575],
      [1000000, 0.0625], [Infinity, 0.065],
    ],
    standardDeduction: 3400,
  },
  MI: { brackets: [[Infinity, 0.0425]], personalExemption: 5900 },
  // Standard deduction phase-out above $244,400 handled in calculator.
  MN: {
    brackets: [[33310, 0.0535], [109430, 0.068], [203150, 0.0785], [Infinity, 0.0985]],
    standardDeduction: 15300,
  },
  // Federal income tax deduction handled in calculator.
  MO: {
    brackets: [
      [1348, 0], [2696, 0.02], [4044, 0.025], [5392, 0.03], [6740, 0.035],
      [8088, 0.04], [9436, 0.045], [Infinity, 0.047],
    ],
    standardDeduction: 16100,
  },
  NC: { brackets: [[Infinity, 0.0399]], standardDeduction: 12750 },
  NE: {
    brackets: [[4130, 0.0246], [24760, 0.0351], [39900, 0.0455], [Infinity, 0.0455]],
    standardDeduction: 8850,
    personalCredit: 176,
  },
  // Low- and middle-income exemption handled in calculator.
  NM: {
    brackets: [
      [5500, 0.015], [16500, 0.032], [33500, 0.043], [66500, 0.047],
      [210000, 0.049], [Infinity, 0.059],
    ],
    standardDeduction: 16100,
  },
  // Supplemental tax (benefit recapture) above $107,650 AGI handled in calculator.
  NY: {
    brackets: [
      [8500, 0.039], [11700, 0.044], [13900, 0.0515], [80650, 0.054],
      [215400, 0.059], [1077550, 0.0685], [5000000, 0.0965],
      [25000000, 0.103], [Infinity, 0.109],
    ],
    standardDeduction: 8000,
  },
  // Flat 2.75% over $26,050 and income-based exemption handled in calculator.
  OH: { brackets: [] },
  OK: {
    brackets: [[3750, 0], [4900, 0.025], [7200, 0.035], [Infinity, 0.045]],
    standardDeduction: 6350,
    personalExemption: 1000,
  },
  // Federal tax subtraction and credit cutoff handled in calculator.
  OR: {
    brackets: [[4550, 0.0475], [11400, 0.0675], [125000, 0.0875], [Infinity, 0.099]],
    standardDeduction: 2910,
    personalCredit: 263,
  },
  PA: { brackets: [[Infinity, 0.0307]] },
  // Deduction and exemption phase-out above $261,000 handled in calculator.
  RI: {
    brackets: [[82050, 0.0375], [186450, 0.0475], [Infinity, 0.0599]],
    standardDeduction: 11200,
    personalExemption: 5250,
  },
  // Taxpayer tax credit handled in calculator.
  UT: { brackets: [[Infinity, 0.0445]] },
  VA: {
    brackets: [[3000, 0.02], [5000, 0.03], [17000, 0.05], [Infinity, 0.0575]],
    standardDeduction: 8750,
    personalExemption: 930,
  },
  VT: {
    brackets: [[50750, 0.0335], [122850, 0.066], [256300, 0.076], [Infinity, 0.0875]],
    standardDeduction: 7850,
    personalExemption: 5400,
  },
  // Sliding standard deduction handled in calculator.
  WI: {
    brackets: [[15110, 0.035], [51950, 0.044], [332720, 0.053], [Infinity, 0.0765]],
    personalExemption: 700,
  },
};

/**
 * Local income taxes, keyed by city id. Cities not listed have none.
 * - wages: flat rate on gross wages
 * - wagesLessExemption: flat rate on wages minus a per-person exemption
 * - stateTaxable: flat rate on the state's taxable income
 * - nyc / portland / pittsburgh: handled in calculator
 */
export type LocalTaxRule =
  | { kind: "wages"; rate: number }
  | { kind: "wagesLessExemption"; rate: number; exemption: number }
  | { kind: "stateTaxable"; rate: number }
  | { kind: "nyc" }
  | { kind: "portland" }
  | { kind: "pittsburgh" };

export const LOCAL_TAX: Record<string, LocalTaxRule> = {
  "new-york-ny": { kind: "nyc" },
  // 3.74% Jan-Jun 2026 and 3.735% Jul-Dec 2026, blended for the year.
  "philadelphia-pa": { kind: "wages", rate: 0.037375 },
  // 3% earned income tax plus the $52 local services tax.
  "pittsburgh-pa": { kind: "pittsburgh" },
  "baltimore-md": { kind: "stateTaxable", rate: 0.032 },
  "columbus-oh": { kind: "wages", rate: 0.025 },
  "cleveland-oh": { kind: "wages", rate: 0.025 },
  "cincinnati-oh": { kind: "wages", rate: 0.018 },
  "detroit-mi": { kind: "wagesLessExemption", rate: 0.024, exemption: 600 },
  "grand-rapids-mi": { kind: "wagesLessExemption", rate: 0.015, exemption: 600 },
  "indianapolis-in": { kind: "wagesLessExemption", rate: 0.0202, exemption: 1000 },
  "louisville-ky": { kind: "wages", rate: 0.022 },
  "lexington-ky": { kind: "wages", rate: 0.0275 },
  "kansas-city-mo": { kind: "wages", rate: 0.01 },
  "st-louis-mo": { kind: "wages", rate: 0.01 },
  "birmingham-al": { kind: "wages", rate: 0.01 },
  "wilmington-de": { kind: "wages", rate: 0.0125 },
  "portland-or": { kind: "portland" },
};

export const NYC_BRACKETS: Brackets = [
  [12000, 0.03078], [25000, 0.03762], [50000, 0.03819], [Infinity, 0.03876],
];

/**
 * Mandatory employee payroll premiums withheld by the state, 2026: paid leave,
 * disability, long-term care and similar. A rate on wages, optionally up to a
 * wage cap or a yearly maximum, or a flat yearly amount. Several programs set
 * the most an employer may withhold; the maximum is used.
 *
 * Sources: edd.ca.gov rates and withholding (SDI 1.3%, no cap);
 * paidfamilyleave.ny.gov/2026 (0.432%, max $411.91); wcb.ny.gov disability
 * ($0.60/week); paidleave.wa.gov 2026 toolkit (1.13% x 71.43% employee share,
 * to $184,500); wacaresfund.wa.gov (0.58%, no cap); paidleave.oregon.gov
 * (60% of 1%, to $184,500); oregon.gov statewide transit tax (0.1%);
 * famli.colorado.gov (0.44%); ctpaidleave.org (0.5%); mass.gov PFML (0.46%
 * for 25+ employees); dlt.ri.gov 2026 quick reference (TDI 1.1% of first
 * $100,000); pl.mn.gov (0.44%, Minn. Stat. 268B.14); delcode.delaware.gov
 * title 19 ch. 37 (0.4%); labor.hawaii.gov 2026 TDI wage base (max $7.50 a
 * week); pa.gov UC contributions (0.07%); tax.vermont.gov child care
 * contribution (up to 0.11%); nmlegis.gov 2025 SB 535 ($2.25 a quarter).
 */
export interface PayrollRule {
  label: string;
  rate: number;
  wageCap?: number;
  maxAnnual?: number;
  flatAnnual?: number;
}

const SS_WAGE_BASE = 184500;

export const STATE_PAYROLL: Record<string, PayrollRule[]> = {
  CA: [{ label: "State disability insurance (SDI)", rate: 0.013 }],
  CO: [{ label: "FAMLI paid leave", rate: 0.0044, wageCap: SS_WAGE_BASE }],
  CT: [{ label: "CT Paid Leave", rate: 0.005, wageCap: SS_WAGE_BASE }],
  DE: [{ label: "Delaware Paid Leave", rate: 0.004, wageCap: SS_WAGE_BASE }],
  HI: [{ label: "Temporary disability insurance", rate: 0.005, maxAnnual: 390 }],
  MA: [{ label: "Paid family and medical leave", rate: 0.0046, wageCap: SS_WAGE_BASE }],
  MN: [{ label: "Minnesota Paid Leave", rate: 0.0044, wageCap: SS_WAGE_BASE }],
  NM: [{ label: "Workers' comp fee", rate: 0, flatAnnual: 9 }],
  NY: [
    { label: "Paid family leave", rate: 0.00432, maxAnnual: 411.91 },
    { label: "Disability insurance", rate: 0.005, maxAnnual: 31.2 },
  ],
  OR: [
    { label: "Paid Leave Oregon", rate: 0.006, wageCap: SS_WAGE_BASE },
    { label: "Statewide transit tax", rate: 0.001 },
  ],
  PA: [{ label: "Unemployment insurance", rate: 0.0007 }],
  RI: [{ label: "Temporary disability insurance", rate: 0.011, wageCap: 100000 }],
  VT: [{ label: "Child care contribution", rate: 0.0011 }],
  WA: [
    { label: "Paid family and medical leave", rate: 0.0113 * 0.7143, wageCap: SS_WAGE_BASE },
    { label: "WA Cares long-term care", rate: 0.0058 },
  ],
};
