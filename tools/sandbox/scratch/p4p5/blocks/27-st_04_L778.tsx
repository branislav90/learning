import { useSyncExternalStore } from "react";

export function useCssVar(name: string, fallback = ""): string {
  const subscribe = (cb: () => void) => {
    const obs = new MutationObserver(cb);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });
    return () => obs.disconnect();
  };
  const get = () => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  return useSyncExternalStore(subscribe, get, () => fallback);
}
export {};
