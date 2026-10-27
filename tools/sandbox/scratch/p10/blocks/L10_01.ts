// src/shared/http/retry.ts
import { HttpError } from "./fetchJson";

const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);

function isTransient(err: unknown): boolean {
  if (err instanceof HttpError) return RETRYABLE_STATUS.has(err.status);
  if (err instanceof DOMException && err.name === "AbortError") return false;      // caller cancelled
  if (err instanceof DOMException && err.name === "TimeoutError") return true;
  return err instanceof TypeError;     // fetch network failure surfaces as TypeError in browsers
}

// A shared retry budget: allow retries only if they are a small fraction of recent traffic.
class RetryBudget {
  private requests = 0; private retries = 0; private windowStart = Date.now();
  constructor(private ratio = 0.1, private windowMs = 10_000, private minRetries = 3) {}
  private roll() { if (Date.now() - this.windowStart > this.windowMs) { this.requests = 0; this.retries = 0; this.windowStart = Date.now(); } }
  recordRequest() { this.roll(); this.requests++; }
  tryRetry(): boolean {
    this.roll();
    if (this.retries < this.minRetries || this.retries < this.requests * this.ratio) { this.retries++; return true; }
    return false;
  }
}
export const defaultBudget = new RetryBudget();

export async function withRetry<T>(
  op: (attempt: number) => Promise<T>,
  opts: { retries?: number; baseMs?: number; capMs?: number; signal?: AbortSignal; budget?: RetryBudget } = {},
): Promise<T> {
  const { retries = 2, baseMs = 300, capMs = 5000, signal, budget = defaultBudget } = opts;
  budget.recordRequest();
  for (let attempt = 0; ; attempt++) {
    try {
      return await op(attempt);
    } catch (err) {
      if (signal?.aborted || attempt >= retries || !isTransient(err) || !budget.tryRetry()) throw err;
      const serverHint = err instanceof HttpError ? err.retryAfterMs : undefined;
      const backoff = Math.random() * Math.min(capMs, baseMs * 2 ** attempt);    // full jitter
      await sleep(Math.max(serverHint ?? 0, backoff), signal);
    }
  }
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => { clearTimeout(id); reject(signal.reason ?? new DOMException("Aborted", "AbortError")); }, { once: true });
  });
}
