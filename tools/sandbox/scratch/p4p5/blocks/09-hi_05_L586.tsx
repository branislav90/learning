function List({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((i) => {
        const Row = withHover(RowBase);
        return <Row key={i} label={i} />;
      })}
    </ul>
  );
}
export {};
