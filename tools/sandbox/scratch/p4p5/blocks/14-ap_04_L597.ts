// features/orders/api/commands.ts
import { z } from "zod";
import { http } from "@/platform/http";
import { orderDtoSchema } from "./schemas";
import { toOrder } from "./mappers";
import type { Order } from "../model/types";

export interface PlaceOrderCommand {
  readonly cartId: string;
  readonly shippingAddressId: string;
  readonly giftNote?: string;
}

export async function placeOrder(
  cmd: PlaceOrderCommand,
  o: { idempotencyKey: string; signal?: AbortSignal },
): Promise<Order> {
  const dto = await http.post("/orders", {
    schema: orderDtoSchema,
    signal: o.signal,
    headers: { "Idempotency-Key": o.idempotencyKey },
    body: {                                            // command → wire mapping (outbound ACL)
      cart_id: cmd.cartId,
      shipping_address_id: cmd.shippingAddressId,
      gift_note: cmd.giftNote ?? null,
    },
  });
  return toOrder(dto);
}

export const cancelOrderResponse = z.object({ order_id: z.string(), state: z.literal("CANCELLED") });
export {};
