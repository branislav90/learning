// packages/platform/src/api/query-keys.ts
// Tenant first: switching tenant can drop an entire subtree with one call.
export const qk = {
  tenant: (t: string) => ['tenant', t] as const,
  workOrders: {
    all: (t: string) => [...qk.tenant(t), 'work-orders'] as const,
    list: (t: string, filters: WorkOrderFilters) => [...qk.workOrders.all(t), 'list', filters] as const,
    detail: (t: string, id: string) => [...qk.workOrders.all(t), 'detail', id] as const,
  },
  reports: {
    cost: (t: string, range: DateRange, groupBy: string) => [...qk.tenant(t), 'reports', 'cost', range, groupBy] as const,
  },
};
export interface WorkOrderFilters { status?: string[]; assignee?: string; q?: string; page?: number }
export interface DateRange { from: string; to: string }
