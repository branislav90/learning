from apply import apply
apply('21-browser-paint-and-react-updates.md', [
("(a throttle on the order of hundreds of milliseconds has existed). Its existence and duration are implementation details.","(`FALLBACK_THROTTLE_MS = 300` in `ReactFiberWorkLoop.js` on `main`, checked 2026-10-22). Its existence and duration are implementation details."),
("historically using `MessageChannel` (preferred) with `setTimeout` fallbacks.","using `setImmediate` where it exists (Node.js and jsdom), otherwise `MessageChannel` (the browser case), with a `setTimeout` fallback (`packages/scheduler/src/forks/Scheduler.js`)."),
])
