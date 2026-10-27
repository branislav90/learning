export {};
type Money = { amount: number; currency: string };
interface Product { id: string; name: string; price: Money }

function parsePrice(p: unknown): Money {
  if (typeof p === 'number') return { amount: p, currency: 'EUR' }; // legacy contract: euros
  if (p && typeof p === 'object' && 'amount' in p && 'currency' in p) {
    const { amount, currency } = p as { amount: unknown; currency: unknown };
    if (typeof amount === 'number' && typeof currency === 'string') return { amount, currency };
  }
  throw new Error('Unrecognized price shape'); // or return a fallback and report
}
