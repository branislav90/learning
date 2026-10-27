import { useMemo } from 'react';
import { useSearchParams } from 'react-router';           // ⚠ package name differs by version: 'react-router-dom' (v6) vs 'react-router' (v7). Verify.
import { parseProductSearch, serializeProductSearch, type ProductSearch } from './productSearch';

export function useProductSearch() {
  const [sp, setSp] = useSearchParams();
  const search = useMemo(() => parseProductSearch(sp), [sp]);

  function update(patch: Partial<ProductSearch>, opts: { resetPage?: boolean; replace?: boolean } = {}) {
    const { resetPage = true, replace = true } = opts;
    const next: ProductSearch = { ...search, ...patch, page: patch.page ?? (resetPage ? 1 : search.page) };
    setSp(serializeProductSearch(next), { replace });
  }

  return {
    search,
    setFilter: (patch: Partial<Omit<ProductSearch, 'page'>>) => update(patch, { resetPage: true, replace: true }),
    setPage: (page: number) => update({ page }, { resetPage: false, replace: false }), // pagination pushes
  };
}
export {};
