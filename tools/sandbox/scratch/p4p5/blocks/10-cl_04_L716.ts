export interface Notifier { notifyRiskTeam(e: { transactionId: string; amountMinor: number }): Promise<void> }
// use case: after gateway success && draft.claimedAmount && minor > 500000 → await notifier.notifyRiskTeam(...)
// adapter: createHttpNotifier(baseUrl) posting to a risk endpoint — NOT the toast
export {};
