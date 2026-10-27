const seen = new Map<string, number>();
const WINDOW_MS = 10_000;

export function captureError(error: unknown, ctx: Record<string, unknown> = {}) {
  try {
    const err = error instanceof Error ? error : new Error(`Non-Error thrown: ${String(error)}`, { cause: error });
    const fingerprint = `${err.name}:${err.message}:${(err.stack ?? "").split("\n")[1] ?? ""}`;
    const now = Date.now();
    const last = seen.get(fingerprint);
    if (last !== undefined && now - last < WINDOW_MS) return;
    seen.set(fingerprint, now);
    transport.send({ name: err.name, message: err.message, stack: err.stack, ...ctx });
  } catch { /* the reporter must never throw */ }
}
export {};
