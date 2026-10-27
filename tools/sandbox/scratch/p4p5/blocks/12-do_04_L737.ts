export type FreezeVerdict = { allowed: true } | { allowed: false; reason: "expired" | "not-active" | "pending-authorisations" };
export function canFreeze(card: { status: "active" | "frozen" | "expired"; pendingAuths: number }): FreezeVerdict {
  if (card.status === "expired") return { allowed: false, reason: "expired" };
  if (card.status !== "active") return { allowed: false, reason: "not-active" };
  if (card.pendingAuths > 0) return { allowed: false, reason: "pending-authorisations" };
  return { allowed: true };
}
export function canUnfreeze(card: { status: string }, role: "admin" | "user"): boolean {
  return card.status === "frozen" && role === "admin";
}
export {};
