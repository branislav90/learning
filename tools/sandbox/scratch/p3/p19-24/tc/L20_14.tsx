type Price = { symbol: string; px: number; ts: number };

const prices = createStore<Record<string, Price>>({});

export function connectPrices(url: string) {
  const ws = new WebSocket(url);
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data) as Price;
    prices.setState((prev) => ({ ...prev, [msg.symbol]: msg })); // immutable replace
  };
  return () => ws.close();
}

function PriceCell({ symbol }: { symbol: string }) {
  const px = useStore(prices, (s) => s[symbol]?.px);
  return <td>{px?.toFixed(2) ?? '—'}</td>;
}
