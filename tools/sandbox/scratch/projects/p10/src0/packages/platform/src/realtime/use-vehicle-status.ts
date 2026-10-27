// packages/platform/src/realtime/use-vehicle-status.ts
import { useCallback, useSyncExternalStore } from 'react';
import { useVehicleStore } from './context';

export function useVehicleLive(id: string) {
  const store = useVehicleStore();
  return useSyncExternalStore(
    useCallback((l) => store.subscribeKey(id, l), [store, id]),     // stable per (store,id) => no resubscribe churn
    () => store.getVehicle(id),
    () => undefined,                                                 // server snapshot (unused in SPA, harmless)
  );
}

export function useVehicleIds() {
  const store = useVehicleStore();
  return useSyncExternalStore(store.subscribeAll, store.getIds);
}
