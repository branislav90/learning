// shared/events/appEvents.ts
type AppEvents = {
  "auth/signedOut": { reason: "user" | "expired" };
  "order/placed": { orderId: string };
};
type Handler<K extends keyof AppEvents> = (payload: AppEvents[K]) => void;

const handlers: { [K in keyof AppEvents]?: Set<Handler<K>> } = {};

export function on<K extends keyof AppEvents>(name: K, h: Handler<K>): () => void {
  const set = (handlers[name] ??= new Set()) as Set<Handler<K>>;
  set.add(h);
  return () => set.delete(h);
}

export function emit<K extends keyof AppEvents>(name: K, payload: AppEvents[K]): void {
  const set = handlers[name] as Set<Handler<K>> | undefined;
  set?.forEach((h) => {
    try { h(payload); } catch (e) { reportError(e); }   // one bad listener must not break the emitter
  });
}
export {};
