// INP probe: interaction responsiveness on the Offer Lab journey (one offer, then a comparison), at 1x and 4x CPU.
// Trusted input only. Event Timing entries are bucketed by startTime, so late observer delivery cannot misattribute
// them. Main-thread cost per step comes from CDP Performance.getMetrics (TaskDuration). Every step starts on a page
// that has stopped scrolling, and a field is centred in the viewport before it is clicked and typed into.
// Usage: node probes/inp.mjs <url> <outFile> [--quick]    --quick: 8 loans at 4x CPU, one run.
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchBrowser, sleep } from '../lib/browser.mjs';
import { LOANS, clickText, SUBMIT_TEXTS, COMPARE_TEXTS } from '../lib/fixtures.mjs';

export const STEP_NAMES = ['typeSalary5', 'pickCity', 'submit', 'editRent', 'openCompare', 'typeSalaryB5', 'pickCityB', 'submitCompare'];

/** n loans cycled from the fixture portfolio, each with its own id, name, balance and rate. */
export const makeLoans = n => Array.from({ length: n }, (_, i) => {
  const b = LOANS[i % LOANS.length];
  return { ...b, id: `u-${i}`, nickname: `${b.nickname} #${i}`, balance: b.balance + (i * 37) % 900, rate: Math.round((b.rate + (i % 9) * 0.21) * 100) / 100 };
});

const OBSERVER = `(() => {
  window.__ev = []; window.__lt = [];
  new PerformanceObserver(l => { for (const e of l.getEntries()) window.__ev.push({ name: e.name, start: e.startTime, dur: e.duration, id: e.interactionId || 0 }); })
    .observe({ type: 'event', durationThreshold: 16, buffered: true });
  new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lt.push({ start: e.startTime, dur: e.duration }); })
    .observe({ type: 'longtask', buffered: true });
})()`;

// Waits until the page stops scrolling: the same scroll position for six frames in a row. A section switch scrolls
// smoothly, and a click that lands while that scroll is still running measures the scroll, not the app.
async function settle(page, timeoutMs = 3000) {
  await page.evaluate(limit => new Promise(resolve => {
    const begin = performance.now();
    let last = scrollY;
    let still = 0;
    const tick = () => {
      if (scrollY === last) still++;
      else { still = 0; last = scrollY; }
      if (still >= 6 || performance.now() - begin > limit) resolve();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }), timeoutMs);
}

// Brings a field to the middle of the viewport and lets the page settle, before the step that types into it. Clicked
// where the section switch leaves it, #income sits on the bottom edge of the viewport, and there the Event Timing
// entries for the click and the typing stay pending until the next input arrives: each keystroke then read 500 to
// 1000 ms although its handlers ran for a few. A person types into a field they can see.
async function centre(page, selector) {
  await page.evaluate(sel => document.querySelector(sel)?.scrollIntoView({ block: 'center' }), selector);
  await settle(page);
}

// One measured step. The page settles first, outside the window, so a step never inherits the scroll of the one before.
async function step(page, cdp, steps, name, fn) {
  await settle(page);
  const metric = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m => [m.name, m.value]));
  const m0 = await metric();
  const t0 = await page.evaluate(() => performance.now());
  await fn();
  await sleep(250);
  const t1 = await page.evaluate(() => performance.now());
  const m1 = await metric();
  steps.push({
    name, t0, t1,
    taskMs: Math.round((m1.TaskDuration - m0.TaskDuration) * 1000),
    scriptMs: Math.round((m1.ScriptDuration - m0.ScriptDuration) * 1000),
    layoutMs: Math.round((m1.LayoutDuration - m0.LayoutDuration) * 1000),
    styleMs: Math.round((m1.RecalcStyleDuration - m0.RecalcStyleDuration) * 1000),
  });
}

// The journey in a fresh browser, at one throttle rate. Offer Lab has no portfolio size, so `n` is kept only so the
// rows keep the kit's shape (it is always 1: one offer, then a second for the comparison).
async function journey(url, rate, n, run) {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 412, height: 823, deviceScaleFactor: 1, isMobile: false, hasTouch: false });
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.evaluate(OBSERVER);
    const cdp = await page.createCDPSession();
    await cdp.send('Performance.enable');
    await cdp.send('Emulation.setCPUThrottlingRate', { rate });
    const steps = [];
    await centre(page, '#salary');
    await step(page, cdp, steps, 'typeSalary5', async () => {
      await page.click('#salary');
      await page.keyboard.type('65000', { delay: 120 });
    });
    await centre(page, '#city');
    await step(page, cdp, steps, 'pickCity', async () => {
      await page.click('#city');
      await page.keyboard.type('Bos', { delay: 120 });
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
    });
    await step(page, cdp, steps, 'submit', () => clickText(page, SUBMIT_TEXTS));
    await step(page, cdp, steps, 'editRent', async () => {
      const handle = await page.evaluateHandle(() => [...document.querySelectorAll('button')]
        .find(b => /^Edit rent|^\$[\d,]+$/i.test((b.innerText || '').trim()) && b.offsetParent) || null);
      const el = handle.asElement();
      if (!el) throw new Error('no editable rent figure');
      await el.click();
      await page.keyboard.type('1800', { delay: 120 });
      await page.keyboard.press('Enter');
    });
    await step(page, cdp, steps, 'openCompare', () => clickText(page, COMPARE_TEXTS));
    await centre(page, '#salary');
    await step(page, cdp, steps, 'typeSalaryB5', async () => {
      await page.click('#salary');
      await page.keyboard.type('72000', { delay: 120 });
    });
    await centre(page, '#city');
    await step(page, cdp, steps, 'pickCityB', async () => {
      await page.click('#city');
      await page.keyboard.type('New Y', { delay: 120 });
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
    });
    await step(page, cdp, steps, 'submitCompare', () => clickText(page, ['Compare offers', ...SUBMIT_TEXTS]));
    await sleep(700);
    const { ev, lt } = await page.evaluate(() => ({ ev: window.__ev, lt: window.__lt }));
    const row = { cpuThrottle: rate, loans: n, run };
    for (const s of steps) {
      const inWin = e => e.start >= s.t0 && e.start < s.t1;
      const es = ev.filter(inWin);
      const byId = {};
      for (const e of es) if (e.id) byId[e.id] = Math.max(byId[e.id] || 0, e.dur);
      const inter = Object.values(byId).sort((a, b) => a - b);
      const lts = lt.filter(inWin);
      row[s.name] = {
        worstInteractionMs: Math.round(inter.at(-1) || 0), interactions: inter.length,
        taskMs: s.taskMs, scriptMs: s.scriptMs, layoutMs: s.layoutMs, styleMs: s.styleMs,
        longTasks: lts.length, longTaskMaxMs: Math.round(Math.max(0, ...lts.map(x => x.dur))),
      };
    }
    return row;
  } finally {
    await browser.close();
  }
}

/**
 * Runs the journey at 1x and 4x CPU with 8, 25 and 60 loans, twice each, in a fresh browser every time. quick runs
 * 8 loans at 4x once. Returns one row per run: { cpuThrottle, loans, run, <step>: { worstInteractionMs, interactions,
 * taskMs, scriptMs, layoutMs, styleMs, longTasks, longTaskMaxMs } }, or { cpuThrottle, loans, run, error }.
 * worstInteractionMs is the longest Event Timing interaction that started inside the step, so 0 means none reached 16ms.
 */
export async function runInpProbe(url, { quick = false, log = () => {} } = {}) {
  const rates = quick ? [4] : [1, 4];
  const sizes = [1];
  const runs = quick ? [1] : [1, 2];
  const rows = [];
  for (const rate of rates) for (const n of sizes) for (const run of runs) {
    // Chrome sometimes fails to start on a busy machine; only that is tried again.
    for (let attempt = 1; ; attempt++) {
      try {
        const row = await journey(url, rate, n, run);
        rows.push(row);
        const brief = STEP_NAMES.filter(k => row[k]).map(k => `${k}:${row[k].worstInteractionMs}ms/${row[k].taskMs}t`).join(' ');
        log(`cpu${rate}x loans=${n} run${run} ${brief}`);
      } catch (e) {
        const message = String(e?.message ?? e).slice(0, 300);
        if (attempt < 3 && /Failed to launch the browser process/i.test(message)) continue;
        rows.push({ cpuThrottle: rate, loans: n, run, error: message });
        log(`cpu${rate}x loans=${n} run${run} FAILED ${message}`);
      }
      break;
    }
  }
  return rows;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const quick = args.includes('--quick');
  const [url, outFile] = args.filter(a => a !== '--quick');
  if (!url || !outFile) {
    console.error('Usage: node probes/inp.mjs <url> <outFile> [--quick]');
    process.exit(2);
  }
  mkdirSync(path.dirname(path.resolve(outFile)), { recursive: true });
  const rows = await runInpProbe(url, { quick, log: console.log });
  writeFileSync(outFile, JSON.stringify(rows, null, 1));
}
