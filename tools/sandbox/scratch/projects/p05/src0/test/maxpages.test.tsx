import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider, infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { it, expect } from "vitest";
const pages = (n: number) => ({ items: [n], next: n < 9 ? n + 1 : null, prev: n > 0 ? n - 1 : null });
const mk = (prev: boolean) => infiniteQueryOptions({
  queryKey: ["x", prev], queryFn: async ({ pageParam }) => pages(pageParam), initialPageParam: 0, maxPages: 3,
  getNextPageParam: (l) => l.next, ...(prev ? { getPreviousPageParam: (f: ReturnType<typeof pages>) => f.prev } : {}),
});
for (const prev of [false, true]) it(`maxPages with getPreviousPageParam=${prev}`, async () => {
  const qc = new QueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  const { result } = renderHook(() => useInfiniteQuery(mk(prev)), { wrapper });
  await waitFor(() => expect(result.current.data).toBeDefined());
  for (let i = 0; i < 6; i++) { await act(async () => { await result.current.fetchNextPage(); }); }
  console.log(`prev=${prev}: pageParams`, result.current.data!.pageParams, "hasPreviousPage", result.current.hasPreviousPage, "hasNextPage", result.current.hasNextPage);
});
