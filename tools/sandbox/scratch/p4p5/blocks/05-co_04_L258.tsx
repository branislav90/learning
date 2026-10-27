// shared/ui/StatusBadge.tsx — generic and props-only
export type Tone = "neutral" | "success" | "warning" | "danger";
export function StatusBadge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return <span data-tone={tone}>{children}</span>;
}

// features/orders/ui/OrderStatusBadge.tsx — domain mapping lives in the feature
import { StatusBadge, type Tone } from "@/shared/ui/StatusBadge";
import type { OrderStatus } from "../model/types";

const toneByStatus: Record<OrderStatus, Tone> = {
  pending: "warning", paid: "success", shipped: "success", refunded: "neutral", failed: "danger",
};

export function OrderStatusBadge({ status, canSeeRefunds }: { status: OrderStatus; canSeeRefunds: boolean }) {
  const tone = status === "refunded" && !canSeeRefunds ? "neutral" : toneByStatus[status];
  return <StatusBadge tone={tone}>{status}</StatusBadge>;
}
export {};
