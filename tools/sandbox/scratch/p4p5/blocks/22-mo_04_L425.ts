export class ApiError extends Error {
  constructor(readonly status: number, readonly body: unknown, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export interface HttpClientOptions {
  baseUrl: string;
  getToken: () => string | undefined;
  fetchImpl?: typeof fetch;
}

export function createHttpClient({ baseUrl, getToken, fetchImpl = fetch }: HttpClientOptions) {
  return async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = getToken();
    const res = await fetchImpl(`${baseUrl}${path}`, {
      ...init,
      headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}), ...init.headers },
    });
    if (!res.ok) throw new ApiError(res.status, await res.json().catch(() => null), `HTTP ${res.status}`);
    return (await res.json()) as T;
  };
}
export type HttpClient = ReturnType<typeof createHttpClient>;
export {};
