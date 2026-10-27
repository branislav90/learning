// CartBadge.tsx
import { useAppSelector } from './store/hooks';
import { cartSlice } from './store/cartSlice';

export function CartBadge() {
  const count = useAppSelector(cartSlice.selectors.selectCount);
  return <span aria-label={`${count} items in cart`}>{count}</span>;
}
export {};
