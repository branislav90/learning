// pages/CartPage.tsx — cart recommendations use catalog's public hook
import { CartItems } from "@/features/cart";
import { useRecommendations } from "@/features/catalog";
export function CartPage() {
  const recs = useRecommendations();
  return <CartItems recommendations={recs} />;     // cart accepts a slot/prop of recommendations
}
export {};
