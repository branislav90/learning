// features/catalog/ui/ProductTile.tsx — knows nothing about cart
import type { ReactNode } from "react";
import type { Product } from "../model/types";

export function ProductTile({ product, actions }: { product: Product; actions?: ReactNode }) {
  return (
    <article>
      <h3>{product.name}</h3>
      <p>{product.priceText}</p>
      {actions}
    </article>
  );
}
export {};
