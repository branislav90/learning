// src/features/settings/SettingsProvider.tsx
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface Settings {
  density: "comfortable" | "compact";
  dateStyle: "short" | "long";
}
const DEFAULTS: Settings = { density: "comfortable", dateStyle: "short" };
const KEY = "fleet-console:settings:v1";

interface SettingsApi { settings: Settings; update(patch: Partial<Settings>): void }
const SettingsContext = createContext<SettingsApi | null>(null);

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch { /* best effort */ }
  }, [settings]);

  const api = useMemo<SettingsApi>(
    () => ({ settings, update: (patch) => setSettings((s) => ({ ...s, ...patch })) }),
    [settings],
  );
  return <SettingsContext value={api}>{children}</SettingsContext>;
}

export function useSettings(): SettingsApi {
  const ctx = useContext(SettingsContext);
  if (ctx === null) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
