type UseFetchOptions<T, R> = {
  retries?: number; retryDelayMs?: number; cacheKey?: string; ttlMs?: number;
  transform?: (raw: T) => R; onSuccess?: (r: R) => void; onError?: (e: Error) => void;
  pollMs?: number; enabled?: boolean; dedupe?: boolean; suspense?: boolean;
};
function useFetch<T, R = T>(url: string, opts: UseFetchOptions<T, R> = {}): {
  data?: R; error?: Error; loading: boolean; refetch(): void; mutate(r: R): void; cancel(): void;
} { /* 200 lines */ }
export {};
