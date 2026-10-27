// widgets/product-grid/ui/ProductGrid.tsx
import { ProductCard, type Product } from "@/entities/product";
import { AddToCartButton } from "@/features/add-to-cart";

export function ProductGrid({ products }: { products: Product[] }) {
  return <ul>{products.map(p => <li key={p.id}><ProductCard product={p} actions={<AddToCartButton productId={p.id} />} /></li>)}</ul>;
}
export {};
