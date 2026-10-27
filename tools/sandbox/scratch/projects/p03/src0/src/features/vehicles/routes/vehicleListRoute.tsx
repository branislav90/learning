// src/features/vehicles/routes/vehicleListRoute.tsx
import { useLoaderData, useNavigation, type LoaderFunctionArgs } from "react-router";
import type { VehicleApi } from "../api/vehicleApi";
import { parseVehicleListQuery } from "../model/listQuery";
import { VehicleFilters } from "../ui/VehicleFilters";
import { VehicleTable } from "../ui/VehicleTable";
import { Pagination } from "../../../shared/ui/Pagination";

export function createVehicleListLoader(api: VehicleApi) {
  return async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const query = parseVehicleListQuery(url.searchParams); // validate at the boundary
    const page = await api.list(query, request.signal); // cancellation: A5
    return { query, page };
  };
}

export function VehicleListPage() {
  // The generic derives the data type from the loader factory's return type (no cast).
  const { query, page } = useLoaderData<ReturnType<typeof createVehicleListLoader>>();
  const navigation = useNavigation();
  const isPending = navigation.state === "loading";

  return (
    <section aria-labelledby="vehicles-heading" aria-busy={isPending}>
      <h1 id="vehicles-heading" tabIndex={-1}>Vehicles</h1>
      <VehicleFilters query={query} />
      <div className={isPending ? "dim" : undefined}>
        <VehicleTable vehicles={page.items} sort={{ key: query.sort, dir: query.dir }} />
      </div>
      <Pagination page={page.page} pageCount={page.pageCount} />
    </section>
  );
}
