export {};
// core package
export interface EventMap {}                         // empty registry; teams augment it
type Key = keyof EventMap & string;
export interface Bus {
  emit<K extends Key>(type: K, payload: EventMap[K]): void;
  on<K extends Key>(type: K, handler: (payload: EventMap[K]) => void): () => void; // returns unsubscribe
}
// team A package
declare module "@org/bus" { interface EventMap { "cart:updated": { count: number } } }
