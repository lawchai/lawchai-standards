// Preload that moves the process clock forward, so a test suite can be run "as if" it were a
// later day. Confirms (or clears) candidates from find-test-timebombs.mjs without waiting.
//
//   CLOCK_SHIFT_DAYS=30 NODE_OPTIONS="--import=/abs/path/clock-shift-preload.mjs" npm test
//
// Only `Date.now()` and `new Date()` with no arguments move. Explicit dates, timers and
// performance.now() are untouched. Never load this outside a test run.
const days = Number(process.env.CLOCK_SHIFT_DAYS ?? '0');
if (!Number.isFinite(days)) throw new TypeError('CLOCK_SHIFT_DAYS must be a number of days');
const offset = Math.round(days * 24 * 60 * 60 * 1000);

if (offset !== 0 && !globalThis.__lawchaiClockShifted) {
  const RealDate = Date;
  class ShiftedDate extends RealDate {
    constructor(...args) {
      if (args.length === 0) super(RealDate.now() + offset);
      else super(...args);
    }

    static now() {
      return RealDate.now() + offset;
    }
  }
  Object.defineProperty(ShiftedDate, 'name', { value: 'Date' });
  globalThis.Date = ShiftedDate;
  globalThis.__lawchaiClockShifted = { days };
}
