let nextId = 0;                          // module-level mutable

export function Row({ label }: { label: string }) {
  const id = nextId++;                   // BUG: side effect during render
  return <li data-row-id={id}>{label}</li>;
}

export function Registry() {
  const seen = useRef<string[]>([]);
  seen.current.push("rendered");         // BUG: mutating a ref during render
  return <p>{seen.current.length}</p>;
}
