import { useEffect, useState } from 'react';

export function PriceTicker({ symbol }: { symbol: string }) {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`wss://example.com/prices?symbol=${encodeURIComponent(symbol)}`);
    ws.onmessage = (e: MessageEvent<string>) => {
      const msg = JSON.parse(e.data) as { price: number };
      setPrice(msg.price);
    };
    return () => ws.close(); // cleanup: runs on unmount, on symbol change, and in Strict Mode's simulated unmount
  }, [symbol]);

  return <output>{price ?? '—'}</output>;
}
export {};
