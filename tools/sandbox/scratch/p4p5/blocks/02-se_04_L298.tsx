// features/order/ui/OrderPage.tsx  (presentation)
import { useOrderPage } from "../model/useOrderPage";
import { OrderSummary } from "./OrderSummary";

export function OrderPage({ orderId }: { orderId: string }) {
  const { state, totals, coupon, setCoupon } = useOrderPage(orderId);
  if (state.status === "loading") return <p>Loading…</p>;
  if (state.status === "error") return <p role="alert">{state.message}</p>;
  return (
    <OrderSummary lines={state.order.lines} totals={totals!} coupon={coupon} onCouponChange={setCoupon} />
  );
}
export {};
