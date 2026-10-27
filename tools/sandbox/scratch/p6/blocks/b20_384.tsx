export class HttpError extends Error {
  constructor(readonly status: number, message = `HTTP ${status}`) { super(message); this.name = 'HttpError'; }
}

export async function getJson<T>(
  url: string,
  { signal, timeoutMs }: { signal?: AbortSignal; timeoutMs?: number } = {},
): Promise<T> {
  const signals = [signal, timeoutMs ? AbortSignal.timeout(timeoutMs) : undefined].filter(
    (s): s is AbortSignal => s !== undefined,
  );
  const combined = signals.length > 0 ? AbortSignal.any(signals) : undefined; // ⚠ verify browser/Node support
  const res = await fetch(url, { signal: combined, headers: { Accept: 'application/json' } });
  if (!res.ok) throw new HttpError(res.status);
  const type = res.headers.get('content-type') ?? '';
  if (!type.includes('application/json')) throw new TypeError(`Expected JSON but received "${type || 'no content-type'}"`);
  return (await res.json()) as T;
}
export {};
