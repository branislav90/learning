// api.ts
export async function getOrder(id: string) {
  const res = await fetch(`/api/orders/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
// OrderPage: useQuery({ queryKey: ['order', id], queryFn: () => getOrder(id) })   // library defaults
// Checkout:  useMutation({ mutationFn: createOrder, retry: 5 })                    // "fix for flaky mobile networks"
export {};
