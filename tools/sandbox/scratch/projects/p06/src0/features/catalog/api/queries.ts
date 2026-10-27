import { queryOptions, keepPreviousData } from '@tanstack/react-query'
import { catalogApi, type CatalogFilters } from '../../../stubs'
// features/catalog/api/queries.ts
export const catalogKeys = {
  all: ['catalog'] as const,
  lists: () => [...catalogKeys.all, 'list'] as const,
  list: (f: CatalogFilters) => [...catalogKeys.lists(), f] as const,
  details: () => [...catalogKeys.all, 'detail'] as const,
  detail: (id: string) => [...catalogKeys.details(), id] as const,
  reviews: (id: string) => [...catalogKeys.detail(id), 'reviews'] as const,
}

export const catalogListOptions = (f: CatalogFilters) =>
  queryOptions({
    queryKey: catalogKeys.list(f),
    queryFn: ({ signal }) => catalogApi.list(f, signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60_000,
  })

export const productOptions = (id: string) =>
  queryOptions({
    queryKey: catalogKeys.detail(id),
    queryFn: ({ signal }) => catalogApi.get(id, signal),
    staleTime: 60_000, // price/stock are volatile; shorter than list metadata
  })
