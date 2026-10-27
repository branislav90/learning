// useTheme.ts
import { useCallback, useSyncExternalStore } from "react";
type Theme = "light" | "dark";
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => { listeners.add(cb); return () => listeners.delete(cb); };
const read = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => "light" as Theme);
  const setTheme = useCallback((next: Theme) => {
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch { /* ignore */ }
    listeners.forEach(l => l());
  }, []);
  return [theme, setTheme] as const;
}
export {};
