export function parseOrdersSearch(sp: URLSearchParams) {
  const status = sp.get("status");
  const sort = sp.get("sort");
  const pageRaw = Number(sp.get("page"));
  return {
    status: status === "open" || status === "shipped" ? status : undefined,
    sort: sort === "total" ? "total" : "date",
    page: Number.isInteger(pageRaw) && pageRaw >= 1 ? pageRaw : 1,
  } as const;
}
export {};
