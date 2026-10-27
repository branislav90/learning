function Row({ item }: { item: { id: number; tags: string[] } }) {
  const t = item.tags.sort();                       // a
  const sorted = [...item.tags].sort();             // b
  const key = Math.random();                        // c
  const w = window.innerWidth;                      // d
  const cached = useMemo(() => expensive(item.id), [item.id]); // e
  if (item.id > 3) { const [x] = useState(0); }     // f
  const out: string[] = []; out.push("a");          // g
  return <li key={key}>{t.join()}</li>;
}
