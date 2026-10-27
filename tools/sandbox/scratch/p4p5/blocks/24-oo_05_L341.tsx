// (1) Immutable value + pure functions
type Counter = { readonly value: number };
const inc = (c: Counter): Counter => ({ value: c.value + 1 });
function Good1() {
  const [c, setC] = useState<Counter>({ value: 0 });
  return <button onClick={() => setC(inc)}>{c.value}</button>;
}

// (2) Class instance kept as an external store with subscription
class CounterStore {
  #value = 0;
  #listeners = new Set<() => void>();
  getSnapshot = () => this.#value;           // arrow properties keep `this` bound
  subscribe = (l: () => void) => { this.#listeners.add(l); return () => { this.#listeners.delete(l); }; };
  inc = () => { this.#value++; this.#listeners.forEach((l) => l()); };
}
const counterStore = new CounterStore();
function Good2() {
  const v = useSyncExternalStore(counterStore.subscribe, counterStore.getSnapshot, counterStore.getSnapshot);
  return <button onClick={counterStore.inc}>{v}</button>;
}

// (3) A reducer
function Good3() {
  const [n, dispatch] = useReducer((s: number, a: "inc") => (a === "inc" ? s + 1 : s), 0);
  return <button onClick={() => dispatch("inc")}>{n}</button>;
}
export {};
