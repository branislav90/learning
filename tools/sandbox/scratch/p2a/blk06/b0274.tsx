function Todos({ items }: { items: string[] }) {
  return <ul>{items.map((t) => <TodoRow label={t} />)}</ul>;   // no keys; each TodoRow has local `checked` state
}
