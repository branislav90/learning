function Tags({ tags }: { tags: readonly string[] }) {
  const out: React.ReactNode[] = [];            // created in this render
  for (const t of tags) out.push(<li key={t}>{t}</li>);   // mutated locally: fine
  return <ul>{out}</ul>;
}
