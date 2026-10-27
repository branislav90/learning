// features/orders/api/schemas.ts
import { z } from "zod";

export const orderDtoSchema = z.object({
  order_id: z.string(),
  total_amount: z.string(),
  currency: z.string().length(3),
  created: z.string(),
  state: z.enum(["PAID", "PENDING", "CANCELLED"]),
});
export const orderListDtoSchema = z.object({
  results: z.array(orderDtoSchema),
  next_cursor: z.string().nullable(),
});
export type OrderDto = z.infer<typeof orderDtoSchema>;
export {};
