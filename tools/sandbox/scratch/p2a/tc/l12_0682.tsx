import { useSyncExternalStore } from "react";

// One shared ticker per interval keeps all consumers consistent.
function createClock(intervalMs: number) {
  let now = Date.now();
  const listeners = new Set<() => void>();
  let timer: ReturnType<typeof setInterval> | undefined;
  return {
    subscribe(l: () => void) {
      listeners.add(l);
      if (listeners.size === 1) {
        now = Date.now();
        timer = setInterval(() => { now = Date.now(); listeners.forEach((fn) => fn()); }, intervalMs);
      }
      return () => {
        listeners.delete(l);
        if (listeners.size === 0 && timer !== undefined) clearInterval(timer);
      };
    },
    getSnapshot: () => now,
  };
}

const clock1s = createClock(1000);

export function useNow(): number {
  return useSyncExternalStore(clock1s.subscribe, clock1s.getSnapshot, () => 0);
}
