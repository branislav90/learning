// services/ServicesContext.tsx
import { createContext, use, type ReactNode } from 'react';
import type { Services } from './ports';

const ServicesContext = createContext<Services | null>(null);   // null default: absence is detectable

export function ServicesProvider({ services, children }: { services: Services; children: ReactNode }) {
  return <ServicesContext value={services}>{children}</ServicesContext>;   // React 19: context as provider
}

export function useServices(): Services {
  const services = use(ServicesContext);
  if (services === null) {
    throw new Error('useServices must be used within <ServicesProvider>. Did you forget the composition root or the test wrapper?');
  }
  return services;
}

// Narrow hooks: each component declares only what it uses (Interface Segregation)
export const useClock = () => useServices().clock;
export const useAnalytics = () => useServices().analytics;
export {};
