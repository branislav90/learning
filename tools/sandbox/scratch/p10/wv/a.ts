import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from "web-vitals";
export function reportWebVitals(send: (m: Record<string, unknown>) => void) {
  const handler = (m: Metric) => send({ name: m.name, value: m.value, rating: m.rating, id: m.id, navigationType: m.navigationType });
  onLCP(handler); onINP(handler); onCLS(handler); onFCP(handler); onTTFB(handler);
}
