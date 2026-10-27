export function ProductList({ products, query, onSelect }) {
  const visible = products.filter((p) => p.name.includes(query));
  const handleClick = (id) => onSelect(id);
  return (
    <ul>
      {visible.map((p) => <ProductRow key={p.id} product={p} onClick={handleClick} />)}
    </ul>
  );
}
