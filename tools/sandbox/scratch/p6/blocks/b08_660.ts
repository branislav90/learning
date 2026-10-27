export const productOptions = (id: number | undefined) =>
  queryOptions({
    queryKey: ['products', 'detail', id] as const,
    queryFn: async ({ signal }) => {
      const res = await fetch(`/api/products/${id}`, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as Product;
    },
    enabled: id !== undefined,
    staleTime: 5 * 60_000,
  });
export const useProduct = (id?: number) => useQuery(productOptions(id));
export {};
