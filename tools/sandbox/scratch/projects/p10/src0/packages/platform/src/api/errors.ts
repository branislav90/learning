// packages/platform/src/api/errors.ts
export abstract class AppError extends Error {
  abstract readonly kind: string;
  constructor(message: string, readonly requestId?: string, options?: ErrorOptions) { super(message, options); }
}
export class NetworkError extends AppError { readonly kind = 'network'; }
export class TimeoutError extends AppError { readonly kind = 'timeout'; }
export class AuthError extends AppError { readonly kind = 'auth'; }
export class ForbiddenError extends AppError { readonly kind = 'forbidden'; }
export class NotFoundError extends AppError { readonly kind = 'not-found'; }
export class ConflictError extends AppError { readonly kind = 'conflict'; }
export class ServerError extends AppError { readonly kind = 'server'; }
export class SchemaMismatchError extends AppError { readonly kind = 'schema'; }
export class ValidationError extends AppError {
  readonly kind = 'validation';
  constructor(message: string, readonly fields: Record<string, string[]>, requestId?: string) { super(message, requestId); }
}
export const isAppError = (e: unknown): e is AppError => e instanceof AppError;
