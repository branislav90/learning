// TypeScript 5.9's lib.dom lacks `interactionId` and `durationThreshold` (checked with tsc 2026-10-22),
// so declare the bits we use locally.
type EventTimingEntry = PerformanceEventTiming & { interactionId?: number };

type Slow = {
  name: string;
  inputDelay: number;
  processing: number;
  presentation: number;
  total: number;
  target: string;
};

export function observeSlowInteractions(report: (s: Slow) => void, threshold = 100): void {
  if (!("PerformanceEventTiming" in window)) return; // feature-detect
  const po = new PerformanceObserver((list) => {
    for (const e of list.getEntries() as EventTimingEntry[]) {
      if (e.interactionId === undefined || e.interactionId === 0) continue; // only discrete interactions
      const inputDelay = e.processingStart - e.startTime;
      const processing = e.processingEnd - e.processingStart;
      const presentation = e.startTime + e.duration - e.processingEnd;
      report({
        name: e.name,
        inputDelay,
        processing,
        presentation,
        total: e.duration,
        target: (e.target as Element | null)?.tagName.toLowerCase() ?? "unknown",
      });
    }
  });
  // durationThreshold: default 104 ms, rounded to 8 ms, minimum 16 ms (MDN); type is "event".
  po.observe({ type: "event", durationThreshold: threshold, buffered: true } as PerformanceObserverInit);
}
