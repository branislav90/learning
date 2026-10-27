// src/shared/http/fetchJson.ts
export class HttpError extends Error {
  constructor(readonly status: number, readonly retryAfterMs?: number) {
    super(`HTTP ${status}`);
    this.name = "HttpError";
  }
}

export async function fetchJson<T>(
  url: string,
  opts: { signal?: AbortSignal; timeoutMs?: number; init?: RequestInit } = {},
): Promise<T> {
  const timeout = AbortSignal.timeout(opts.timeoutMs ?? 5000);
  const signal = opts.signal ? AbortSignal.any([opts.signal, timeout]) : timeout;   // ⚠ verify support or polyfill

  const res = await fetch(url, { ...opts.init, signal });
  if (!res.ok) {
    const ra = res.headers.get("retry-after");
    const retryAfterMs = ra && /^\d+$/.test(ra) ? Number(ra) * 1000 : undefined;    // seconds form only; HTTP-date form omitted
    throw new HttpError(res.status, retryAfterMs);
  }
  return (await res.json()) as T;     // validate with a schema at the boundary in real code (lesson 03 / Phase 4)
}
