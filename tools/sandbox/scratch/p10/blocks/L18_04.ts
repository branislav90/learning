export {};
// scripts/canary-gate.ts — compare canary vs baseline over a window; exit non-zero to trigger rollback
interface Sample { sessions: number; jsErrorSessions: number; checkoutStarts: number; checkoutSuccess: number; inpP75: number }

async function fetchMetrics(release: string, minutes: number): Promise<Sample> {
  const res = await fetch(`${process.env.METRICS_URL}/release/${encodeURIComponent(release)}?minutes=${minutes}`, {
    headers: { authorization: `Bearer ${process.env.METRICS_TOKEN}` },
  });
  if (!res.ok) throw new Error(`metrics ${res.status}`);
  return (await res.json()) as Sample;
}

const [canaryRelease, baselineRelease] = process.argv.slice(2);
const MIN_SESSIONS = 2_000;                               // below this, we can't conclude: keep waiting, do not pass
const deadline = Date.now() + 30 * 60_000;

while (Date.now() < deadline) {
  const [c, b] = await Promise.all([fetchMetrics(canaryRelease, 15), fetchMetrics(baselineRelease, 15)]);
  if (c.sessions < MIN_SESSIONS) { await new Promise((r) => setTimeout(r, 60_000)); continue; }

  const errC = c.jsErrorSessions / c.sessions, errB = b.jsErrorSessions / b.sessions;
  const sucC = c.checkoutSuccess / Math.max(1, c.checkoutStarts), sucB = b.checkoutSuccess / Math.max(1, b.checkoutStarts);

  const failures: string[] = [];
  if (errC > errB * 1.25 + 0.001) failures.push(`JS error sessions ${errC.toFixed(4)} vs ${errB.toFixed(4)}`);
  if (sucC < sucB - 0.02)         failures.push(`checkout success ${sucC.toFixed(3)} vs ${sucB.toFixed(3)}`);
  if (c.inpP75 > b.inpP75 * 1.2)  failures.push(`INP p75 ${c.inpP75}ms vs ${b.inpP75}ms`);

  if (failures.length) { console.error('CANARY FAILED:\n' + failures.join('\n')); process.exit(1); }
  console.log('Canary healthy at this checkpoint');
  process.exit(0);
}
console.error('Canary inconclusive (insufficient traffic); do not promote automatically');
process.exit(2);
