import { createContext, use } from 'react';
import type { VehicleStore } from './store';
export const VehicleStoreContext = createContext<VehicleStore | null>(null);
export function useVehicleStore(): VehicleStore { const s = use(VehicleStoreContext); if (!s) throw new Error('no store'); return s; }
