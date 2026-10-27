// core/ports.ts
import type { DisputeDraft } from "./domain/dispute-draft";

export interface DisputeReceipt { readonly disputeId: string; readonly submittedAt: Date; }

export type GatewayError =
  | { kind: "window-closed" }
  | { kind: "duplicate" }
  | { kind: "unavailable"; retryable: boolean };

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export interface DisputeGateway {
  raise(transactionId: string, draft: DisputeDraft, signal?: AbortSignal): Promise<Result<DisputeReceipt, GatewayError>>;
}

export interface Clock { now(): Date }
export {};
