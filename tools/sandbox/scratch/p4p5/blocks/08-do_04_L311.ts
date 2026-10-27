// contexts/disputes/domain/disputable-transaction.ts
import type { Money } from "../../../shared-kernel/money";

export type TransactionId = string & { readonly __brand: "TransactionId" };

export interface DisputableTransaction {
  readonly id: TransactionId;
  readonly amount: Money;
  readonly occurredAt: Date;
  readonly merchantName: string;
  readonly disputeWindowEndsAt: Date;
}

export type CannotDisputeReason = "window-closed" | "already-disputed";

export function disputability(
  tx: DisputableTransaction,
  alreadyDisputed: boolean,
  now: Date,
): { ok: true } | { ok: false; reason: CannotDisputeReason } {
  if (alreadyDisputed) return { ok: false, reason: "already-disputed" };
  if (now.getTime() > tx.disputeWindowEndsAt.getTime()) return { ok: false, reason: "window-closed" };
  return { ok: true };
}
export {};
