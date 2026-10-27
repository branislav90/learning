// realtime.ts
type Status = 'idle' | 'connecting' | 'open' | 'reconnecting' | 'closed';
type Listener = () => void;
type Handler = (event: ServerEvent) => void;

export interface ServerEvent {
  topic: string;
  type: string;
  version?: number;
  data?: unknown;
}

interface Options {
  url: () => Promise<string>;     // may fetch a short-lived signed URL/token
  onReconnect: () => void;        // resync hook (invalidate queries etc.)
  heartbeatMs?: number;
  heartbeatTimeoutMs?: number;
}

export class RealtimeClient {
  private ws: WebSocket | null = null;
  private status: Status = 'idle';
  private statusListeners = new Set<Listener>();
  private topics = new Map<string, { count: number; handlers: Set<Handler> }>();
  private attempt = 0;
  private reconnectTimer: number | undefined;
  private heartbeatTimer: number | undefined;
  private pongTimer: number | undefined;
  private everOpened = false;
  private stopped = false;

  constructor(private opts: Options) {}

  // --- external-store API for useSyncExternalStore ---
  subscribeStatus = (l: Listener) => {
    this.statusListeners.add(l);
    return () => void this.statusListeners.delete(l);
  };
  getStatus = () => this.status;
  private setStatus(s: Status) {
    if (this.status === s) return;
    this.status = s;
    this.statusListeners.forEach((l) => l());
  }

  // --- topic subscription with ref counting ---
  subscribe(topic: string, handler: Handler): () => void {
    let entry = this.topics.get(topic);
    if (!entry) {
      entry = { count: 0, handlers: new Set() };
      this.topics.set(topic, entry);
    }
    entry.count += 1;
    entry.handlers.add(handler);
    if (entry.count === 1) this.send({ type: 'subscribe', topic }); // no-op if not open; re-sent on open
    this.connect();
    return () => {
      const e = this.topics.get(topic);
      if (!e) return;
      e.handlers.delete(handler);
      e.count -= 1;
      if (e.count === 0) {
        this.topics.delete(topic);
        this.send({ type: 'unsubscribe', topic });
      }
    };
  }

  private send(msg: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(msg));
  }

  private async connect() {
    if (this.stopped || this.ws || this.reconnectTimer !== undefined) return;
    this.setStatus(this.everOpened ? 'reconnecting' : 'connecting');
    let url: string;
    try { url = await this.opts.url(); } catch { return this.scheduleReconnect(); }
    if (this.stopped) return;

    const ws = new WebSocket(url);
    this.ws = ws;

    ws.onopen = () => {
      this.attempt = 0;
      this.setStatus('open');
      for (const topic of this.topics.keys()) this.send({ type: 'subscribe', topic }); // re-subscribe all
      if (this.everOpened) this.opts.onReconnect();                                   // RESYNC after any reconnect
      this.everOpened = true;
      this.startHeartbeat();
    };

    ws.onmessage = (e: MessageEvent<string>) => {
      this.clearPongWatch(); // any traffic proves liveness: cancel the outstanding ping deadline
      let msg: ServerEvent | { type: 'pong' };
      try { msg = JSON.parse(e.data); } catch { return; }
      if (msg.type === 'pong') return;
      const ev = msg as ServerEvent;
      this.topics.get(ev.topic)?.handlers.forEach((h) => h(ev));
    };

    ws.onclose = (e) => {
      this.cleanupTimers();
      this.ws = null;
      if (this.stopped) return this.setStatus('closed');
      if (e.code === 4401) { this.setStatus('closed'); return; } // app-defined: unauthorized -> do NOT hammer the server
      this.scheduleReconnect();
    };
    // 'error' is always followed by 'close'; handle recovery there.
  }

  private scheduleReconnect() {
    this.setStatus('reconnecting');
    const exp = Math.min(30_000, 1000 * 2 ** this.attempt++);
    const delay = Math.random() * exp; // full jitter
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = undefined;
      void this.connect();
    }, delay);
  }

  private startHeartbeat() {
    const every = this.opts.heartbeatMs ?? 20_000;
    this.heartbeatTimer = window.setInterval(() => {
      this.send({ type: 'ping' });
      this.armPongWatch();
    }, every);
  }
  private armPongWatch() {
    window.clearTimeout(this.pongTimer);
    this.pongTimer = window.setTimeout(() => this.ws?.close(), this.opts.heartbeatTimeoutMs ?? 10_000); // 1005/1006-ish: triggers onclose -> reconnect
  }
  private clearPongWatch() {
    window.clearTimeout(this.pongTimer);
  }
  private cleanupTimers() {
    window.clearInterval(this.heartbeatTimer);
    window.clearTimeout(this.pongTimer);
  }

  close() {
    this.stopped = true;
    window.clearTimeout(this.reconnectTimer);
    this.cleanupTimers();
    this.ws?.close(1000);
    this.ws = null;
    this.setStatus('closed');
  }
}
