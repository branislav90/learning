// src/shared/http/httpClient.ts
import { HttpError, kindFromStatus } from "./httpError";

export interface RequestOptions {
  params?: Record<string, string | number | undefined>;
  signal?: AbortSignal;
}

export interface HttpClient {
  get<T>(path: string, options?: RequestOptions): Promise<T>;
}

export function createFetchClient(baseUrl: string): HttpClient {
  return {
    async get<T>(path: string, { params, signal }: RequestOptions = {}): Promise<T> {
      const url = new URL(path, baseUrl);
      for (const [key, value] of Object.entries(params ?? {})) {
        if (value !== undefined) url.searchParams.set(key, String(value));
      }
      let response: Response;
      try {
        response = await fetch(url, { signal, headers: { Accept: "application/json" } });
      } catch (cause) {
        if (signal?.aborted) throw new HttpError("aborted", "Request aborted", null, { cause });
        throw new HttpError("network", "Network error", null, { cause });
      }
      if (!response.ok) {
        throw new HttpError(kindFromStatus(response.status), `HTTP ${response.status}`, response.status);
      }
      return (await response.json()) as T; // the boundary: callers must map/validate
    },
  };
}
