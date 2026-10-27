export {};
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
interface ThemeContextValue { theme: Theme; toggle: () => void }

const ThemeContext = createContext<ThemeContextValue | null>(null);   // null = "no provider"

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const value = useMemo<ThemeContextValue>(
    () => ({ theme, toggle: () => setTheme((t) => (t === "light" ? "dark" : "light")) }),
    [theme],
  );
  return <ThemeContext value={value}>{children}</ThemeContext>;   // ⚠ React 19: context object is itself the provider
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === null) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;                       // narrowed: non-null for all callers
}
