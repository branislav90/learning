// Before: rule and rendering tangled
function CartTotal({ items }: { items: { price: number; qty: number; taxable: boolean }[] }) {
  let total = 0;
  for (const i of items) {
    total += i.price * i.qty * (i.taxable ? 1.2 : 1);
  }
  return <p>Total: {total.toFixed(2)}</p>;
}
export {};
