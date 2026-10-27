import { z } from "zod";

const knownStatus = z.enum(["PAID", "PENDING", "CANCELLED"]);

// accept unknown future statuses without failing the whole list
const statusSchema = z.union([knownStatus, z.string().transform((s) => ({ unknown: s }) as const)]);

type StatusWire = z.infer<typeof statusSchema>;   // "PAID" | "PENDING" | "CANCELLED" | { readonly unknown: string }

export type OrderStatus = "paid" | "pending" | "cancelled" | "unknown";
export function toStatus(s: StatusWire): OrderStatus {
  if (typeof s === "object") {
    reportUnknownStatus(s.unknown);                      // telemetry
    return "unknown";
  }
  return ({ PAID: "paid", PENDING: "pending", CANCELLED: "cancelled" } as const)[s];
}
declare function reportUnknownStatus(raw: string): void;
export {};
