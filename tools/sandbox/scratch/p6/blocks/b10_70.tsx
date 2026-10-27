type Listener<T> = (state: T, prev: T) => void;
function createStoreSketch<T>(init: (set: (p: Partial<T>) => void, get: () => T) => T) {
  let state: T;
  const listeners = new Set<Listener<T>>();
  const get = () => state;
  const set = (partial: Partial<T>) => {
    const next = { ...state, ...partial };
    if (!Object.is(next, state)) { const prev = state; state = next; listeners.forEach(l => l(state, prev)); }
  };
  state = init(set, get);
  return { get, set, subscribe: (l: Listener<T>) => (listeners.add(l), () => listeners.delete(l)) };
}
export {};
