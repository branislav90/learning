// fetch-json.ts
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body?: unknown,
  ) {
    super(`HTTP ${status} ${statusText}`);
    this.name = 'HttpError';
  }
}

export async function fetchJson(url: string, signal?: AbortSignal): Promise<unknown> {
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!res.ok) {
    // Try to read a structured error body, but don't fail if it isn't JSON.
    const body = await res.json().catch(() => undefined);
    throw new HttpError(res.status, res.statusText, body);
  }
  return res.json(); // Promise<any> in lib.dom — we widen to unknown on purpose.
}
export {};
