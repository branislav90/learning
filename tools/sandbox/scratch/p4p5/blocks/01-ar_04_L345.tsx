// app/ProductPage.tsx — composition root wires cart behaviour to drawer UI
import { useCart, CartDrawer } from "@/features/cart";
import { useState } from "react";

export function ProductPage({ sku }: { sku: string }) {
  const [open, setOpen] = useState(false);
  const { addAndNotify } = useCart({ onItemAdded: () => setOpen(true) });
  return (
    <>
      <button onClick={() => addAndNotify(sku)}>Add to cart</button>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
export {};
