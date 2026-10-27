// packages/shared/events/src/index.ts
export interface AppEvents {
  'cart:item-added': { sku: string; qty: number; source: 'pdp' | 'search' | 'recs' };
  'auth:signed-out': { reason: 'user' | 'expired' };
}

type Handler<K extends keyof AppEvents> = (payload: AppEvents[K]) => void;

class Bus {
  private handlers = new Map<keyof AppEvents, Set<Handler<any>>>();

  on<K extends keyof AppEvents>(type: K, h: Handler<K>): () => void {
    const set = this.handlers.get(type) ?? new Set();
    set.add(h);
    this.handlers.set(type, set);
    return () => { set.delete(h); }; // block body: returns void, valid as an effect cleanup
  }

  emit<K extends keyof AppEvents>(type: K, payload: AppEvents[K]): void {
    this.handlers.get(type)?.forEach((h) => {
      try { h(payload); } catch (e) { console.error(`handler for ${String(type)} failed`, e); }
    });
  }
}

export const bus = new Bus();
