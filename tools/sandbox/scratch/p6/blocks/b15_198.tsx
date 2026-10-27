// http.ts
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly retryAfterMs: number | null,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export class NetworkError extends Error {
  constructor(cause: unknown) {
    super('Network request failed', { cause });
    this.name = 'NetworkError';
  }
}

function parseRetryAfter(value: string | null): number | null {
  if (!value) return null;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return seconds * 1000;
  const date = Date.parse(value); // HTTP-date form
  return Number.isNaN(date) ? null : Math.max(0, date - Date.now());
}

export async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { signal });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err; // intentional; do not wrap
    throw new NetworkError(err);
  }
  if (!res.ok) {
    throw new HttpError(res.status, parseRetryAfter(res.headers.get('Retry-After')), `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}
export {};
