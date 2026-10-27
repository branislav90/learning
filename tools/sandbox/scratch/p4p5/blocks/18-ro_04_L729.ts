// app/routes.ts — dependency-free
const enc = encodeURIComponent;
export const paths = {
  orders: {
    list: (q?: { status?: "open" | "shipped"; page?: number }) => {
      const p = new URLSearchParams();
      if (q?.status) p.set("status", q.status);
      if (q?.page && q.page > 1) p.set("page", String(q.page));
      const s = p.toString();
      return `/orders${s ? `?${s}` : ""}`;
    },
    detail: (id: string) => `/orders/${enc(id)}`,
  },
  customers: { detail: (id: string) => `/customers/${enc(id)}` },
  settings: { section: (s: "profile" | "billing") => `/settings/${s}` },
} as const;
// usage: <Link to={paths.orders.detail(order.id)}>; navigate(paths.orders.list({ status: "open" }))
export {};
