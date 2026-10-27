// apps/web/src/providers/TenantBoundary.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { shouldRetry, retryDelay } from '@fleetline/platform/api/retry';
import modules from '../shell/modules';

export function TenantBoundary({ tenantId, children }: { tenantId: string; children: ReactNode }) {
  // `key={tenantId}` on this component (at the call site) remounts the subtree on tenant change:
  // every piece of component state, every store created below, every socket is torn down. Isolation by construction.
  const [client] = useState(() => new QueryClient({
    defaultOptions: { queries: { retry: shouldRetry, retryDelay, staleTime: 30_000, refetchOnWindowFocus: true } },
  }));
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

// call site
// <TenantBoundary key={session.tenantId} tenantId={session.tenantId}> ... </TenantBoundary>
// On switch: module-level singletons (Zustand stores created at import time) are NOT reset by remount.
// Hence FleetModule.resetTenantState(): call every module's reset in the tenant-switch handler.
