import { useEffect, useState } from 'react';

/** Returns true only if `active` has been true for at least `delayMs`;
 *  once shown, stays visible for at least `minMs` to avoid flashes. */
export function useDelayedFlag(active: boolean, delayMs = 200, minMs = 400): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      const show = setTimeout(() => setVisible(true), delayMs);
      return () => clearTimeout(show);
    }
    if (visible) {
      // Hold until the minimum display time has passed. Track when it was shown.
      const hide = setTimeout(() => setVisible(false), minMs);
      return () => clearTimeout(hide);
    }
  }, [active, delayMs, minMs, visible]);

  return visible;
}
export {};
