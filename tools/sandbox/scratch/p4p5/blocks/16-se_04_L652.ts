export const useProducts = (f: ProductFilter) =>
  useQuery({ queryKey: productKeys.list(f), queryFn: ({ signal }) => productsApi.list(f, signal) });
export const useProduct = (id: string) =>
  useQuery({ queryKey: productKeys.detail(id), queryFn: ({ signal }) => productsApi.get(id, signal), enabled: id !== "" });
export {};
