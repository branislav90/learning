import { useEffect, useRef, useState, useTransition } from 'react';

interface Tick { symbol: string; price: number }

export function useBatchedTicks(subscribe: (cb: (t: Tick) => void) => () => void) {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const buffer = useRef<Record<string, number>>({});
  const scheduled = useRef<number | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const flush = () => {
      scheduled.current = null;
      const batch = buffer.current;
      buffer.current = {};
      startTransition(() => setPrices((prev) => ({ ...prev, ...batch }))); // last write per symbol wins within a frame
    };

    const off = subscribe((t) => {
      buffer.current[t.symbol] = t.price;                   // coalesce: only the latest price per symbol matters
      scheduled.current ??= requestAnimationFrame(flush);   // at most one flush per frame
    });

    return () => {
      off();
      if (scheduled.current !== null) cancelAnimationFrame(scheduled.current);
      scheduled.current = null;
      buffer.current = {};
    };
  }, [subscribe]);

  return prices;
}
export {};
