// src/app/routes.tsx
import type { RouteObject } from "react-router";
import type { FleetApi } from "./api";
import { AppShell } from "./AppShell";
import { RouteErrorBoundary } from "./RouteErrorBoundary";
import { NotFoundPage } from "./NotFoundPage";

export function createRoutes(api: FleetApi): RouteObject[] {
  return [
    {
      path: "/",
      Component: AppShell,
      children: [
        {
          // Pathless layout route INSIDE the shell: errors below replace only the <Outlet> content, so the shell stays.
          ErrorBoundary: RouteErrorBoundary,
          children: [
        {
          index: true,
          lazy: async () => {
            const m = await import("../features/overview/routes/overviewRoute");
            return { Component: m.OverviewPage, loader: m.createOverviewLoader(api.overview) };
          },
        },
        {
          path: "vehicles",
          lazy: async () => {
            const m = await import("../features/vehicles/routes/vehicleListRoute");
            return { Component: m.VehicleListPage, loader: m.createVehicleListLoader(api.vehicles) };
          },
        },
        {
          path: "vehicles/:vehicleId",
          lazy: async () => {
            const m = await import("../features/vehicles/routes/vehicleDetailRoute");
            return { Component: m.VehicleDetailLayout, loader: m.createVehicleDetailLoader(api.vehicles) };
          },
          children: [
            {
              index: true,
              lazy: async () => ({
                Component: (await import("../features/vehicles/routes/vehicleSummaryRoute")).VehicleSummaryTab,
              }),
            },
            {
              path: "transactions",
              lazy: async () => {
                const m = await import("../features/vehicles/routes/vehicleTransactionsRoute");
                return { Component: m.VehicleTransactionsTab, loader: m.createTransactionsLoader(api.vehicles) };
              },
            },
          ],
        },
        // drivers, settings similarly
        { path: "*", Component: NotFoundPage },
          ],
        },
      ],
    },
  ];
}
