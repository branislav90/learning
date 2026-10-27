// packages/platform/src/telemetry/vitals.ts
import { onCLS, onINP, onLCP, type Metric } from 'web-vitals';
export function startVitals(send: (m: { name: string; value: number; id: string; route: string }) => void) {
  const report = (m: Metric) => send({ name: m.name, value: m.value, id: m.id, route: location.pathname });
  onCLS(report); onINP(report); onLCP(report);
}
