// Duplicated KNOWLEDGE: three places hard-code the same business rule
const isLateDashboard = (o: Order) => !o.shippedAt && Date.now() - o.paidAt > 3 * 86_400_000;
const isLateEmail     = (o: Order) => !o.shippedAt && Date.now() - o.paidAt > 3 * 86_400_000;
const isLateCsv       = (o: Order) => !o.shippedAt && Date.now() - o.paidAt > 3 * 86_400_000;
export {};
