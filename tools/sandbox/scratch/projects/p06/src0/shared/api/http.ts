
// shared/api/http.ts
import type { ZodType } from 'zod'

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly retryable: boolean,
  ) { super(message) }
}

interface RequestOptions<T> {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  signal?: AbortSignal
  schema: ZodType<T>
  idempotencyKey?: string
}

export async function http<T>(path: string, opts: RequestOptions<T>): Promise<T> {
  let res: Response
  try {
    res = await fetch(`/api${path}`, {
      method: opts.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(opts.idempotencyKey && { 'Idempotency-Key': opts.idempotencyKey }),
      },
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
      signal: opts.signal,
      credentials: 'include',
    })
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') throw e // let Query treat as cancellation
    throw new ApiError(0, 'network', 'Network error', true)
  }
  if (!res.ok) {
    const problem = await res.json().catch(() => ({}))
    throw new ApiError(res.status, problem.code ?? 'unknown', problem.message ?? res.statusText, res.status >= 500 || res.status === 429)
  }
  const json = res.status === 204 ? undefined : await res.json()
  return opts.schema.parse(json) // ZodError => treated as non-retryable bug
}
