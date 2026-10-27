import { z } from 'zod';
export const WorkOrderStatus = z.enum(['draft', 'open', 'assigned', 'in_progress', 'blocked', 'done', 'cancelled']);
export type WorkOrderStatus = z.infer<typeof WorkOrderStatus>;
export const WorkOrder = z.object({ id: z.string(), status: WorkOrderStatus, version: z.number() });
export type WorkOrder = z.infer<typeof WorkOrder>;
