/**
 * 2025 state and local income tax rules for Offer Lab.
 *
 * Scope: single filer, under 65, no dependents, W-2 wages only, standard
 * deduction, full-year resident who lives and works in the city. Tax year
 * 2025 is used everywhere (federal, state, local) because it is the most
 * recent year every state has published final brackets for.
 *
 * Amounts are computed from each state's rate schedule. States that require
 * filers below a cutoff to use a $50/$100-row tax table can differ from the
 * filed figure by a few dollars.
 *
 * Sources (official 2025 forms, instructions, or rate schedules):
 * - AL: revenue.alabama.gov/wp-content/uploads/2026/01/25f40bk.pdf
 * - AR: dfa.arkansas.gov/wp-content/uploads/2025_TaxBrackets.pdf;
 *       dfa.arkansas.gov/wp-content/uploads/2025_AR1000F_and_AR1000NR_Instructions.pdf
 * - AZ: azdor.gov/sites/default/files/document/FORMS_INDIVIDUAL_2025_140i.pdf
 * - CA: ftb.ca.gov/forms/2025/2025-540-tax-rate-schedules.pdf;
 *       ftb.ca.gov/forms/2025/2025-540-instructions.html
 * - CO: tax.colorado.gov/sites/tax/files/documents/Book104_2025.pdf
 * - CT: portal.ct.gov/-/media/drs/forms/2025/income/2025-ct-1040-instructions_1225.pdf;
 *       portal.ct.gov/-/media/drs/forms/2025/income/2025-income-tax-tables.pdf
 * - DC: otr.cfo.dc.gov 2025 D-40 booklet (2025_D40_Book_082026_v1.pdf)
 * - DE: revenuefiles.delaware.gov/2025/TY25_taxtable.pdf; 2025 PIT-RES
 *       instructions; 30 Del. C. §1102
 * - GA: dor.georgia.gov 2025 IT-511 individual income tax booklet
 * - HI: files.hawaii.gov/tax/forms/current/n11ins.pdf (Rev 2025)
 * - IA: revenue.iowa.gov 2025 IA 1040 and expanded instructions
 * - ID: tax.idaho.gov individual income tax rate schedule; 2025 Form 40
 *       instructions (EIN00046)
 * - IL: tax.illinois.gov 2025 IL-1040 instructions
 * - IN: forms.in.gov 2025 Form IT-40 and Schedule 3
 * - KS: ksrevenue.gov/pdf/ip25.pdf
 * - KY: revenue.ky.gov/Forms/740 (2025).pdf; 740-NP packet instructions (2025)
 * - LA: dam.ldr.la.gov/taxforms/IT540i-WEB-2025-Revised-7-26.pdf
 * - MA: mass.gov/info-details/massachusetts-tax-rates;
 *       mass.gov/info-details/massachusetts-personal-income-tax-exemptions;
 *       mass.gov/info-details/massachusetts-social-security-fica-and-medicare-deduction
 * - MD: marylandcomptroller.gov/content/dam/mdcomp/tax/instructions/2025/resident-booklet.pdf
 * - MI: michigan.gov TY2025 MI-1040 booklet
 * - MN: revenue.state.mn.us/sites/default/files/2026-07/m1-inst-25.pdf;
 *       revenue.state.mn.us inflation-adjusted-amounts-2025.pdf
 * - MO: dor.mo.gov/forms/MO-1040 Instructions_2025.pdf; 2025 Tax Chart
 * - NC: ncdor.gov 2025 D-401 instructions
 * - NE: revenue.nebraska.gov 2025 Tax Calculation Schedule and 2025
 *       individual income tax booklet
 * - NM: nmlegis.gov HB 252 (2024), §7-2-7 NMSA rates for 2025;
 *       realfile.tax.newmexico.gov/2025pit-1-ins.pdf
 * - NY: tax.ny.gov/pdf/2025/inc/it201i_2025.pdf (IT-201-I, incl. NYC schedule
 *       and tax computation worksheets)
 * - OH: tax.ohio.gov 2025 IT 1040 booklet; codes.ohio.gov R.C. 5747.02
 * - OK: oklahoma.gov 2025 Form 511 packet and tax table
 * - OR: oregon.gov/dor form-or-40-inst_101-040-1_2025.pdf;
 *       publication-or-17_101-431_2025.pdf
 * - PA: revenue.pa.gov 2025 PA-40 instructions
 * - RI: tax.ri.gov 2025 RI-1040 instructions; ADV 2025-22 inflation adjustments
 * - UT: tax.utah.gov/forms/current/tc-40inst.pdf (2025)
 * - VA: tax.virginia.gov/sites/default/files/vatax-pdf/2025-760-instructions.pdf
 * - VT: tax.vermont.gov IN-111-Instr-2025.pdf; TaxRateSched-2025.pdf
 * - WI: revenue.wi.gov 2025 Form 1 instructions; 2025 Wis. Act 15 bracket
 *       change (revenue.wi.gov 2025 tax update); LFB Paper #328 (standard
 *       deduction formula)
 * - No wage income tax: FL, NV, TN, TX, WA.
 *
 * Local sources:
 * - NYC: IT-201-I (2025) NYC rate schedule and school tax credits
 * - Philadelphia: phila.gov Wage Tax pages (3.75% to Jun 30 2025, 3.74% after)
 * - Pittsburgh: PA DCED EIT register (city 1% + Pittsburgh SD 2%)
 * - Baltimore City: 2025 Maryland resident booklet, local tax rate chart
 * - Columbus: columbus.gov; Cleveland: ccaohio.gov; Cincinnati: cincinnati-oh.gov
 * - Detroit: michigan.gov 2025 Form 5118; Grand Rapids: grandrapidsmi.gov
 *   2025 resident return
 * - Indianapolis: in.gov/dor 2025 county income tax rates (Marion 2.02%)
 * - Louisville: louisvilleky.gov Form W-1 instructions (2025)
 * - Lexington: lexingtonky.gov occupational license fee; fcps.net school tax
 * - Kansas City: kcmo.gov earnings tax; St. Louis: stlouis-mo.gov earnings tax
 * - Birmingham: Birmingham City Code Title 3A, Ch. 2 (occupational tax)
 * - Wilmington: wilmingtonde.gov Earned Income Tax Regulations
 * - Portland: oregonmetro.gov SHS tax; multco.us Preschool for All tax
 *
 * Not modeled: state payroll insurance deductions (e.g. CA SDI, Paid Leave
 * Oregon), Denver's $5.75/month occupational privilege tax, Idaho's $10
 * permanent building fund tax and grocery credit, other refundable credits.
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

export const TAX_YEAR = 2025;

/** States with no tax on wage income are simply absent. */
export const STATE_TAX_2025: Record<string, StateTaxRule> = {
  // Sliding standard deduction and federal income tax deduction handled in calculator.
  AL: { brackets: [[500, 0.02], [3000, 0.04], [Infinity, 0.05]], personalExemption: 1500 },
  // Rate-minus-adjustment table handled in calculator.
  AR: { brackets: [], standardDeduction: 2470, personalCredit: 29 },
  AZ: { brackets: [[Infinity, 0.025]], standardDeduction: 15750 },
  CA: {
    brackets: [
      [11079, 0.01], [26264, 0.02], [41452, 0.04], [57542, 0.06], [72724, 0.08],
      [371479, 0.093], [445771, 0.103], [742953, 0.113], [Infinity, 0.123],
    ],
    standardDeduction: 5706,
    personalCredit: 153,
  },
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
    standardDeduction: 15000, // DC decoupled from the federal $15,750
  },
  DE: {
    brackets: [
      [2000, 0], [5000, 0.022], [10000, 0.039], [20000, 0.048],
      [25000, 0.052], [60000, 0.0555], [Infinity, 0.066],
    ],
    standardDeduction: 3250,
    personalCredit: 110,
  },
  GA: { brackets: [[Infinity, 0.0519]], standardDeduction: 12000 },
  HI: {
    brackets: [
      [9600, 0.014], [14400, 0.032], [19200, 0.055], [24000, 0.064],
      [36000, 0.068], [48000, 0.072], [125000, 0.076], [175000, 0.079],
      [225000, 0.0825], [275000, 0.09], [325000, 0.1], [Infinity, 0.11],
    ],
    standardDeduction: 4400,
    personalExemption: 1144,
  },
  IA: { brackets: [[Infinity, 0.038]], startsFromFederalTaxable: true, personalCredit: 40 },
  ID: { brackets: [[4811, 0], [Infinity, 0.053]], standardDeduction: 15750 },
  // Exemption is lost entirely above $250,000 AGI (handled in calculator).
  IL: { brackets: [[Infinity, 0.0495]], personalExemption: 2850 },
  IN: { brackets: [[Infinity, 0.03]], personalExemption: 1000 },
  KS: { brackets: [[23000, 0.052], [Infinity, 0.0558]], standardDeduction: 3605, personalExemption: 9160 },
  KY: { brackets: [[Infinity, 0.04]], standardDeduction: 3270 },
  LA: { brackets: [[Infinity, 0.03]], standardDeduction: 12500 },
  // Employee Social Security + Medicare deduction (max $2,000) handled in calculator.
  // 4% surtax on income over $1,083,150.
  MA: { brackets: [[1083150, 0.05], [Infinity, 0.09]], personalExemption: 4400 },
  // Personal exemption phase-out handled in calculator.
  MD: {
    brackets: [
      [1000, 0.02], [2000, 0.03], [3000, 0.04], [100000, 0.0475],
      [125000, 0.05], [150000, 0.0525], [250000, 0.055], [500000, 0.0575],
      [1000000, 0.0625], [Infinity, 0.065],
    ],
    standardDeduction: 3350,
  },
  MI: { brackets: [[Infinity, 0.0425]], personalExemption: 5800 },
  // Standard deduction phase-out above $238,950 handled in calculator.
  MN: {
    brackets: [[32570, 0.0535], [106990, 0.068], [198630, 0.0785], [Infinity, 0.0985]],
    standardDeduction: 14950,
  },
  // Federal income tax deduction handled in calculator.
  MO: {
    brackets: [
      [1313, 0], [2626, 0.02], [3939, 0.025], [5252, 0.03], [6565, 0.035],
      [7878, 0.04], [9191, 0.045], [Infinity, 0.047],
    ],
    standardDeduction: 15750,
  },
  NC: { brackets: [[Infinity, 0.0425]], standardDeduction: 12750 },
  NE: {
    brackets: [[4030, 0.0246], [24120, 0.0351], [38870, 0.0501], [Infinity, 0.052]],
    standardDeduction: 8600,
    personalCredit: 171,
  },
  // Low- and middle-income exemption handled in calculator.
  NM: {
    brackets: [
      [5500, 0.015], [16500, 0.032], [33500, 0.043], [66500, 0.047],
      [210000, 0.049], [Infinity, 0.059],
    ],
    standardDeduction: 15750,
  },
  // Supplemental tax (benefit recapture) above $107,650 AGI handled in calculator.
  NY: {
    brackets: [
      [8500, 0.04], [11700, 0.045], [13900, 0.0525], [80650, 0.055],
      [215400, 0.06], [1077550, 0.0685], [5000000, 0.0965],
      [25000000, 0.103], [Infinity, 0.109],
    ],
    standardDeduction: 8000,
  },
  // Schedule with statutory base amounts and income-based exemption handled in calculator.
  OH: { brackets: [] },
  OK: {
    brackets: [
      [1000, 0.0025], [2500, 0.0075], [3750, 0.0175], [4900, 0.0275],
      [7200, 0.0375], [Infinity, 0.0475],
    ],
    standardDeduction: 6350,
    personalExemption: 1000,
  },
  // Federal tax subtraction and credit cutoff handled in calculator.
  OR: {
    brackets: [[4400, 0.0475], [11100, 0.0675], [125000, 0.0875], [Infinity, 0.099]],
    standardDeduction: 2835,
    personalCredit: 256,
  },
  PA: { brackets: [[Infinity, 0.0307]] },
  // Deduction and exemption phase-out above $254,250 handled in calculator.
  RI: {
    brackets: [[79900, 0.0375], [181650, 0.0475], [Infinity, 0.0599]],
    standardDeduction: 10900,
    personalExemption: 5100,
  },
  // Taxpayer tax credit handled in calculator.
  UT: { brackets: [[Infinity, 0.045]] },
  VA: {
    brackets: [[3000, 0.02], [5000, 0.03], [17000, 0.05], [Infinity, 0.0575]],
    standardDeduction: 8750,
    personalExemption: 930,
  },
  VT: {
    brackets: [[49400, 0.0335], [119700, 0.066], [249700, 0.076], [Infinity, 0.0875]],
    standardDeduction: 7650,
    personalExemption: 5300,
  },
  // Sliding standard deduction handled in calculator.
  WI: {
    brackets: [[14680, 0.035], [50480, 0.044], [323290, 0.053], [Infinity, 0.0765]],
    personalExemption: 700,
  },
};

/**
 * Local income taxes, keyed by city id. Cities not listed have none.
 * - wages: flat rate on gross wages
 * - wagesLessExemption: flat rate on wages minus a per-person exemption
 * - stateTaxable: flat rate on the state's taxable income
 * - nyc / portland: progressive or threshold taxes handled in calculator
 */
export type LocalTaxRule =
  | { kind: "wages"; rate: number }
  | { kind: "wagesLessExemption"; rate: number; exemption: number }
  | { kind: "stateTaxable"; rate: number }
  | { kind: "nyc" }
  | { kind: "portland" };

export const LOCAL_TAX_2025: Record<string, LocalTaxRule> = {
  "new-york-ny": { kind: "nyc" },
  // 3.75% Jan-Jun 2025 and 3.74% Jul-Dec 2025, blended for the year.
  "philadelphia-pa": { kind: "wages", rate: 0.03745 },
  "pittsburgh-pa": { kind: "wages", rate: 0.03 },
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

export const NYC_BRACKETS_2025: Brackets = [
  [12000, 0.03078], [25000, 0.03762], [50000, 0.03819], [Infinity, 0.03876],
];
