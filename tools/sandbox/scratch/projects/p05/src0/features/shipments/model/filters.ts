// features/shipments/model/filters.ts
import { z } from 'zod'

export const STATUSES = ['pending', 'in_transit', 'delivered', 'exception'] as const
export type Status = (typeof STATUSES)[number]

export const SORT_FIELDS = ['reference', 'customer', 'status', 'weight', 'price', 'createdAt'] as const
export type SortField = (typeof SORT_FIELDS)[number]

const filtersSchema = z.object({
  q: z.string().trim().max(100).default(''),
  status: z.array(z.enum(STATUSES)).default([]),
  from: z.string().date().optional(),
  to: z.string().date().optional(),
  sort: z.enum(SORT_FIELDS).default('createdAt'),
  dir: z.enum(['asc', 'desc']).default('desc'),
  open: z.string().optional(), // record id shown in the panel
})

export type ShipmentFilters = z.infer<typeof filtersSchema>

export function parseFilters(params: URLSearchParams): ShipmentFilters {
  const raw = {
    q: params.get('q') ?? undefined,
    status: params.getAll('status'),
    from: params.get('from') ?? undefined,
    to: params.get('to') ?? undefined,
    sort: params.get('sort') ?? undefined,
    dir: params.get('dir') ?? undefined,
    open: params.get('open') ?? undefined,
  }
  const result = filtersSchema.safeParse(raw)
  // Invalid input => defaults, never an exception in render.
  return result.success ? result.data : filtersSchema.parse({})
}

export function serializeFilters(f: ShipmentFilters): URLSearchParams {
  const p = new URLSearchParams()
  if (f.q) p.set('q', f.q)
  f.status.forEach((s) => p.append('status', s))
  if (f.from) p.set('from', f.from)
  if (f.to) p.set('to', f.to)
  if (f.sort !== 'createdAt') p.set('sort', f.sort)
  if (f.dir !== 'desc') p.set('dir', f.dir)
  if (f.open) p.set('open', f.open)
  return p
}
