export function describeDisputeGatewayContract(name: string, make: () => DisputeGateway) {
  describe(`DisputeGateway contract: ${name}`, () => {
    it("returns duplicate on second raise for same transaction", async () => {
      const g = make();
      const draft = { transactionAmount: { minor: 100, currency: "EUR" as const }, evidence: [], note: "", reason: "duplicate" as const };
      expect((await g.raise("t1", draft)).ok).toBe(true);
      const second = await g.raise("t1", draft);
      expect(second).toEqual({ ok: false, error: { kind: "duplicate" } });
    });
  });
}
describeDisputeGatewayContract("in-memory", () => createInMemoryDisputeGateway().gateway);
export {};
