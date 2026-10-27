type Action = { type: "add"; sku: string } | { type: "remove"; sku: string } | { type: "setQty"; sku: string; qty: number };
const MAX_QTY = 10;
export function basketReducer(state: readonly { sku: string; qty: number }[], a: Action) {
  switch (a.type) {
    case "add": return basketReducer(state, { type: "setQty", sku: a.sku, qty: (state.find(l => l.sku === a.sku)?.qty ?? 0) + 1 });
    case "remove": return state.filter(l => l.sku !== a.sku);
    case "setQty": {
      const qty = Math.min(MAX_QTY, Math.max(0, Math.trunc(a.qty)));
      if (qty === 0) return state.filter(l => l.sku !== a.sku);
      return state.some(l => l.sku === a.sku)
        ? state.map(l => (l.sku === a.sku ? { ...l, qty } : l))
        : [...state, { sku: a.sku, qty }];
    }
  }
}
export {};
