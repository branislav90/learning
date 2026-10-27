class HttpError extends Error { constructor(readonly status: number) { super(`HTTP ${status}`); } }
const retryRead = (n: number, e: unknown) =>
  !(e instanceof HttpError && e.status >= 400 && e.status < 500 && e.status !== 408 && e.status !== 429) && n < 3;
useQuery({ queryKey: ['order', id], queryFn: () => getOrder(id), retry: retryRead });
// Checkout: no automatic retry unless the server supports Idempotency-Key; then one key per intent:
const keyRef = useRef(crypto.randomUUID());
useMutation({ mutationFn: (cart: Cart) => createOrder(cart, keyRef.current), retry: false });
export {};
