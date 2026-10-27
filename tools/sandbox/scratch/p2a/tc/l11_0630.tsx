import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

export function useWindowWidth(serverFallback = 1024): number {
  return useSyncExternalStore(
    subscribe,
    () => window.innerWidth,   // client snapshot (must be stable between changes)
    () => serverFallback,      // server/hydration snapshot
  );
}
