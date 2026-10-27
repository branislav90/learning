// in a feature: subscribe with cleanup
import { useEffect } from 'react';
import { bus } from '@acme/shared-events';

export function useOnItemAdded(cb: (p: { sku: string }) => void) {
  useEffect(() => bus.on('cart:item-added', cb), [cb]);
}
