// infrastructure/http-dispute-gateway.ts
import type { DisputeGateway, GatewayOutcome, RaiseDisputeRequest } from "../application/ports";

export function createHttpDisputeGateway(opts: { baseUrl: string; fetchImpl?: typeof fetch }): DisputeGateway {
  const doFetch = opts.fetchImpl ?? fetch;
  return {
    async raise(cmd: RaiseDisputeRequest, signal?: AbortSignal): Promise<GatewayOutcome> {
      let res: Response;
      try {
        res = await doFetch(`${opts.baseUrl}/disputes`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Idempotency-Key": cmd.idempotencyKey },
          body: JSON.stringify({
            transaction_id: cmd.transactionId,
            reason: cmd.draft.reason,
            claimed_minor: cmd.draft.claimedAmount?.minor,
            note: cmd.draft.note,
          }),
          signal,
        });
      } catch (e) {
        if (signal?.aborted) throw e;                       // caller cancelled: propagate
        return { kind: "unavailable", retryable: true };    // network failure
      }
      if (res.status === 201) {
        const body = (await res.json()) as { dispute_id: string };    // validate at runtime in real code (lesson 14)
        return { kind: "created", disputeId: body.dispute_id };
      }
      if (res.status === 409) return { kind: "conflict" };
      if (res.status === 422) return { kind: "rejected-window" };
      return { kind: "unavailable", retryable: res.status >= 500 };
    },
  };
}
export {};
