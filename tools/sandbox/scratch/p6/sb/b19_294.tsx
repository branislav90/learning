declare const ProductPage: any; type ProductPage<T=any,U=any,V=any> = any;
declare const toApiParams: any; type toApiParams<T=any,U=any,V=any> = any;
declare const useProductSearch: any; type useProductSearch<T=any,U=any,V=any> = any;
declare const getJson: any; type getJson<T=any,U=any,V=any> = any;
// URL owns filters ([18]); server-state cache owns products ([08]); a small store owns UI preference ([10]).

// features/products/api.ts  -- the adapter boundary
import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query';
import type { ProductSearch } from './productSearch';

export const productKeys = {
  all: ['products'] as const,
  list: (s: ProductSearch) => [...productKeys.all, 'list', s] as const,
};

export const productListQuery = (s: ProductSearch) =>
  queryOptions({
    queryKey: productKeys.list(s),
    queryFn: ({ signal }) => getJson<ProductPage>(`/api/products?${toApiParams(s)}`, signal),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

export function useProductList(s: ProductSearch) {
  return useQuery(productListQuery(s)); // components import THIS, not useQuery
}

// features/ui/uiStore.ts
import { create } from 'zustand';
interface UiState { sidebarOpen: boolean; toggleSidebar: () => void }
export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));

// ProductsPage.tsx
function ProductsPage() {
  const { search } = useProductSearch();          // URL-derived, typed ([18])
  const { data } = useProductList(search);        // server state keyed by the URL-derived object
  const sidebarOpen = useUiStore((s) => s.sidebarOpen); // selector => subscribes to one field
  /* … */
}
export {};
