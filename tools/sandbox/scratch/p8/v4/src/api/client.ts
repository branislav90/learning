// src/api/client.ts
export const API_URL: string = "http://localhost:3000";

export class ApiError extends Error {
  constructor(readonly status: number, message: string, readonly body?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}
export class NetworkError extends Error {
  constructor(cause?: unknown) { super("Network request failed", { cause }); this.name = "NetworkError"; }
}
export class ValidationError extends ApiError {
  constructor(readonly fieldErrors: Record<string, string>, body?: unknown) { super(422, "Validation failed", body); this.name = "ValidationError"; }
}

export async function apiFetch<T>(path: string, init: RequestInit & { parse?: (data: unknown) => T } = {}): Promise<T> {
  const { parse, headers, ...rest } = init;
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: {
        Accept: "application/json",
        ...(rest.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch (e) {
    if ((e as { name?: string } | null)?.name === "AbortError") throw e;   // let callers distinguish cancellation
    throw new NetworkError(e);
  }

  if (res.status === 204) return undefined as T;

  let body: unknown;
  try { body = await res.json(); } catch { body = undefined; }

  if (!res.ok) {
    if (res.status === 422 && body && typeof body === "object" && "errors" in body) {
      throw new ValidationError((body as { errors: Record<string, string> }).errors, body);
    }
    const message = body && typeof body === "object" && "message" in body ? String((body as { message: unknown }).message) : res.statusText;
    throw new ApiError(res.status, message, body);
  }
  if (body === undefined) throw new ApiError(res.status, "Malformed response body");
  return parse ? parse(body) : (body as T);
}
