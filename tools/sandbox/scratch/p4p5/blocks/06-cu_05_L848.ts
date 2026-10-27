import { useEffect } from "react";
import { useLatest } from "./use-latest";

export function useInterval(callback: () => void, delayMs: number | null) {
  const cbRef = useLatest(callback);
  useEffect(() => {
    if (delayMs === null) return;
    const id = setInterval(() => cbRef.current(), delayMs);
    return () => clearInterval(id);
  }, [delayMs, cbRef]);
}
export {};
