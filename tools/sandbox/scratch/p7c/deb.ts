export type DebounceOptions = { leading?: boolean; trailing?: boolean; maxWait?: number };

export type Debounced<A extends unknown[]> = ((...args: A) => void) & {
  cancel(): void;
  flush(): void;
  pending(): boolean;
};

export function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  wait: number,
  { leading = false, trailing = true, maxWait }: DebounceOptions = {},
): Debounced<A> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let maxTimer: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: A | undefined; // pending args for the trailing edge

  const clearTimers = () => {
    if (timer !== undefined) clearTimeout(timer);
    if (maxTimer !== undefined) clearTimeout(maxTimer);
    timer = maxTimer = undefined;
  };

  const end = () => {
    clearTimers();
    const args = lastArgs;
    lastArgs = undefined;
    if (trailing && args) fn(...args);
  };

  const debounced = ((...args: A) => {
    const startingBurst = timer === undefined;
    if (startingBurst && leading) {
      fn(...args);            // leading edge: run now; nothing pending yet
      lastArgs = undefined;
    } else {
      lastArgs = args;        // remember latest for the trailing edge
    }
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(end, wait);
    if (maxWait !== undefined && maxTimer === undefined) {
      maxTimer = setTimeout(end, maxWait);
    }
  }) as Debounced<A>;

  debounced.cancel = () => { clearTimers(); lastArgs = undefined; };
  debounced.flush = () => { if (timer !== undefined) end(); };
  debounced.pending = () => timer !== undefined;
  return debounced;
}

export function throttle<A extends unknown[]>(fn: (...args: A) => void, wait: number) {
  return debounce(fn, wait, { leading: true, trailing: true, maxWait: wait });
}
