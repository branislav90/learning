// analytics/AnalyticsContext.tsx
import { createContext, use } from "react";

export interface Analytics { track(event: string, props?: Record<string, unknown>): void }

const noop: Analytics = { track() {} };
const AnalyticsContext = createContext<Analytics>(noop);

export const AnalyticsProvider = AnalyticsContext; // React 19: <AnalyticsProvider value={...}>
export function useAnalytics(): Analytics { return use(AnalyticsContext); }
export {};
