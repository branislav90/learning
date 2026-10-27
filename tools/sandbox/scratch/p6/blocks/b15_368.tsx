import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

interface Order { id: string }

export function useCheckout() {
  const qc = useQueryClient();
  // One key per *intent*; regenerated only after a definitive outcome.
  const keyRef = useRef<string | null>(null);

  return useMutation({
    mutationFn: async (cart: Cart): Promise<Order> => {
      keyRef.current ??= crypto.randomUUID();
      const key = keyRef.current;
      return withRetry(
        async () => {
          const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key },
            body: JSON.stringify(cart),
          });
          if (!res.ok) throw new HttpError(res.status, null, `HTTP ${res.status}`);
          return (await res.json()) as Order;
        },
        { isIdempotent: true }, // true *because* the server dedupes on Idempotency-Key
      );
    },
    onSuccess: () => {
      keyRef.current = null; // definitive success: next checkout is a new intent
      void qc.invalidateQueries({ queryKey: ['cart'] });
    },
    // On definitive client errors (e.g. 422) the user must edit the cart, so the intent changes:
    onError: (error) => {
      if (error instanceof HttpError && error.status >= 400 && error.status < 500) keyRef.current = null;
    },
  });
}
export {};
