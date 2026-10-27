// packages/platform/src/realtime/socket.ts  (reconnect with backoff + jitter + resync)
export function createSocket(opts: {
  url: () => string; onMessage: (m: unknown) => void; onStatus: (s: 'connecting' | 'open' | 'degraded') => void; resync: () => Promise<void>;
}) {
  let ws: WebSocket | null = null; let attempt = 0; let closed = false; let timer: ReturnType<typeof setTimeout>;

  const connect = () => {
    opts.onStatus(attempt === 0 ? 'connecting' : 'degraded');
    ws = new WebSocket(opts.url());
    ws.onopen = async () => { attempt = 0; await opts.resync(); opts.onStatus('open'); };   // snapshot THEN trust deltas
    ws.onmessage = (e) => { try { opts.onMessage(JSON.parse(e.data as string)); } catch { /* count + report, never crash */ } };
    ws.onclose = () => { if (closed) return; schedule(); };
    ws.onerror = () => ws?.close();
  };
  const schedule = () => {
    const base = Math.min(30_000, 500 * 2 ** attempt++);
    timer = setTimeout(connect, base * (0.5 + Math.random() * 0.5));
  };
  connect();
  return { close() { closed = true; clearTimeout(timer); ws?.close(); } };          // cleanup is part of the contract
}
