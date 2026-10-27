import { z } from 'zod';   // ⚠ API shown follows Zod's commonly documented style; verify for your major version

const Id = z.union([z.string().min(1), z.number().int().safe()]).transform(String);

const StatusKnown = z.enum(['pending', 'paid', 'shipped', 'cancelled']);
const Status = z.string().transform((s) => {
  const r = StatusKnown.safeParse(s);
  return r.success ? r.data : ({ kind: 'unknown', raw: s } as const);
});

const OrderWire = z.object({
  id: Id,
  status: Status,
  created_at: z.string().datetime({ offset: true }).transform((s) => Date.parse(s)),
  total: z.string().regex(/^-?\d+$/).transform(Number),
  currency: z.string().regex(/^[A-Z]{3}$/),
  customer: z.object({ id: Id, full_name: z.string(), email: z.string().nullable() }),
  lines: z.array(z.object({
    sku: z.string(),
    qty: z.union([z.number().int().nonnegative(), z.string().regex(/^\d+$/).transform(Number)]),
    unit_price: z.string().regex(/^-?\d+$/).transform(Number),
  })),
});

export type OrderWireParsed = z.output<typeof OrderWire>;   // the *post-transform* type
export const parseOrderWire = (raw: unknown) => OrderWire.parse(raw);   // throws ZodError with paths
export {};
