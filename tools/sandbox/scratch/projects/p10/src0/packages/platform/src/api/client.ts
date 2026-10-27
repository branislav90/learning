// packages/platform/src/api/client.ts
import type { ZodType } from 'zod';
import * as E from './errors';

export interface ApiContext {
  baseUrl: string;
  getTenantId: () => string;
  getAuthHeader: () => string | undefined;
  onUnauthorized: () => void;
  onTelemetry: (e: { method: string; path: string; status: number; ms: number; requestId: string }) => void;
}

export interface RequestOptions<T> {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  schema: ZodType<T>;
  signal?: AbortSignal;
  timeoutMs?: number;
  headers?: Record<string, string>;
}

export function createApi(ctx: ApiContext) {
  return async function request<T>(path: string, opts: RequestOptions<T>): Promise<T> {
    const requestId = crypto.randomUUID();
    const started = performance.now();

    // Combine caller's signal (React Query's cancellation) with our timeout.
    const timeout = AbortSignal.timeout(opts.timeoutMs ?? 15_000);
    const signal = opts.signal ? AbortSignal.any([opts.signal, timeout]) : timeout;

    let res: Response;
    try {
      res = await fetch(ctx.baseUrl + path, {
        method: opts.method ?? 'GET',
        signal,
        headers: {
          'content-type': 'application/json',
          'x-request-id': requestId,
          'x-tenant-id': ctx.getTenantId(),
          ...(ctx.getAuthHeader() ? { authorization: ctx.getAuthHeader()! } : {}),
          ...opts.headers,
        },
        body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
        credentials: 'include',
      });
    } catch (cause) {
      if (opts.signal?.aborted) throw cause;                     // caller cancelled: not an error to report
      if (timeout.aborted) throw new E.TimeoutError('Request timed out', requestId, { cause });
      throw new E.NetworkError('Network failure', requestId, { cause });
    }

    ctx.onTelemetry({ method: opts.method ?? 'GET', path, status: res.status, ms: performance.now() - started, requestId });

    if (res.ok) {
      const json: unknown = res.status === 204 ? null : await res.json();
      const parsed = opts.schema.safeParse(json);
      if (!parsed.success) throw new E.SchemaMismatchError(parsed.error.message, requestId);
      return parsed.data;
    }

    const problem = await res.json().catch(() => ({} as Record<string, unknown>));
    const message = typeof problem.message === 'string' ? problem.message : res.statusText;
    switch (res.status) {
      case 401: ctx.onUnauthorized(); throw new E.AuthError(message, requestId);
      case 403: throw new E.ForbiddenError(message, requestId);
      case 404: throw new E.NotFoundError(message, requestId);
      case 409: throw new E.ConflictError(message, requestId);
      case 422: throw new E.ValidationError(message, (problem.fields as Record<string, string[]>) ?? {}, requestId);
      default:  throw new E.ServerError(message, requestId);
    }
  };
}
