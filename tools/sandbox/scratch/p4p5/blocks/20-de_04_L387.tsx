// packages/design-system/src/theme/useTheme.ts
import { useCallback, useSyncExternalStore } from "react";

type Theme = "light" | "dark";
const KEY = "theme";

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener("theme-change", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("theme-change", cb);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => "light" as Theme);
  const setTheme = useCallback((next: Theme) => {
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(KEY, next); } catch { /* storage may be unavailable */ }
    window.dispatchEvent(new Event("theme-change"));
  }, []);
  return [theme, setTheme] as const;
}
export {};
