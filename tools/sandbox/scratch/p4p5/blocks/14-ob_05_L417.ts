// price-hub.ts
type PriceListener = (price: number) => void;

class PriceHub {
  private sockets = new Map<string, WebSocket>();                  // symbol -> socket
  private listeners = new Map<string, Set<PriceListener>>();
  private latest = new Map<string, number>();
  private closeTimers = new Map<string, ReturnType<typeof setTimeout>>();

  subscribe = (symbol: string, listener: PriceListener): (() => void) => {
    clearTimeout(this.closeTimers.get(symbol));                    // cancel pending close (StrictMode, fast remounts)
    this.closeTimers.delete(symbol);

    let set = this.listeners.get(symbol);
    if (!set) { set = new Set(); this.listeners.set(symbol, set); }
    set.add(listener);
    if (!this.sockets.has(symbol)) this.open(symbol);

    return () => {
      set.delete(listener);
      if (set.size === 0) {
        // grace period: don't tear down the connection on unmount-remount blips
        this.closeTimers.set(symbol, setTimeout(() => this.close(symbol), 2_000));
      }
    };
  };

  getLatest = (symbol: string): number | undefined => this.latest.get(symbol);

  private open(symbol: string) {
    const ws = new WebSocket(`wss://prices.example.com/${encodeURIComponent(symbol)}`);
    ws.onmessage = (e) => {
      const price = Number(JSON.parse(String(e.data)).price);
      this.latest.set(symbol, price);
      this.listeners.get(symbol)?.forEach((l) => l(price));
    };
    this.sockets.set(symbol, ws);
  }

  private close(symbol: string) {
    if (this.listeners.get(symbol)?.size) return;                  // someone re-subscribed
    this.sockets.get(symbol)?.close();
    this.sockets.delete(symbol);
    this.listeners.delete(symbol);
  }
}
export const priceHub = new PriceHub();
export {};
