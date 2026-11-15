// Independent money oracle for Offer Lab, tax year 2026. Written from the primary sources cited beside each figure,
// never from the app's code: the tests compare what the app SHOWS with what these rules give.
// Scope: single filer, under 65, no dependents, W-2 wages only, standard deduction, lives and works in the city.

// IRS, Rev. Proc. 2025-32 (newsroom: "IRS releases tax inflation adjustments for tax year 2026"):
// standard deduction $16,100; 10% to $12,400, 12% to $50,400, 22% to $105,700, 24% to $201,775, 32% to $256,225,
// 35% to $640,600, 37% above.
export function federalTax(wages) {
  const t = Math.max(0, wages - 16100);
  const b = [[12400, 0.10], [50400, 0.12], [105700, 0.22], [201775, 0.24], [256225, 0.32], [640600, 0.35], [Infinity, 0.37]];
  let tax = 0, lo = 0;
  for (const [hi, r] of b) { if (t > lo) tax += (Math.min(t, hi) - lo) * r; lo = hi; }
  return tax;
}

// SSA 2026 wage base $184,500 (Federal Register 2025-19763); 6.2% Social Security, 1.45% Medicare,
// plus 0.9% Additional Medicare Tax on wages over $200,000 (IRC 3101(b)(2), not indexed).
export const fica = w => 0.062 * Math.min(w, 184500) + 0.0145 * w + 0.009 * Math.max(0, w - 200000);

// Massachusetts: 5% (mass.gov tax rates), $4,400 exemption (G.L. c.62 3(B)(b)(1)(A)), Social Security and Medicare
// deduction up to $2,000 (c.62 3(B)(a)(3)); 4% surtax above $1,107,750 for 2026.
export function maTax(w) {
  const taxable = Math.max(0, w - Math.min(2000, fica(w)) - 4400);
  return 0.05 * taxable + 0.04 * Math.max(0, taxable - 1107750);
}

// New York, 2026 (IT-2105-I 2026 rate schedule): 3.9% to 8,500; 4.4% to 11,700; 5.15% to 13,900; 5.4% to 80,650;
// 5.9% to 215,400; 6.85% to 1,077,550 ... Standard deduction $8,000. The supplemental tax starts above $107,650 AGI,
// so it does not apply to the profiles below, which assert that.
export function nyTaxable(w) { return Math.max(0, w - 8000); }
export function nyTax(w) {
  if (w > 107650) throw new Error('oracle: NY supplemental tax not modeled here');
  const t = nyTaxable(w);
  const b = [[8500, 0.039], [11700, 0.044], [13900, 0.0515], [80650, 0.054], [215400, 0.059]];
  let tax = 0, lo = 0;
  for (const [hi, r] of b) { if (t > lo) tax += (Math.min(t, hi) - lo) * r; lo = hi; }
  return tax;
}
// NYC resident tax on NY taxable income: 3.078% to 12,000; 3.762% to 25,000; 3.819% to 50,000; 3.876% above;
// school tax credit $63 fixed (income up to $250,000) and rate reduction $21 + 0.228% of NYC taxable over $12,000
// (income up to $500,000). Unchanged for 2026 (IT-2105-I 2026).
export function nycTax(w) {
  const t = nyTaxable(w);
  const b = [[12000, 0.03078], [25000, 0.03762], [50000, 0.03819], [Infinity, 0.03876]];
  let tax = 0, lo = 0;
  for (const [hi, r] of b) { if (t > lo) tax += (Math.min(t, hi) - lo) * r; lo = hi; }
  const fixed = w <= 250000 ? 63 : 0;
  const reduction = w > 500000 ? 0 : t <= 12000 ? 0.00171 * t : 21 + 0.00228 * (t - 12000);
  return Math.max(0, tax - fixed - reduction);
}
// NY Paid Family Leave 2026: 0.432% of wages, max $411.91 (paidfamilyleave.ny.gov/2026); disability 0.5% up to
// $0.60 a week (wcb.ny.gov).
export const nyPayroll = w => Math.min(0.00432 * w, 411.91) + Math.min(0.005 * w, 0.6 * 52);

// California 2026 (FTB tax news 2026/10): 1% to 11,456; 2% to 27,157; 4% to 42,861; 6% to 59,498; 8% to 75,197;
// 9.3% to 384,109; ...; standard deduction $5,900; exemption credit $158 (phase-out starts far above these profiles).
export function caTax(w) {
  const t = Math.max(0, w - 5900);
  const b = [[11456, 0.01], [27157, 0.02], [42861, 0.04], [59498, 0.06], [75197, 0.08], [384109, 0.093]];
  if (t > 384109) throw new Error('oracle: CA top brackets not modeled here');
  let tax = 0, lo = 0;
  for (const [hi, r] of b) { if (t > lo) tax += (Math.min(t, hi) - lo) * r; lo = hi; }
  return Math.max(0, tax - 158);
}
// CA SDI 2026: 1.3%, no wage cap (edd.ca.gov rates and withholding).
export const caPayroll = w => 0.013 * w;

// Ohio 2026 (R.C. 5747.02(A)(c)): $332 + 2.75% over $26,050 of Ohio taxable income; exemption $2,150 for MAGI
// $40,001-$80,000 (R.C. 5747.025, indexing suspended for 2025-2026 by HB 96).
export function ohTax(w) {
  const ex = w <= 40000 ? 2400 : w <= 80000 ? 2150 : w < 500000 ? 1900 : 0;
  const t = Math.max(0, w - ex);
  const tax = t <= 26050 ? 0 : 332 + 0.0275 * (t - 26050);
  return Math.max(0, tax - (t < 30000 ? 20 : 0));
}
// Columbus: 2.5% of wages (columbus.gov Income Tax Division).
export const columbusTax = w => 0.025 * w;

// Washington: no income tax. Paid Family and Medical Leave 2026 employee share 1.13% x 71.43% up to $184,500
// (paidleave.wa.gov employer toolkit 2026); WA Cares 0.58%, no cap (wacaresfund.wa.gov).
export const waPayroll = w => 0.0113 * 0.7143 * Math.min(w, 184500) + 0.0058 * w;

// Rent: Zumper National Rent Report, October 2026 (published 2026-10-27), median 1-bedroom.
export const RENT = { 'boston-ma': 2980, 'new-york-ny': 4610, 'austin-tx': 1510, 'san-francisco-ca': 4430, 'columbus-oh': 1170, 'seattle-wa': 1900 };

// Essentials: MIT Living Wage Calculator (data updated 2026-02-15), 1 adult 0 children, county page, annual
// Food + Medical + Transportation + Internet & Mobile + Other (no housing, child care or civic), divided by 12.
export const MIT = {
  'boston-ma': [5141, 4257, 5991, 2359, 4715], // Suffolk County, MA
  'new-york-ny': [7116, 4695, 4710, 1627, 4715], // New York County, NY
  'austin-tx': [4159, 3075, 8465, 1479, 4067], // Travis County, TX
  'san-francisco-ca': [5807, 3828, 6691, 1971, 4992], // San Francisco County, CA
  'columbus-oh': [4358, 3658, 7912, 1497, 4549], // Franklin County, OH
  'seattle-wa': [5234, 3032, 8441, 2397, 4992], // King County, WA
};
export const essentials = city => Math.round(MIT[city].reduce((a, b) => a + b, 0) / 12);

const STATE = {
  'boston-ma': w => ({ state: maTax(w), local: 0, payroll: 0.0046 * Math.min(w, 184500) }), // MA PFML 0.46% (mass.gov)
  'new-york-ny': w => ({ state: nyTax(w), local: nycTax(w), payroll: nyPayroll(w) }),
  'austin-tx': () => ({ state: 0, local: 0, payroll: 0 }),
  'san-francisco-ca': w => ({ state: caTax(w), local: 0, payroll: caPayroll(w) }),
  'columbus-oh': w => ({ state: ohTax(w), local: columbusTax(w), payroll: 0 }),
  'seattle-wa': w => ({ state: 0, local: 0, payroll: waPayroll(w) }),
};

/** Monthly figures the app should show for an offer. */
export function expected({ salary, cityId, loanPayment = 0, otherFixed = 0 }) {
  const s = STATE[cityId](salary);
  const fed = federalTax(salary);
  const f = fica(salary);
  const takeHome = (salary - fed - f - s.state - s.local - s.payroll) / 12;
  const rent = RENT[cityId];
  const ess = essentials(cityId);
  return {
    federal: fed, fica: f, state: s.state, local: s.local, payroll: s.payroll,
    takeHomeMonthly: takeHome, rent, essentials: ess,
    leftOver: takeHome - rent - ess - loanPayment - otherFixed,
  };
}

/** Realistic new-grad profiles used by the money tests and the audit report. */
export const PROFILES = [
  { name: 'Boston analyst', salary: 65000, cityId: 'boston-ma', loanPayment: 0, otherFixed: 0 },
  { name: 'NYC first job with loans', salary: 72000, cityId: 'new-york-ny', loanPayment: 300, otherFixed: 0 },
  { name: 'Austin, no state tax', salary: 58000, cityId: 'austin-tx', loanPayment: 0, otherFixed: 0 },
  { name: 'San Francisco engineer', salary: 85000, cityId: 'san-francisco-ca', loanPayment: 0, otherFixed: 0 },
  { name: 'Columbus with city tax', salary: 60000, cityId: 'columbus-oh', loanPayment: 250, otherFixed: 100 },
  { name: 'Seattle, payroll premiums', salary: 80000, cityId: 'seattle-wa', loanPayment: 0, otherFixed: 0 },
];
