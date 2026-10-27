
// app/queryClient.ts
import { QueryClient, MutationCache, QueryCache } from '@tanstack/react-query'
import { ApiError } from '../shared/api/http'
import { toast } from '../shared/ui/toast'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 10 * 60_000,
      retry: (count, err) => err instanceof ApiError && err.retryable && count < 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000) + Math.random() * 250, // jitter
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 0, // mutations are retried by explicit user action, with the same idempotency key
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Only surface background-refetch errors; initial-load errors render in the UI.
      if (query.state.data !== undefined) toast.error('Showing saved data. Refresh failed.')
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _v, _ctx, mutation) => {
      if (mutation.meta?.silent) return
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong')
    },
  }),
})
