export function f(e: PerformanceEventTiming) { return e.interactionId; }
const po = new PerformanceObserver(() => {});
po.observe({ type: "event", durationThreshold: 100, buffered: true });
