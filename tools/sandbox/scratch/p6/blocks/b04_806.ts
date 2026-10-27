export interface Product { id: string; title: string; price: Money; tags: string[]; releaseDate: string }
export function parseProduct(raw: unknown): Product {
  const o = object(raw, 'product');
  const price = object(o.price, 'product.price');
  const release = str(o.released, 'product.released');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(release)) throw new ParseError('product.released', 'YYYY-MM-DD', release);
  return {
    id: idString(o.id, 'product.id'),
    title: str(o.title, 'product.title'),
    price: { minor: minorUnits(price.amount, 'product.price.amount'), currency: parseCurrency(price.currency, 'product.price.currency') },
    tags: o.tags === null || o.tags === undefined ? [] : array(str)(o.tags, 'product.tags'),
    releaseDate: release,
  };
}
export {};
