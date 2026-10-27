// withRetry.ts
import { HttpError } from './http';
import { isTransient } from './retryPolicy';

interface RetryOptions {
  retries?: number;        // retries after the first attempt
  baseMs?: number;
  capMs?: number;
  budgetMs?: number;       // max total time including waits
  signal?: AbortSignal;
  isIdempotent: boolean;   // required: forces the caller to think about it
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason);
    const id = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(id);
      reject(signal!.reason);
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

export async function withRetry<T>(
  op: (attempt: number) => Promise<T>,
  { retries = 3, baseMs = 500, capMs = 8000, budgetMs = 15000, signal, isIdempotent }: RetryOptions,
): Promise<T> {
  const startedAt = Date.now();
  for (let attempt = 0; ; attempt++) {
    try {
      return await op(attempt);
    } catch (error) {
      const outOfAttempts = attempt >= retries;
      if (!isIdempotent || outOfAttempts || !isTransient(error)) throw error;

      const exp = Math.min(capMs, baseMs * 2 ** attempt);
      const hinted = error instanceof HttpError ? error.retryAfterMs : null;
      const delay = hinted != null ? Math.min(hinted, capMs) : Math.random() * exp; // full jitter

      if (Date.now() - startedAt + delay > budgetMs) throw error; // would exceed budget
      await sleep(delay, signal);
    }
  }
}
export {};
