// emitter.ts
type EventMap = Record<string, unknown>;

export function createEmitter<E extends EventMap>() {
  const handlers = new Map<keyof E, Set<(payload: never) => void>>();

  function on<K extends keyof E>(type: K, handler: (payload: E[K]) => void): () => void {
    let set = handlers.get(type);
    if (!set) { set = new Set(); handlers.set(type, set); }
    set.add(handler as (payload: never) => void);
    return () => {
      const s = handlers.get(type);
      s?.delete(handler as (payload: never) => void);
      if (s && s.size === 0) handlers.delete(type);
    };
  }

  function emit<K extends keyof E>(type: K, payload: E[K]): void {
    const snapshot = [...(handlers.get(type) ?? [])] as Array<(p: E[K]) => void>;
    const errors: unknown[] = [];
    for (const h of snapshot) {
      try { h(payload); } catch (e) { errors.push(e); }       // isolate observers
    }
    if (errors.length) queueMicrotask(() => { throw errors[0]; }); // surface, but after everyone ran
  }

  return { on, emit };
}

// usage
type AppEvents = {
  'cart:added': { sku: string; qty: number };
  'auth:logout': undefined;
};
export const bus = createEmitter<AppEvents>();
const off = bus.on('cart:added', ({ sku }) => console.info('added', sku));
bus.emit('cart:added', { sku: 'A1', qty: 1 });
off();
export {};
