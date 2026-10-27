export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (f: { status?: string; customerId?: string; page?: number }) => [...orderKeys.lists(), f] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  items: (id: string) => [...orderKeys.detail(id), 'items'] as const,
  shipments: (id: string) => [...orderKeys.detail(id), 'shipments'] as const,
};
export {};
