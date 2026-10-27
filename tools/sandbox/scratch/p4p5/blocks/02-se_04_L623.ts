export const isOnline = (lastSeenIso: string, nowMs: number, windowMs = 5 * 60_000) =>
  nowMs - Date.parse(lastSeenIso) < windowMs;
// tests
expect(isOnline("2026-01-01T00:00:00Z", Date.parse("2026-01-01T00:04:59Z"))).toBe(true);
expect(isOnline("2026-01-01T00:00:00Z", Date.parse("2026-01-01T00:05:00Z"))).toBe(false);
export {};
