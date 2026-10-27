// features/orders/routes.tsx — verify-against-docs: createFileRoute / validateSearch / zod adapter names
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const OrdersSearch = z.object({
  status: z.enum(["open", "shipped"]).optional(),
  page: z.number().int().min(1).catch(1),         // invalid → default; never crashes
  sort: z.enum(["date", "total"]).catch("date"),
});

export const Route = createFileRoute("/orders/")({
  validateSearch: OrdersSearch,                    // untrusted URL → typed object
  loaderDeps: ({ search }) => ({ search }),        // loader cache keys from validated search
  loader: ({ deps: { search }, context }) => context.queryClient.ensureQueryData(ordersQuery(search)),
  component: OrdersList,
});

function OrdersList() {
  const search = Route.useSearch();                // typed: { status?: ..., page: number, sort: ... }
  const navigate = Route.useNavigate();
  return (
    <button onClick={() => navigate({ search: (prev) => ({ ...prev, page: prev.page + 1 }) })}>Next</button>
  );
}
export {};
