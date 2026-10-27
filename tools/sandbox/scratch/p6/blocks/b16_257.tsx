import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { get, set, del } from 'idb-keyval';
import type { ReactNode } from 'react';

const DAY = 24 * 60 * 60 * 1000;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: DAY,        // must be >= persistence maxAge, or entries are GC'd before they persist
      staleTime: 60_000,
    },
  },
});

const persister = createAsyncStoragePersister({
  storage: {
    getItem: (key) => get<string>(key).then((v) => v ?? null),
    setItem: (key, value) => set(key, value),
    removeItem: (key) => del(key),
  },
  throttleTime: 1000,
});

export function AppProviders({ children, appVersion, userId }: { children: ReactNode; appVersion: string; userId: string }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: DAY,
        buster: `${appVersion}:${userId}`, // new version or user => discard persisted cache
        dehydrateOptions: {
          shouldDehydrateQuery: (query) =>
            query.state.status === 'success' && query.meta?.persist === true, // opt-in per query
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
export {};
