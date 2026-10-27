// src/app/api.ts
import type { VehicleApi } from "../features/vehicles";
import type { DriverApi } from "../features/drivers";
import type { OverviewApi } from "../features/overview";

export interface FleetApi {
  vehicles: VehicleApi;
  drivers: DriverApi;
  overview: OverviewApi;
}
