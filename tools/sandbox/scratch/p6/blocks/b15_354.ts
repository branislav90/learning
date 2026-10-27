// ❌ Duplicate orders under flaky networks
async function placeOrder(cart: Cart) {
  return withRetry(
    () => fetch('/api/orders', { method: 'POST', body: JSON.stringify(cart) }).then(r => r.json()),
    { isIdempotent: true }, // ← a lie
  );
}
export {};
