export class HttpError extends Error {
  constructor(public status: number, message: string, public body?: unknown) { super(message); this.name = 'HttpError'; }
}

interface Options extends Omit<RequestInit, 'signal'> {
  signal?: AbortSignal;           // caller's cancellation
  timeoutMs?: number;             // per attempt
  maxAttempts?: number;           // total attempts (default 3)
  baseDelayMs?: number;           // backoff base
  maxDelayMs?: number;
}

const IDEMPOTENT = new Set(['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE']);
const RETRYABLE_STATUS = new Set([408, 429, 502, 503, 504]);

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
    const id = setTimeout(() => { signal?.removeEventListener('abort', onAbort); resolve(); }, ms);
    const onAbort = () => { clearTimeout(id); reject(signal!.reason ?? new DOMException('Aborted', 'AbortError')); };
    signal?.addEventListener('abort', onAbort, { once: true });
  });

export async function fetchJson<T>(url: string, opts: Options = {}): Promise<T> {
  const { signal, timeoutMs = 8000, maxAttempts = 3, baseDelayMs = 300, maxDelayMs = 5000, ...init } = opts;
  const method = (init.method ?? 'GET').toUpperCase();
  const canRetry = IDEMPOTENT.has(method);

  for (let attempt = 1; ; attempt++) {
    const controller = new AbortController();
    const onCallerAbort = () => controller.abort(signal!.reason);
    if (signal?.aborted) throw signal.reason ?? new DOMException('Aborted', 'AbortError');
    signal?.addEventListener('abort', onCallerAbort, { once: true });
    const timer = setTimeout(() => controller.abort(new DOMException('Timeout', 'TimeoutError')), timeoutMs);

    try {
      const res = await fetch(url, { ...init, signal: controller.signal });
      if (res.ok) return (await res.json()) as T;

      const retryAfter = Number(res.headers.get('retry-after'));
      const err = new HttpError(res.status, `HTTP ${res.status}`);
      if (!canRetry || !RETRYABLE_STATUS.has(res.status) || attempt >= maxAttempts) throw err;
      const backoff = Math.random() * Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1)); // full jitter
      const delay = Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter * 1000, maxDelayMs) : backoff;
      await sleep(delay, signal);
    } catch (e) {
      if (signal?.aborted) throw e;                              // caller cancelled: never retry
      const isTimeoutOrNetwork = !(e instanceof HttpError);      // fetch rejects with TypeError on network failure; our timeout abort too
      if (!canRetry || !isTimeoutOrNetwork || attempt >= maxAttempts) throw e;
      await sleep(Math.random() * Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1)), signal);
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onCallerAbort);
    }
  }
}
