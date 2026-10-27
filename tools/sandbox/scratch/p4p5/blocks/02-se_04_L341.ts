// Compose small hooks; each has one reason to change.
function useOrderData(orderId: string) { /* fetch + map; returns state */ }
function useCouponDraft() { /* coupon string + setter */ }
// pure: calcTotals(lines, coupon)

function useOrderPage(orderId: string) {
  const data = useOrderData(orderId);
  const coupon = useCouponDraft();
  const totals = data.status === "ready" ? calcTotals(data.order.lines, coupon.value) : null;
  return { data, totals, coupon };
}
export {};
