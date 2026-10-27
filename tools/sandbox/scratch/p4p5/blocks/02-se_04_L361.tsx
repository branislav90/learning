// shared/analytics/AnalyticsContext.tsx
import { createContext, use, type ReactNode } from "react";

export interface Analytics { track(event: string, props?: Record<string, unknown>): void }
const noop: Analytics = { track() {} };
const AnalyticsContext = createContext<Analytics>(noop);

export const AnalyticsProvider = ({ value, children }: { value: Analytics; children: ReactNode }) => (
  <AnalyticsContext value={value}>{children}</AnalyticsContext>
);
export const useAnalytics = () => use(AnalyticsContext);
export {};
