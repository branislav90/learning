class Counter {
  value = 0;
  inc() { this.value++; }
}

function Bad() {
  const [counter] = useState(() => new Counter());
  return <button onClick={() => counter.inc()}>{counter.value}</button>;
}
export {};
