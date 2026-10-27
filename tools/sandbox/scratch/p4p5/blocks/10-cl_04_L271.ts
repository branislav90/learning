// adapters/http/http-dispute-gateway.ts
import type { DisputeGateway, GatewayError, Result, DisputeReceipt } from "../../core/ports";
import type { DisputeDraft } from "../../core/domain/dispute-draft";

interface RaiseDisputeResponseDto { dispute_id: string; submitted_at: string }

export function createHttpDisputeGateway(baseUrl: string, fetchImpl: typeof fetch = fetch): DisputeGateway {
  return {
    async raise(transactionId, draft, signal) {
      let res: Response;
      try {
        res = await fetchImpl(`${baseUrl}/transactions/${encodeURIComponent(transactionId)}/disputes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toRequestDto(draft)),
          signal,
        });
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") throw e;   // let cancellation propagate
        return fail({ kind: "unavailable", retryable: true });
      }
      if (res.status === 409) return fail({ kind: "duplicate" });
      if (res.status === 422) return fail({ kind: "window-closed" });
      if (!res.ok) return fail({ kind: "unavailable", retryable: res.status >= 500 });
      const dto = (await res.json()) as RaiseDisputeResponseDto;
      const receipt: DisputeReceipt = { disputeId: dto.dispute_id, submittedAt: new Date(dto.submitted_at) };
      return { ok: true, value: receipt };
    },
  };
}

function fail(error: GatewayError): Result<never, GatewayError> { return { ok: false, error }; }

function toRequestDto(d: DisputeDraft) {
  return { reason: d.reason, claimed_minor: d.claimedAmount?.minor, note: d.note };
}
export {};
