import { useSyncExternalStore } from "react";

function subscribe(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}
export function useWindowWidth(): number {
  return useSyncExternalStore(subscribe, () => window.innerWidth, () => 1024 /* server snapshot */);
}

function Header() {
  const width = useWindowWidth();
  return <p>{width > 768 ? "Desktop" : "Mobile"}</p>;
}
export {};
