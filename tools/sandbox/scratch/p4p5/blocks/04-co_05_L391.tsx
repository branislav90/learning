// app/orders/page.tsx — a Server Component (⚠ file conventions depend on your framework)
import { db } from "@/server/db";            // hypothetical server-only module
import { OrdersTable } from "./OrdersTable";   // Client or Server Component, presentational

export default async function OrdersPage() {
  const orders = await db.orders.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  const rows = orders.map((o) => ({
    id: o.id,
    customer: o.customerName,
    totalLabel: new Intl.NumberFormat("en-GB", { style: "currency", currency: o.currency }).format(o.totalMinor / 100),
    shipped: o.shippedAt != null,
  }));
  return <OrdersTable rows={rows} />;
}
export {};
