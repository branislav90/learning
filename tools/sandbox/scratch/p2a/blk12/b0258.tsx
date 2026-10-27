function SortedNames({ names }: { names: string[] }) {
  const sorted = names.sort();        // (A)
  return <ol>{sorted.map((n) => <li key={n}>{n}</li>)}</ol>;
}
