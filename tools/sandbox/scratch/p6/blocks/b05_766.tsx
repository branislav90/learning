function createCoalescer<T>(send: (id: string, v: T) => Promise<void>) {
  const state = new Map<string, { inflight: boolean; next?: { v: T } }>();
  return async function set(id: string, v: T) {
    const s = state.get(id) ?? { inflight: false };
    state.set(id, s);
    if (s.inflight) { s.next = { v }; return; }
    s.inflight = true;
    try { await send(id, v); }
    finally {
      s.inflight = false;
      const queued = s.next; s.next = undefined;
      if (queued) void set(id, queued.v); else state.delete(id);
    }
  };
}
export {};
