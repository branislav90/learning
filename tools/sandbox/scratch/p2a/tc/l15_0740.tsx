let selectionCount = 0;
export function Item({ id }: { id: string }) {
  const [selected, setSelected] = useState(false);
  if (selected) selectionCount++;
  return <button onClick={() => setSelected(s => !s)}>{id}</button>;
}
