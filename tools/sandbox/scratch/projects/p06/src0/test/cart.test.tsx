import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { it, expect, vi } from "vitest";
import * as stubs from "../stubs";
import { useSetCartQuantity } from "../features/cart/api/mutations";
import { cartOptions } from "../features/cart/api/queries";
import { productOptions } from "../features/catalog/api/queries";

const mkCart = (q: number): stubs.Cart => ({ lines: [{ productId: "p", variantId: "v", quantity: q }], itemCount: q, totals: { total: q * 10 } });

it("scope serializes cart mutations; last write wins; display never goes backwards", async () => {
  let inflight = 0, maxInflight = 0; const order: number[] = [];
  let server = 1;
  vi.spyOn(stubs.cartApi, "get").mockImplementation(async () => mkCart(server));
  vi.spyOn(stubs.cartApi, "setQuantity").mockImplementation(async (v) => {
    inflight++; maxInflight = Math.max(maxInflight, inflight); order.push(v.quantity);
    await new Promise((r) => setTimeout(r, 30)); inflight--; server = v.quantity; return mkCart(v.quantity);
  });
  const qc = new QueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  const { result } = renderHook(() => ({ q: useQuery(cartOptions("u")), m: useSetCartQuantity("u") }), { wrapper });
  await waitFor(() => expect(result.current.q.data).toBeDefined());
  const seen: number[] = [];
  const t = setInterval(() => seen.push(result.current.q.data?.itemCount ?? -1), 5);
  await act(async () => { for (const q of [2, 3, 4]) { result.current.m.mutate({ productId: "p", variantId: "v", quantity: q }); await new Promise((r) => setTimeout(r, 5)); } });
  await waitFor(() => expect(result.current.m.isPending).toBe(false), { timeout: 2000 });
  await new Promise((r) => setTimeout(r, 100));
  clearInterval(t);
  console.log("server order", order, "max in flight", maxInflight, "display sequence (dedup)", [...new Set(seen)], "final", result.current.q.data?.itemCount);
  expect(maxInflight).toBe(1);
  expect(result.current.q.data?.itemCount).toBe(4);
  const dedup = seen.filter((x, i) => x !== seen[i - 1]);
  expect(dedup).toEqual([...dedup].sort((a, b) => a - b));
});

it("ensureQueryData returns stale cache without refetch; prefetchQuery respects staleTime", async () => {
  const qc = new QueryClient();
  const spy = vi.spyOn(stubs.catalogApi, "get");
  qc.setQueryData(productOptions("a").queryKey, { id: "a", name: "old" }, { updatedAt: Date.now() - 10 * 60_000 }); // stale (staleTime 60s)
  await qc.ensureQueryData(productOptions("a"));
  console.log("after ensureQueryData on stale entry, fetch calls:", spy.mock.calls.length);
  await qc.prefetchQuery(productOptions("a"));
  console.log("after prefetchQuery on stale entry, fetch calls:", spy.mock.calls.length);
  qc.setQueryData(productOptions("b").queryKey, { id: "b", name: "fresh" });
  await qc.prefetchQuery(productOptions("b"));
  console.log("after prefetchQuery on fresh entry, total calls:", spy.mock.calls.length);
  await qc.ensureQueryData({ ...productOptions("a"), revalidateIfStale: true });
  await new Promise((r) => setTimeout(r, 20));
  console.log("ensureQueryData revalidateIfStale -> calls:", spy.mock.calls.length);
});
