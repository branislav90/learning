import { useSyncExternalStore } from 'react';

/** A shared ticking clock. The interval runs only while at least one component is subscribed. */
function createClock(intervalMs: number) {
  const listeners = new Set<() => void>();
  let now = Date.now();
  let timer: ReturnType<typeof setInterval> | undefined;

  const tick = () => {
    now = Date.now();
    listeners.forEach((l) => l());
  };

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      if (listeners.size === 1) {
        now = Date.now();
        timer = setInterval(tick, intervalMs);
      }
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0 && timer !== undefined) {
          clearInterval(timer);
          timer = undefined;
        }
      };
    },
    getSnapshot: () => now,
  };
}

const secondClock = createClock(1000);
const minuteClock = createClock(60_000);

export const useSecondClock = () => useSyncExternalStore(secondClock.subscribe, secondClock.getSnapshot);
export const useMinuteClock = () => useSyncExternalStore(minuteClock.subscribe, minuteClock.getSnapshot);
