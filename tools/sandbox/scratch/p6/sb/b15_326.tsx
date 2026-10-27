import { QueryClient } from '@tanstack/react-query';
import { HttpError } from './http';
import { isTransient } from './retryPolicy';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => isTransient(error) && failureCount < 3,
      retryDelay: (failureCount, error) => {
        if (error instanceof HttpError && error.retryAfterMs != null) {
          return Math.min(error.retryAfterMs, 30_000);
        }
        const exp = Math.min(30_000, 1000 * 2 ** failureCount);
        return Math.random() * exp; // full jitter
      },
    },
    mutations: {
      retry: false, // be explicit even though it is the documented default; verify
    },
  },
});
export {};
