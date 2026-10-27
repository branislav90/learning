export {};
// DEBT(PORTAL-482, owner: team-orders, until: 2026-03-31): duplicates tax rules from backend until /v2/quote ships.
function estimateTax(amount: number, country: string): number {
  return country === 'DE' ? amount * 0.19 : amount * 0.2;
}
