// services/ServicesContext.tsx
import { createContext, use, type ReactNode } from "react";
import type { Analytics, Clock, Services } from "./ports";

const ServicesContext = createContext<Services | null>(null);

export function ServicesProvider({ value, children }: { value: Services; children: ReactNode }) {
  return <ServicesContext value={value}>{children}</ServicesContext>;   // React 19 style; older: <ServicesContext.Provider>
}

function useServices(): Services {
  const s = use(ServicesContext);
  if (!s) throw new Error("ServicesProvider is missing from the tree");
  return s;
}

// narrow hooks: components depend on exactly what they use
export const useClock = (): Clock => useServices().clock;
export const useAnalytics = (): Analytics => useServices().analytics;
export {};
