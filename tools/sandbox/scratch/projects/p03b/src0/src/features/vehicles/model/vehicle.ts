// src/features/vehicles/model/vehicle.ts  (domain; what the UI sees)
export type VehicleStatus = "active" | "maintenance" | "offline" | "unknown";

export interface Vehicle {
  readonly id: string;
  readonly registration: string;
  readonly status: VehicleStatus;
  readonly odometerKm: number | null;
  readonly lastSeenAt: Date | null;
  readonly driverId: string | null;
}

export interface Page<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly pageCount: number;
}
