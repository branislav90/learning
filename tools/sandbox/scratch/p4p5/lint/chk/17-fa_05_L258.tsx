// useCheckout.ts
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';          // router package name/version-dependent: verify
import { useServices } from './services/ServicesContext';

type CheckoutStatus =
  | { status: 'idle' }
  | { status: 'placing' }
  | { status: 'failed'; reason: string; message: string };

export function useCheckout(items: readonly CartItem[], address: Address | null) {
  const { checkout, analytics } = useServices();        // checkout = createCheckoutService(...)
  const navigate = useNavigate();
  const { clear } = useCart();
  const [state, setState] = useState<CheckoutStatus>({ status: 'idle' });

  const placeOrder = useCallback(async () => {
    setState((s) => (s.status === 'placing' ? s : { status: 'placing' }));
    const result = await checkout.placeOrder(items, address);
    if (result.ok) {
      clear();
      analytics.track('order_placed', { id: result.orderId, total: result.total });
      navigate(`/orders/${result.orderId}`);
    } else {
      setState({ status: 'failed', reason: result.reason, message: result.message });
    }
  }, [checkout, items, address, clear, analytics, navigate]);

  return useMemo(() => ({ state, placeOrder }), [state, placeOrder]);
}
export {};
