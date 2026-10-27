// shared/ui/Card.tsx — knows nothing about its content
import type { ReactNode } from "react";
export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (<section><h2>{title}</h2>{children}</section>);
}

// features/orders/ui/OrdersCard.tsx — creator owns the dependency on OrderTable
import { Card } from "@/shared/ui/Card";
import { OrderTable } from "./OrderTable";
export function OrdersCard() { return <Card title="Orders"><OrderTable /></Card>; }
export {};
