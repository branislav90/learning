// application/useCheckout.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";   // ⚠ verify API vs current docs
import { useNavigate } from "react-router";                            // ⚠ verify package/API vs your router version

export function useCheckout() {
  const cart = useCart();                       // query: current cart (from cart feature public API)
  const { clear } = useCartCommands();          // command: owned by cart feature
  const qc = useQueryClient();
  const navigate = useNavigate();
  const analytics = useAnalytics();             // port; implementation injected at app root (see lesson 11)

  const mutation = useMutation({
    mutationFn: (key: string) => checkoutApi.placeOrder(cart, key),
    onSuccess: (order) => {
      qc.setQueryData(ordersKeys.detail(order.id), order);
      qc.invalidateQueries({ queryKey: ordersKeys.lists() });
      clear();
      analytics.track("order_placed", { orderId: order.id, totalCents: totalCents(cart) });
      navigate(`/orders/${order.id}`);
    },
  });

  const check = canPlaceOrder(cart, MIN_ORDER_CENTS);           // derived each render, not stored
  return {
    check,
    isPending: mutation.isPending,
    error: mutation.error,
    placeOrder: () => {
      if (!check.ok || mutation.isPending) return;              // domain + double-submit guard
      mutation.mutate(crypto.randomUUID());                     // new idempotency key per user intent
    },
  };
}
export {};
