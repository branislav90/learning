// src/features/checkout/api/placeOrder.ts
import { fetchJson } from "@/shared/http/fetchJson";
import { withRetry } from "@/shared/http/retry";

export function createIntent() {
  // One key per user intent; persist alongside the pending action so reloads reuse it.
  return { idempotencyKey: crypto.randomUUID() };
}

export function placeOrder(cart: Cart, intent: { idempotencyKey: string }, signal?: AbortSignal) {
  return withRetry(
    () => fetchJson<OrderConfirmation>("/api/orders", {
      signal,
      timeoutMs: 15_000,
      init: {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": intent.idempotencyKey },
        body: JSON.stringify(cart),
      },
    }),
    { retries: 2, signal },
  );
}
