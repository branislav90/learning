// platform/http/errors.ts
export type ApiError =
  | { readonly kind: "network"; readonly cause: unknown }
  | { readonly kind: "aborted" }
  | { readonly kind: "timeout" }
  | { readonly kind: "unauthenticated" }
  | { readonly kind: "forbidden" }
  | { readonly kind: "not_found" }
  | { readonly kind: "conflict"; readonly body: unknown }
  | { readonly kind: "validation"; readonly fieldErrors: Readonly<Record<string, readonly string[]>> }
  | { readonly kind: "rate_limited"; readonly retryAfterMs?: number }
  | { readonly kind: "server"; readonly status: number; readonly requestId?: string }
  | { readonly kind: "contract"; readonly issues: readonly string[]; readonly requestId?: string };

/** Throwable wrapper so TanStack Query / error boundaries can carry the union. */
export class ApiException extends Error {
  constructor(readonly error: ApiError) {
    super(`ApiError:${error.kind}`);
    this.name = "ApiException";
  }
}
export const isApiException = (e: unknown): e is ApiException => e instanceof ApiException;
export {};
