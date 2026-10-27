// retryPolicy.ts
import { HttpError, NetworkError } from './http';

export function isTransient(error: unknown): boolean {
  if (error instanceof NetworkError) return true;
  if (error instanceof DOMException && error.name === 'TimeoutError') return true;
  if (error instanceof HttpError) {
    return error.status === 408 || error.status === 429 || error.status === 502 || error.status === 503 || error.status === 504;
  }
  return false; // validation errors, parse errors, AbortError, unknown: never auto-retry
}
export {};
