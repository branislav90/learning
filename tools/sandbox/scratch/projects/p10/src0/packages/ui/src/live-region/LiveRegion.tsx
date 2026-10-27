// packages/ui/src/live-region/LiveRegion.tsx
import { useEffect, useRef, useState } from 'react';

/** Polite announcements, rate-limited: never read 20 alerts/second to a screen-reader user. */
export function useAnnouncer(minIntervalMs = 2000) {
  const [text, setText] = useState('');
  const last = useRef(0);
  const queue = useRef<string[]>([]);
  useEffect(() => {
    const id = setInterval(() => {
      if (queue.current.length && Date.now() - last.current >= minIntervalMs) {
        const n = queue.current.length;
        setText(n === 1 ? queue.current[0]! : `${n} new alerts. Latest: ${queue.current.at(-1)}`);   // digest, don't flood
        queue.current = []; last.current = Date.now();
      }
    }, 500);
    return () => clearInterval(id);
  }, [minIntervalMs]);
  return { announce: (m: string) => { queue.current.push(m); }, region: <div role="status" aria-live="polite" className="sr-only">{text}</div> };
}
