import { useCallback, useEffect, useRef, useState } from "react";

/** Debounced value with a cancel handle. Everything below becomes slots in the *caller's* hook list. */
export function useDebounced<T>(value: T, ms: number): { debounced: T; cancel: () => void } {
  const [debounced, setDebounced] = useState(value);          // slot A (state + queue)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null); // slot B (ref box)

  const cancel = useCallback(() => {                         // slot C ([fn, deps])
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  useEffect(() => {                                          // slot D (effect record)
    timer.current = setTimeout(() => setDebounced(value), ms);
    return cancel;
  }, [value, ms, cancel]);

  return { debounced, cancel };
}

// usage: two independent instances in one component → two independent groups of 4 slots
function Search() {
  const [q, setQ] = useState("");
  const a = useDebounced(q, 200);   // slots 2–5 of Search's list
  const b = useDebounced(q, 1000);  // slots 6–9
  /* … */
  return <input value={q} onChange={(e) => setQ(e.target.value)} />;
}
