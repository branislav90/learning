import { createBrowserRouter } from "react-router";
import { cardsRoutes } from "@acme/feature-cards/routes";
import { fleetRoutes } from "@acme/feature-fleet/routes";
import { billingRoutes } from "@acme/feature-billing/routes";
import { AppLayout } from "./AppLayout";

export const router = createBrowserRouter([
  { path: "/", element: <AppLayout />, children: [...cardsRoutes, ...fleetRoutes, ...billingRoutes] },
]);
export {};
