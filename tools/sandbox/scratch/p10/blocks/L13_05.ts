type PriceFn = (cart: Cart) => Money;

export function withShadow(oldFn: PriceFn, newFn: PriceFn, report: (diff: unknown) => void): PriceFn {
  return (cart) => {
    const result = oldFn(cart);          // authoritative result
    queueMicrotask(() => {               // do not delay the caller; keep the shadow off the critical path
      try {
        const candidate = newFn(structuredClone(cart)); // clone to avoid shared mutation
        if (candidate.amount !== result.amount || candidate.currency !== result.currency) {
          report({ cartId: cart.id, old: result, new: candidate });
        }
      } catch (error) {
        report({ cartId: cart.id, error: String(error) });
      }
    });
    return result;
  };
}
