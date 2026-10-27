// shared/errors/captureError.ts
export function captureError(error: unknown, ctx: Record<string, unknown> = {}) {
  const err = error instanceof Error ? error : new Error(`Non-Error thrown: ${safeString(error)}`, { cause: error });
  const payload = { name: err.name, message: err.message, stack: err.stack, ...redact(ctx), release: __APP_RELEASE__, route: location.pathname };
  if (import.meta.env.DEV) console.error("[captureError]", payload);
  else transport.send(payload);        // vendor SDK or beacon; must never throw
}
export {};
