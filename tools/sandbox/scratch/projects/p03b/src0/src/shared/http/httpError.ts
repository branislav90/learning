// src/shared/http/httpError.ts
export type HttpErrorKind = "not-found" | "client" | "server" | "network" | "aborted";

export class HttpError extends Error {
  readonly kind: HttpErrorKind;
  readonly status: number | null;

  constructor(kind: HttpErrorKind, message: string, status: number | null = null, options?: ErrorOptions) {
    super(message, options);
    this.name = "HttpError";
    this.kind = kind;
    this.status = status;
  }
}

export function kindFromStatus(status: number): HttpErrorKind {
  if (status === 404) return "not-found";
  if (status >= 500) return "server";
  return "client";
}
