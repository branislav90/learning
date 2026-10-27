// packages/orders/src/ui/OrderRow.tsx (corrected)
import { formatMoney, type Money } from "@acme/money";      // narrow, domain-agnostic package
import styles from "./OrderRow.module.css";                 // scoped styles
import { useOrdersEnv } from "../env";                       // explicit environment contract

export interface OrderRowProps { readonly order: { id: string; total: Money; status: string } }

export function OrderRow({ order }: OrderRowProps) {
  const { onEvent } = useOrdersEnv();                        // injected, e.g. analytics adapter
  return (
    <li className={styles.row} onClick={() => onEvent({ type: "order.opened", orderId: order.id })}>
      {order.id} — {formatMoney(order.total)} — {order.status}
    </li>
  );
}
export {};
