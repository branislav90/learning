interface OrderItem { price: number; qty: number } // price in minor units (cents)
interface Order { items: OrderItem[] }

export function calculateTotal(order: Order, discount: number): number {
  const subtotal = order.items.reduce((s, i) => s + i.price * i.qty, 0);
  return Math.max(0, subtotal - discount);
}

// Vitest
import { describe, it, expect } from 'vitest';
describe('calculateTotal', () => {
  it('returns 0 for an empty order', () => expect(calculateTotal({ items: [] }, 0)).toBe(0));
  it('sums price * qty', () => expect(calculateTotal({ items: [{ price: 1999, qty: 2 }] }, 0)).toBe(3998));
  it('never goes negative', () => expect(calculateTotal({ items: [{ price: 500, qty: 1 }] }, 900)).toBe(0));
  it('is exact with integer minor units', () => {
    expect(calculateTotal({ items: [{ price: 10, qty: 3 }] }, 0)).toBe(30); // 0.1*3 in floats would be 0.30000000000000004
  });
});
