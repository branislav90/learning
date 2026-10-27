// adapters/memory/in-memory-gateway.ts
import type { DisputeGateway, DisputeReceipt } from "../../core/ports";

export function createInMemoryDisputeGateway(opts: { now?: () => Date } = {}) {
  const calls: { transactionId: string }[] = [];
  const seen = new Set<string>();
  const gateway: DisputeGateway = {
    async raise(transactionId) {
      calls.push({ transactionId });
      if (seen.has(transactionId)) return { ok: false, error: { kind: "duplicate" } };
      seen.add(transactionId);
      const receipt: DisputeReceipt = { disputeId: `d-${seen.size}`, submittedAt: (opts.now ?? (() => new Date()))() };
      return { ok: true, value: receipt };
    },
  };
  return { gateway, calls };
}
export {};
