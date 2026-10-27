// usage
interface CartState {
  items: { id: string; qty: number }[];
  coupon: string | null;
}

export const cartStore = createStore<CartState>({ items: [], coupon: null });

export function addItem(id: string) {
  cartStore.setState((s) => {
    const existing = s.items.find((i) => i.id === id);
    return {
      ...s,
      items: existing
        ? s.items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
        : [...s.items, { id, qty: 1 }],
    };
  });
}

function CartBadge() {
  const count = useStore(cartStore, (s) => s.items.reduce((n, i) => n + i.qty, 0));
  return <span aria-label={`${count} items in cart`}>{count}</span>;
}
