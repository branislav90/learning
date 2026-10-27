// application/raise-dispute.ts
import { disputability } from "../domain/disputability";
import { validate, type DisputeDraft } from "../domain/dispute-draft";
import type { Analytics, Clock, DisputeGateway, Events } from "./ports";
import type { RaiseDisputeOutcome } from "./outcomes";

export interface RaiseDisputeDeps { gateway: DisputeGateway; clock: Clock; events: Events; analytics: Analytics }

export interface RaiseDisputeInput {
  transaction: { id: string; disputeWindowEndsAt: Date; alreadyDisputed: boolean };
  draft: DisputeDraft;
  idempotencyKey: string;
}

export function makeRaiseDispute(deps: RaiseDisputeDeps) {
  return async function raiseDispute(input: RaiseDisputeInput, signal?: AbortSignal): Promise<RaiseDisputeOutcome> {
    const verdict = disputability(input.transaction, deps.clock.now());
    if (!verdict.ok) return verdict.reason === "already-disputed" ? { kind: "duplicate" } : { kind: "window-closed" };

    const issues = validate(input.draft);
    if (issues.length > 0) return { kind: "invalid", issues };

    const res = await deps.gateway.raise(
      { transactionId: input.transaction.id, draft: input.draft, idempotencyKey: input.idempotencyKey },
      signal,
    );

    switch (res.kind) {
      case "created":
        safely(() => deps.events.publish({ type: "DisputeRaised", transactionId: input.transaction.id, disputeId: res.disputeId }));
        safely(() => deps.analytics.track("dispute_raised", { hasEvidence: input.draft.evidence.length > 0 }));
        return { kind: "raised", disputeId: res.disputeId };
      case "conflict": return { kind: "duplicate" };
      case "rejected-window": return { kind: "window-closed" };
      case "unavailable": return { kind: "unavailable", retryable: res.retryable };
    }
  };
}
export type RaiseDispute = ReturnType<typeof makeRaiseDispute>;

function safely(fn: () => void): void {
  try { fn(); } catch { /* best-effort side effects must not change the command's outcome; log via a Logger port in real code */ }
}
export {};
