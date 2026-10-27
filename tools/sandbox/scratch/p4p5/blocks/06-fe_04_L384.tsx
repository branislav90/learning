// pages/CatalogPage.tsx — composes both features; owns the cross-feature wiring
import { ProductGrid } from "@/features/catalog";
import { AddToCartButton } from "@/features/cart";

export function CatalogPage() {
  return (
    <ProductGrid
      renderActions={(p) => <AddToCartButton sku={p.sku} name={p.name} priceMinor={p.priceMinor} />}
    />
  );
}
export {};
