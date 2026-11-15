// Shared fixtures for Offer Lab: two realistic new-grad offers, the app's sessionStorage key, and helpers that drive
// the app into each audited state. Adapted from the Loan Desk kit; the exports keep their names so the engines and
// probes import them unchanged.
export const KEYS = {
  state: 'offer-lab-state',
};

/** A $65,000 offer in Boston and a $72,000 offer in New York City, no debts entered. */
export const OFFER_A = { salary: 65000, cityId: 'boston-ma', loanPayment: 0, otherFixed: 0 };
export const OFFER_B = { salary: 72000, cityId: 'new-york-ny', loanPayment: 0, otherFixed: 0 };

// Loan Desk names, kept so modules written against the original kit still import. Offer Lab has no loans.
export const LOANS = [OFFER_A];
export const PROFILE = {};
export const SNAPSHOTS = [];

/** Script for evaluateOnNewDocument: seeds sessionStorage before any app code runs, so the app opens on results. */
export function seedScript({ a = OFFER_A, b = null } = {}) {
  const state = JSON.stringify(b ? { a, b } : { a });
  return `(() => { try {
    sessionStorage.setItem(${JSON.stringify(KEYS.state)}, ${JSON.stringify(state)});
  } catch {} })();`;
}

/** The share link the app itself builds: /?q=<base64 of the JSON state>. */
export const shareQuery = (state = { a: OFFER_A, b: OFFER_B }) =>
  `/?q=${encodeURIComponent(Buffer.from(JSON.stringify(state)).toString('base64'))}`;

const sleep = ms => new Promise(r => setTimeout(r, ms));

/** Click a control by its exact trimmed visible text with a real (trusted) mouse click. Accepts one text or a list. */
export async function clickText(page, text) {
  const texts = Array.isArray(text) ? text : [text];
  const handle = await page.evaluateHandle(ts => {
    const norm = s => (s || '').replace(/\s+/g, ' ').trim();
    const els = [...document.querySelectorAll('button, a, [role="radio"], summary')];
    for (const t of ts) {
      const hit = els.find(e => norm(e.innerText) === t && e.offsetParent !== null)
        || els.find(e => norm(e.innerText).startsWith(t) && e.offsetParent !== null);
      if (hit) return hit;
    }
    return null;
  }, texts);
  const el = handle.asElement();
  if (!el) throw new Error(`clickText: no visible control "${texts.join('" or "')}"`);
  await el.click();
  await sleep(350);
}

/** Offer Lab has no tabs. Kept so modules that import it still load. */
export async function clickTab() {
  throw new Error('clickTab: Offer Lab has no section tabs');
}

/** Types an offer into the visible form: salary, then a city picked from the list with the keyboard. */
export async function fillOffer(page, { salary = '65000', city = 'Boston' } = {}) {
  await page.click('#salary');
  await page.keyboard.type(salary, { delay: 40 });
  await page.click('#city');
  await page.keyboard.type(city, { delay: 40 });
  await sleep(200);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await sleep(200);
}

export const SUBMIT_TEXTS = ['See my results', 'See what is left', 'Show me', 'Compare offers'];
export const DEBTS_TEXTS = ['Add monthly debts', 'Add monthly costs', 'Add loans and other costs', 'Add a loan payment'];
export const COMPARE_TEXTS = ['Compare a second offer', 'Compare another offer', 'Add a second offer'];

/**
 * The audited states. `seeded: true` means sessionStorage is pre-populated before load, which opens the results;
 * `enter` then drives the UI into the state with real clicks.
 */
export const STATES = {
  empty: { seeded: false, enter: async () => {} },
  'debts-open': { seeded: false, enter: async page => clickText(page, DEBTS_TEXTS) },
  results: { seeded: true, enter: async () => {} },
  comparison: {
    seeded: false,
    enter: async page => {
      await page.goto(new URL(shareQuery(), page.url()).href, { waitUntil: 'networkidle0' });
      await sleep(600);
    },
  },
};
