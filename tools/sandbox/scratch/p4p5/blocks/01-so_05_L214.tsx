// After: the pricing rule has its own home and test
type CartItem = { price: number; qty: number; taxable: boolean };

export const TAX_RATE = 0.2;

export function cartTotal(items: readonly CartItem[]): number {
  return items.reduce(
    (sum, i) => sum + i.price * i.qty * (i.taxable ? 1 + TAX_RATE : 1),
    0,
  );
}

function CartTotal({ items }: { items: readonly CartItem[] }) {
  return <p>Total: {cartTotal(items).toFixed(2)}</p>;
}
export {};
