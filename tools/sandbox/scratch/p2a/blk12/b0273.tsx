function SortedNames({ names }: { names: readonly string[] }) {
  const sorted = [...names].sort();           // copy, then local mutation: fine
  // or: const sorted = names.toSorted();     // ES2023; needs lib/target support (TS "lib": ["ES2023"]) and runtime support
  return <ol>{sorted.map((n) => <li key={n}>{n}</li>)}</ol>;
}
