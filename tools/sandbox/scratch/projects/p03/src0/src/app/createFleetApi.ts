import type { HttpClient } from "../shared/http/httpClient";
import { createVehicleApi } from "../features/vehicles/api/vehicleApi";
import { createFakeBackend } from "../mocks/fakeBackend";
import type { FleetApi } from "./api";
export function createFleetApiFromHttp(http: HttpClient): FleetApi {
  return { vehicles: createVehicleApi(http), drivers: { list: async () => [] }, overview: { get: async () => ({ total: 45 }) } };
}
export function createFleetApi(): FleetApi { return createFleetApiFromHttp(createFakeBackend()); }
