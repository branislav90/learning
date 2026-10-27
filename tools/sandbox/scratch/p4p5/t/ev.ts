type AppEvents = {
  "auth/signedOut": { reason: "user" | "expired" };
  "order/placed": { orderId: string };
};
type Handler<K extends keyof AppEvents> = (payload: AppEvents[K]) => void;
const handlers: { [K in keyof AppEvents]?: Set<Handler<K>> } = {};
export function on<K extends keyof AppEvents>(name: K, h: Handler<K>): () => void {
  const set = ((handlers[name] ??= new Set() as never) as Set<Handler<K>>);
  set.add(h);
  return () => { set.delete(h); };
}
