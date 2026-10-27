function useCheckout() {
  const cart = useCart();
  const coupon = useCoupon(cart.subtotal);
  const shipping = useShippingQuotes(cart.items, address);
  const payment = usePaymentIntent(cart.total, shipping.selected);
  return { cart, coupon, shipping, payment } as const;      // namespaced results, no collisions
}
export {};
