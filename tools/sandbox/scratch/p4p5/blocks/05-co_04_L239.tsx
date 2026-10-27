// shared/ui/StatusBadge.tsx
import { OrderStatus } from "@/features/orders/model/types";        // shared → feature (upward)
import { useCurrentUser } from "@/features/auth";                   // shared → feature (upward)
export function StatusBadge({ status }: { status: OrderStatus }) {
  const user = useCurrentUser();
  const color = status === "refunded" && user.role !== "admin" ? "grey" : colors[status];
  /* ... */
}

// features/orders/model/useOrders.ts
import { useCart } from "@/features/cart/model/useCart";              // sideways into internals
import { CartDrawer } from "@/features/cart/ui/CartDrawer";           // and a UI import into a model
export {};
