import { createContext, useContext, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggle: () => void;
};

// undefined = "no provider". We do NOT invent a default theme.
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const value: ThemeContextValue = {
    theme,
    toggle: () => setTheme((t) => (t === "light" ? "dark" : "light")),
  };
  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return ctx;
}
export {};
