import { z } from "zod";                       // example validation library; any works
const AddressSchema = z.object({ line1: z.string(), city: z.string(), postcode: z.string() });
const OrderSchema = z.object({
  id: z.string(),
  status: z.enum(["open", "shipped"]),
  address: AddressSchema,
  updatedAt: z.string(),
});
export type Order = z.infer<typeof OrderSchema>;

async function getOrder(id: string, signal?: AbortSignal): Promise<Order> {
  const res = await fetch(`/api/orders/${id}`, { signal });
  if (!res.ok) throw new HttpError(res.status, await res.text());
  return OrderSchema.parse(await res.json());  // throws ZodError if the contract is broken
}
export {};
