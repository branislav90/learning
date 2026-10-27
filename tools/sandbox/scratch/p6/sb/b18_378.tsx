declare const useProductSearch: any; type useProductSearch<T=any,U=any,V=any> = any;
declare const Product: any; type Product<T=any,U=any,V=any> = any;
declare const serializeProductSearch: any; type serializeProductSearch<T=any,U=any,V=any> = any;
import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query';
import type { ProductSearch } from './productSearch';

export const productKeys = {
  all: ['products'] as const,
  list: (s: ProductSearch) => [...productKeys.all, 'list', s] as const,
};

export const productListQuery = (s: ProductSearch) =>
  queryOptions({
    queryKey: productKeys.list(s),                // the canonical search object IS the key
    queryFn: async ({ signal }) => {
      const sp = serializeProductSearch(s);       // reuse the same serializer for the API call (or map explicitly)
      const res = await fetch(`/api/products?${sp}`, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as { items: Product[]; totalPages: number };
    },
    placeholderData: keepPreviousData,            // v5: keep showing previous page while next loads
    staleTime: 30_000,
  });

function ProductList() {
  const { search, setPage } = useProductSearch();
  const { data, isPlaceholderData } = useQuery(productListQuery(search));

  if (!data) return <p>Loading…</p>;
  return (
    <section aria-busy={isPlaceholderData}>
      <ul>{data.items.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
      <button disabled={search.page <= 1} onClick={() => setPage(search.page - 1)}>Previous</button>
      <button disabled={search.page >= data.totalPages} onClick={() => setPage(search.page + 1)}>Next</button>
    </section>
  );
}
export {};
