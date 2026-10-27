// lib/queryClient.ts
import { QueryClient, isServer } from '@tanstack/react-query';
import { cache } from 'react';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: 60_000 } },   // avoid immediate refetch after hydration
  });
}

let browserClient: QueryClient | undefined;
export function getQueryClient(): QueryClient {
  if (isServer) return serverClient();                    // new per request
  return (browserClient ??= makeQueryClient());           // singleton in the browser only
}
const serverClient = cache(makeQueryClient);              // request-scoped in RSC (verify)
export {};
