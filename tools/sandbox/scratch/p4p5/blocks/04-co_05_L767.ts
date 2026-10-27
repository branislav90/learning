const NOW = Date.parse("2026-01-10T00:00:00Z");
const base = { id: "1", number: 7, customer: "Ada", paidAt: NOW - 5 * 86_400_000 };
test("cancelled wins", () => expect(toRowVM({ ...base, cancelledAt: NOW - 1000, shippedAt: null }, NOW)).toMatchObject({ statusLabel: "Cancelled", statusTone: "bad", canCancel: false }));
test("late",      () => expect(toRowVM({ ...base, cancelledAt: null, shippedAt: null }, NOW)).toMatchObject({ statusLabel: "Late", statusTone: "warn", canCancel: true }));
test("shipped",   () => expect(toRowVM({ ...base, cancelledAt: null, shippedAt: NOW - 1000 }, NOW)).toMatchObject({ statusLabel: "Shipped", canCancel: false }));
export {};
