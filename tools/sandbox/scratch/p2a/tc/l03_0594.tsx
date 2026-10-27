import { useEffect, useRef } from "react";

export function useMountEffect(setup: () => void | (() => void)): void {
  const latest = useRef(setup);
  useEffect(() => { latest.current = setup; });   // keep the latest closure without re-subscribing
  useEffect(() => latest.current(), []);           // setup per mount of this instance; cleanup returned by setup
}
