// CheckoutButton.tsx
import { useEffect, useReducer } from 'react';
import { checkoutReducer, initialCheckoutState, MAX_ATTEMPTS } from './checkout-machine';

type Order = { cartId: string; total: number };

export function CheckoutButton({ order }: { order: Order }) {
  const [state, dispatch] = useReducer(checkoutReducer, initialCheckoutState);

  // Derive the key that identifies "this particular in-flight request".
  const requestKey = state.status === 'submitting' ? state.attempt : null;

  useEffect(() => {
    if (requestKey === null) return;            // not in the submitting state
    const controller = new AbortController();

    submitOrder(order, controller.signal)
      .then((receipt) => dispatch({ type: 'RESOLVE', receiptId: receipt.id }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;  // we left the state; swallow
        dispatch({ type: 'REJECT', message: error instanceof Error ? error.message : 'Unknown error' });
      });

    return () => controller.abort();            // leaving `submitting` cancels the request
  }, [requestKey, order]);

  switch (state.status) {
    case 'idle':
      return <button onClick={() => dispatch({ type: 'SUBMIT' })}>Pay {order.total}</button>;
    case 'submitting':
      return <button disabled aria-busy="true">Paying… (attempt {state.attempt})</button>;
    case 'failure':
      return (
        <div role="alert">
          <p>{state.message}</p>
          {state.attempt < MAX_ATTEMPTS
            ? <button onClick={() => dispatch({ type: 'RETRY' })}>Retry</button>
            : <button onClick={() => dispatch({ type: 'RESET' })}>Start over</button>}
        </div>
      );
    case 'success':
      return <p>Paid. Receipt {state.receiptId}</p>;
  }
}

async function submitOrder(order: Order, signal: AbortSignal): Promise<{ id: string }> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
    signal,
  });
  if (!res.ok) throw new Error(`Payment failed (${res.status})`);
  return res.json() as Promise<{ id: string }>;
}
export {};
