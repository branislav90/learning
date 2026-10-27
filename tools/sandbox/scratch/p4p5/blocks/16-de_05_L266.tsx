// test-utils.tsx
import type { ReactNode } from 'react';
import { ServicesProvider } from './services/ServicesContext';
import type { Services } from './services/ports';

export function makeServices(overrides: Partial<Services> = {}): Services {
  const store = new Map<string, string>();
  return {
    clock: { now: () => 1_700_000_000_000 },
    storage: { get: (k) => store.get(k) ?? null, set: (k, v) => void store.set(k, v) },
    analytics: { track: () => {} },
    coupons: { apply: async () => ({ ok: true }) },
    ...overrides,
  };
}
export function wrapperFor(services: Services) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <ServicesProvider services={services}>{children}</ServicesProvider>;
  };
}
export {};
