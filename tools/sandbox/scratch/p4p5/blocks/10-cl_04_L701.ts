export interface RaiseDisputeCommand { transactionId: string; draft: DisputeDraft; windowEndsAt: Date }

export function makeRaiseDispute({ gateway, clock }: RaiseDisputeDeps) {
  return async (cmd: RaiseDisputeCommand, signal?: AbortSignal) => {
    if (clock.now().getTime() > cmd.windowEndsAt.getTime()) return { ok: false as const, error: { kind: "window-closed" as const } };
    const issues = validate(cmd.draft);
    if (issues.length) return { ok: false as const, error: { kind: "invalid" as const, issues } };
    return gateway.raise(cmd.transactionId, cmd.draft, signal);
  };
}
export {};
