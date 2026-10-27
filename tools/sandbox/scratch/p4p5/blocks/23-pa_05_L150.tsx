// After: hook, SSR-safe via useSyncExternalStore
import { useSyncExternalStore } from "react";

function subscribe(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}
const getSnapshot = () => window.innerWidth;     // must return a stable primitive when unchanged
const getServerSnapshot = () => 1024;            // deterministic server value; choose deliberately

export function useWindowWidth() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function Header() {
  const width = useWindowWidth();
  return <nav data-compact={width < 640} />;
}
export {};
