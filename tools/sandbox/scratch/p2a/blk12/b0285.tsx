interface ProductProps {
  id: string;
  name: string;
  priceCents: number;
}

export function ProductCard({ id, name, priceCents }: ProductProps) {
  // render: pure derivation only
  const price = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(priceCents / 100);

  // after the UI for this product is on screen: sync with an external system
  useEffect(() => {
    const controller = new AbortController();
    void fetch(`/api/impressions/${id}`, { method: "POST", signal: controller.signal }).catch(() => {});
    return () => controller.abort();
  }, [id]);

  // user action: handler, not render, not effect
  function addToCart() {
    void fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, qty: 1 }),
    });
  }

  return (
    <article>
      <h3>{name}</h3>
      <p>{price}</p>
      <button type="button" onClick={addToCart}>Add to cart</button>
    </article>
  );
}
