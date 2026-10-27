// src/shared/config/ConfigContext.tsx
import { createContext, use, type ReactNode } from "react";
import type { AppConfig } from "./schema";

const ConfigContext = createContext<AppConfig | null>(null);

export function ConfigProvider({ value, children }: { value: AppConfig; children: ReactNode }) {
  return <ConfigContext value={value}>{children}</ConfigContext>;   // React 19: context as provider
}

export function useConfig(): AppConfig {
  const ctx = use(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used inside <ConfigProvider>");
  return ctx;
}
