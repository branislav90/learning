// src/features/vehicles/api/vehicleApi.ts
import type { HttpClient } from "../../../shared/http/httpClient";
import type { Page, Vehicle } from "../model/vehicle";
import type { VehicleListQuery } from "../model/listQuery";
import { toVehicle, toVehiclePage } from "./vehicleMapper";
import type { PageDto, VehicleDto } from "./vehicleDto";

export interface VehicleApi {
  list(query: VehicleListQuery, signal?: AbortSignal): Promise<Page<Vehicle>>;
  get(id: string, signal?: AbortSignal): Promise<Vehicle>;
}

export function createVehicleApi(http: HttpClient): VehicleApi {
  return {
    async list(query, signal) {
      const dto = await http.get<PageDto<VehicleDto>>("/vehicles", {
        signal,
        params: {
          q: query.q || undefined,
          status: query.status === "all" ? undefined : query.status,
          sort: query.sort,
          dir: query.dir,
          page: query.page,
          page_size: 20,
        },
      });
      return toVehiclePage(dto);
    },
    async get(id, signal) {
      return toVehicle(await http.get<VehicleDto>(`/vehicles/${encodeURIComponent(id)}`, { signal }));
    },
  };
}
