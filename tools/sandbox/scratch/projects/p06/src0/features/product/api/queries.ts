import { useQuery, useQueryClient } from '@tanstack/react-query'
import { productOptions } from '../../catalog/api/queries'
import { catalogKeys } from '../../catalog/api/queries'
import { toProductDetailSeed, type CatalogPage } from '../../../stubs'
// features/product/api/queries.ts
export function useProduct(id: string) {
  const qc = useQueryClient()
  return useQuery({
    ...productOptions(id),
    // Partial seed: placeholderData is never written to the cache and never counts as "fresh".
    placeholderData: () => {
      for (const [, page] of qc.getQueriesData<CatalogPage>({ queryKey: catalogKeys.lists() })) {
        const hit = page?.items.find((p) => p.id === id)
        if (hit) return toProductDetailSeed(hit) // typed as ProductDetail with optional fields, or a union
      }
      return undefined
    },
  })
}
