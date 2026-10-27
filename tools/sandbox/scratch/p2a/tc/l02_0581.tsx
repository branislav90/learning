import { useEffect, useRef } from "react";
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => { ref.current = value; });   // runs after commit
  return ref.current;                           // value from the previous commit
}
