// packages/orders/src/ui/OrderRow.tsx  (WRONG)
import { useAppStore } from "@acme/shared/store";            // global singleton
import { formatMoney } from "@acme/shared";                  // kitchen-sink package
import { trackEvent } from "../../../app/analytics";         // reaches up out of the package
import "./orders.css";                                       // global class names

export function OrderRow({ id }: { id: string }) {
  const order = useAppStore((s) => s.orders[id]);
  ...
}
export {};
