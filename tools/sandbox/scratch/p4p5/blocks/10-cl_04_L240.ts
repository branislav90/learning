// core/use-cases/raise-dispute.ts
import { validate, type DisputeDraft, type DraftIssue } from "../domain/dispute-draft";
import type { Clock, DisputeGateway, DisputeReceipt, GatewayError, Result } from "../ports";

export type RaiseDisputeFailure =
  | { kind: "invalid"; issues: DraftIssue[] }
  | GatewayError;

export interface RaiseDisputeDeps { gateway: DisputeGateway; clock: Clock }

export function makeRaiseDispute({ gateway }: RaiseDisputeDeps) {
  return async function raiseDispute(
    transactionId: string,
    draft: DisputeDraft,
    signal?: AbortSignal,
  ): Promise<Result<DisputeReceipt, RaiseDisputeFailure>> {
    const issues = validate(draft);
    if (issues.length > 0) return { ok: false, error: { kind: "invalid", issues } };
    return gateway.raise(transactionId, draft, signal);
  };
}
export type RaiseDispute = ReturnType<typeof makeRaiseDispute>;
export {};
