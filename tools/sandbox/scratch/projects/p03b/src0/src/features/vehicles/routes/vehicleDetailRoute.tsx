// src/features/vehicles/routes/vehicleDetailRoute.tsx
import { NavLink, Outlet, useLoaderData, type LoaderFunctionArgs } from "react-router";
import type { VehicleApi } from "../api/vehicleApi";
import { HttpError } from "../../../shared/http/httpError";

export function createVehicleDetailLoader(api: VehicleApi) {
  return async ({ params, request }: LoaderFunctionArgs) => {
    const id = params.vehicleId;
    if (id === undefined) throw new Response("Missing vehicle id", { status: 400 });
    try {
      return await api.get(id, request.signal);
    } catch (error) {
      if (error instanceof HttpError && error.kind === "not-found") {
        throw new Response("Vehicle not found", { status: 404 }); // surfaces as a route error response
      }
      throw error; // everything else reaches the route error boundary as-is
    }
  };
}

export function VehicleDetailLayout() {
  const vehicle = useLoaderData() as Awaited<ReturnType<ReturnType<typeof createVehicleDetailLoader>>>;
  return (
    <article>
      <header>
        <h1 tabIndex={-1}>{vehicle.registration}</h1>
        <nav aria-label="Vehicle sections">
          <NavLink to="." end>Summary</NavLink>
          <NavLink to="transactions">Transactions</NavLink>
        </nav>
      </header>
      <Outlet context={vehicle} />
    </article>
  );
}
