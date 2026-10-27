import { useEffect, useRef, useState } from "react";

export function useThrottledValue<T>(value: T, ms: number): T {
  const [throttled, setThrottled] = useState(value);
  const last = useRef(0);
  useEffect(() => {
    const now = performance.now();
    const wait = Math.max(0, last.current + ms - now);
    const id = setTimeout(() => {
      last.current = performance.now();
      setThrottled(value);
    }, wait);
    return () => clearTimeout(id);
  }, [value, ms]);
  return throttled;
}
