<ProductList
  products={products}
  getKey={(p) => p.id}
  renderProduct={(p) => (
    <ProductCard product={p}
      badge={p.stock < 5 ? "Low stock" : undefined}
      actions={<><WishlistButton id={p.id} /><CompareButton id={p.id} /></>}
      onOpen={() => navigate(p.id)} />
  )}
/>
export {};
