// packages/modules/work-orders/src/model/status-machine.ts  (pure domain logic: no React)
import type { WorkOrderStatus as S } from '@fleetline/contracts';

const allowed: Record<S, readonly S[]> = {
  draft: ['open', 'cancelled'],
  open: ['assigned', 'cancelled'],
  assigned: ['in_progress', 'open', 'cancelled'],
  in_progress: ['blocked', 'done'],
  blocked: ['in_progress', 'cancelled'],
  done: [],
  cancelled: [],
};
export const canTransition = (from: S, to: S) => allowed[from].includes(to);
export const nextStates = (from: S) => allowed[from];
