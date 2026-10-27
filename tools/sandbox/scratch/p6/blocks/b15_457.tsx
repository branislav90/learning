type BreakerState = 'closed' | 'open' | 'half-open';

export function createBreaker({ failureThreshold = 5, coolDownMs = 30_000 } = {}) {
  let state: BreakerState = 'closed';
  let failures = 0;
  let openedAt = 0;

  return {
    async run<T>(op: () => Promise<T>): Promise<T> {
      if (state === 'open') {
        if (Date.now() - openedAt < coolDownMs) throw new Error('Circuit open: skipping request');
        state = 'half-open'; // allow one probe
      }
      try {
        const result = await op();
        failures = 0;
        state = 'closed';
        return result;
      } catch (e) {
        failures += 1;
        if (state === 'half-open' || failures >= failureThreshold) {
          state = 'open';
          openedAt = Date.now();
        }
        throw e;
      }
    },
  };
}
export {};
