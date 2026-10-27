function Counter() {
  const [n, setN] = useState(0);                       // owner
  return <Display value={n} onIncrement={() => setN((c) => c + 1)} />;
}
function Display({ value, onIncrement }: { value: number; onIncrement(): void }) {
  return <button onClick={onIncrement}>{value}</button>;   // reads down, intent up
}
export {};
