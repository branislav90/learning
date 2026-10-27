export type OrdersQuery = { status: ("open"|"shipped"|"cancelled")[]; sort: "createdAt"|"-createdAt"|"total"|"-total"|"status"|"-status"; size: 25|50|100 };
export const DEFAULT_QUERY: OrdersQuery = { status: [], sort: "-createdAt", size: 50 };
const ST = ["open","shipped","cancelled"] as const;
export function parseOrdersQuery(p: URLSearchParams): OrdersQuery {
  const status = (p.get("status") ?? "").split(",").filter((x): x is OrdersQuery["status"][number] => (ST as readonly string[]).includes(x));
  const sort = (["createdAt","-createdAt","total","-total","status","-status"] as const).find(s => s === p.get("sort")) ?? DEFAULT_QUERY.sort;
  const size = ([25,50,100] as const).find(s => String(s) === p.get("size")) ?? DEFAULT_QUERY.size;
  return { status: [...new Set(status)].sort() as OrdersQuery["status"], sort, size };
}
export function toSearchParams(q: OrdersQuery): URLSearchParams {
  const p = new URLSearchParams();
  if (q.status.length) p.set("status", [...q.status].sort().join(","));
  if (q.sort !== DEFAULT_QUERY.sort) p.set("sort", q.sort);
  if (q.size !== DEFAULT_QUERY.size) p.set("size", String(q.size));
  return p;
}
