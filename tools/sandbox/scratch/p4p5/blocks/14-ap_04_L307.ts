// platform/http/client.ts
import type { ZodType } from "zod";
import { ApiException, type ApiError } from "./errors";

export interface HttpDeps {
  readonly baseUrl: string;
  readonly getToken: () => Promise<string | null>;
  readonly refresh: () => Promise<boolean>;          // single-flight inside the session adapter
  readonly onContractError?: (e: Extract<ApiError, { kind: "contract" }>) => void;
  readonly timeoutMs?: number;
}

export interface RequestOptions<T> {
  readonly signal?: AbortSignal;
  readonly schema: ZodType<T>;
  readonly body?: unknown;
  readonly headers?: Readonly<Record<string, string>>;
  readonly query?: Readonly<Record<string, string | number | undefined>>;
}

export function createHttpClient(deps: HttpDeps) {
  async function send<T>(method: string, path: string, opts: RequestOptions<T>, retried = false): Promise<T> {
    const url = new URL(path, deps.baseUrl);
    for (const [k, v] of Object.entries(opts.query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));

    const signals = [AbortSignal.timeout(deps.timeoutMs ?? 10_000)];
    if (opts.signal) signals.push(opts.signal);
    const signal = AbortSignal.any(signals);              // ⚠ verify browser support floor

    const token = await deps.getToken();
    let res: Response;
    try {
      res = await fetch(url, {
        method,
        signal,
        headers: {
          Accept: "application/json",
          ...(opts.body !== undefined ? { "Content-Type": "application/json" } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...opts.headers,
        },
        body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      });
    } catch (cause) {
      if (opts.signal?.aborted) throw new ApiException({ kind: "aborted" });
      if (cause instanceof DOMException && cause.name === "TimeoutError") throw new ApiException({ kind: "timeout" });
      if (cause instanceof DOMException && cause.name === "AbortError") throw new ApiException({ kind: "aborted" });
      throw new ApiException({ kind: "network", cause });
    }

    const requestId = res.headers.get("x-request-id") ?? undefined;

    if (res.status === 401 && !retried && (await deps.refresh())) return send(method, path, opts, true);

    if (!res.ok) throw new ApiException(await toApiError(res, requestId));

    if (res.status === 204) return opts.schema.parse(undefined);   // schema for "no content" is z.undefined()

    const raw: unknown = await res.json().catch(() => undefined);
    const parsed = opts.schema.safeParse(raw);
    if (!parsed.success) {
      const error = {
        kind: "contract" as const,
        issues: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
        requestId,
      };
      deps.onContractError?.(error);
      throw new ApiException(error);
    }
    return parsed.data;
  }

  return {
    get: <T>(path: string, o: RequestOptions<T>) => send("GET", path, o),
    post: <T>(path: string, o: RequestOptions<T>) => send("POST", path, o),
    put: <T>(path: string, o: RequestOptions<T>) => send("PUT", path, o),
    del: <T>(path: string, o: RequestOptions<T>) => send("DELETE", path, o),
  };
}

async function toApiError(res: Response, requestId?: string): Promise<ApiError> {
  switch (res.status) {
    case 401: return { kind: "unauthenticated" };
    case 403: return { kind: "forbidden" };
    case 404: return { kind: "not_found" };
    case 409:
    case 412: return { kind: "conflict", body: await res.json().catch(() => undefined) };
    case 400:
    case 422: {
      const body: unknown = await res.json().catch(() => undefined);
      return { kind: "validation", fieldErrors: extractFieldErrors(body) };
    }
    case 429: {
      const ra = Number(res.headers.get("retry-after"));
      return { kind: "rate_limited", retryAfterMs: Number.isFinite(ra) ? ra * 1000 : undefined };
    }
    default: return { kind: "server", status: res.status, requestId };
  }
}

function extractFieldErrors(body: unknown): Record<string, string[]> {
  // API-specific; here: { errors: { field: ["msg", ...] } }
  if (typeof body === "object" && body !== null && "errors" in body) {
    const e = (body as { errors: unknown }).errors;
    if (typeof e === "object" && e !== null) {
      return Object.fromEntries(
        Object.entries(e).map(([k, v]) => [k, Array.isArray(v) ? v.map(String) : [String(v)]]),
      );
    }
  }
  return {};
}
export {};
