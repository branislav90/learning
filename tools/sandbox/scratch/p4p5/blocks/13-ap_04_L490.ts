export function makeReplaceCard(deps: { cards: CardGateway; limits: LimitGateway }) {
  return async function replaceCard(input: { cardId: string; keepLimits: boolean }, signal?: AbortSignal)
    : Promise<ReplaceOutcome> {
    const blocked = await deps.cards.block(input.cardId, signal);
    if (blocked.kind !== "ok") return { kind: "failed", at: "block" };

    const issued = await deps.cards.issueReplacement(input.cardId, signal);
    if (issued.kind !== "ok") {
      // compensation: attempt to unblock; report partial state if compensation also fails
      const undo = await deps.cards.unblock(input.cardId);                // no signal: compensation must run even if the user cancelled
      return undo.kind === "ok" ? { kind: "failed", at: "issue" } : { kind: "inconsistent", cardId: input.cardId, blocked: true };
    }
    if (input.keepLimits) {
      const moved = await deps.limits.copy(input.cardId, issued.newCardId, signal);
      if (moved.kind !== "ok") return { kind: "partial", newCardId: issued.newCardId, missing: "limits" };
    }
    return { kind: "replaced", newCardId: issued.newCardId };
  };
}
export {};
