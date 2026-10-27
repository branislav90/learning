// features/shipments/api/queries.ts
import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query'
import { shipmentsApi } from './shipmentsApi'
import type { ShipmentFilters } from '../model/filters'

export const shipmentKeys = {
  all: ['shipments'] as const,
  list: (f: Omit<ShipmentFilters, 'open'>) => [...shipmentKeys.all, 'list', f] as const,
  detail: (id: string) => [...shipmentKeys.all, 'detail', id] as const,
}

export function shipmentsInfiniteOptions(filters: ShipmentFilters) {
  const { open: _open, ...listFilters } = filters // opening a panel must not refetch the list
  return infiniteQueryOptions({
    queryKey: shipmentKeys.list(listFilters),
    queryFn: ({ pageParam, signal }) =>
      shipmentsApi.list({ ...listFilters, cursor: pageParam, limit: 500 }, signal),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
    placeholderData: keepPreviousData, // N3: keep old rows visible while the new filter loads
    staleTime: 30_000,
    maxPages: 40, // bound memory in continuous mode: 40 * 500 = 20k rows retained
  })
}

export const shipmentDetailOptions = (id: string) =>
  queryOptions({
    queryKey: shipmentKeys.detail(id),
    queryFn: ({ signal }) => shipmentsApi.get(id, signal),
  })
