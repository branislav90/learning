// use-media-query.ts
import { useCallback, useSyncExternalStore } from "react";

export function useMediaQuery(query: string, serverFallback = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  const getSnapshot = () => window.matchMedia(query).matches;
  const getServerSnapshot = () => serverFallback;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
export {};
