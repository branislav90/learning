// core/use-cases/raise-dispute.test.ts  (Vitest)
import { describe, it, expect } from "vitest";
import { makeRaiseDispute } from "./raise-dispute";
import { createInMemoryDisputeGateway } from "../../adapters/memory/in-memory-gateway";

describe("raiseDispute", () => {
  it("does not call the gateway for an invalid draft", async () => {
    const { gateway, calls } = createInMemoryDisputeGateway();
    const raise = makeRaiseDispute({ gateway, clock: { now: () => new Date("2025-01-01") } });
    const res = await raise("tx-1", { transactionAmount: { minor: 1000, currency: "EUR" }, evidence: [], note: "" });
    expect(res.ok).toBe(false);
    expect(calls).toHaveLength(0);
  });
});
export {};
