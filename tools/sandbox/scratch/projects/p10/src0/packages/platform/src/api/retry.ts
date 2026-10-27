// packages/platform/src/api/retry.ts
import { AppError } from './errors';

const RETRYABLE = new Set(['network', 'timeout', 'server']);

/** React Query `retry` option. Reads are retried; mutations are NOT unless declared idempotent. */
export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= 3) return false;
  return error instanceof AppError && RETRYABLE.has(error.kind);
}

export const retryDelay = (attempt: number) =>
  Math.min(30_000, 2 ** attempt * 500) * (0.5 + Math.random() * 0.5);   // exponential backoff with jitter
