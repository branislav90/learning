export function describeDisputeGatewayContract(name: string, make: (scenario: "created" | "conflict" | "window" | "down") => DisputeGateway) {
  describe(name, () => {
    it.each([
      ["created", { kind: "created" }],
      ["conflict", { kind: "conflict" }],
      ["window", { kind: "rejected-window" }],
    ] as const)("%s", async (scenario, expected) => {
      const res = await make(scenario).raise(cmd);
      expect(res.kind).toBe(expected.kind);
    });
    it("down → unavailable(retryable)", async () => {
      expect(await make("down").raise(cmd)).toEqual({ kind: "unavailable", retryable: true });
    });
  });
}
export {};
