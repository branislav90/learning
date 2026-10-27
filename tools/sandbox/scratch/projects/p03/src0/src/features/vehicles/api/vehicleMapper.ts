// src/features/vehicles/api/vehicleMapper.ts
import type { Page, Vehicle, VehicleStatus } from "../model/vehicle";
import type { PageDto, VehicleDto } from "./vehicleDto";

const KNOWN: ReadonlySet<string> = new Set<VehicleStatus>(["active", "maintenance", "offline"]);

function toStatus(raw: string): VehicleStatus {
  return KNOWN.has(raw) ? (raw as VehicleStatus) : "unknown";
}

function toDate(raw: string | null): Date | null {
  if (raw === null) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d; // bad data degrades, doesn't crash
}

export function toVehicle(dto: VehicleDto): Vehicle {
  return {
    id: dto.id,
    registration: dto.registration_number,
    status: toStatus(dto.status),
    odometerKm: dto.odometer_km,
    lastSeenAt: toDate(dto.last_seen_at),
    driverId: dto.driver_id,
  };
}

export function toVehiclePage(dto: PageDto<VehicleDto>): Page<Vehicle> {
  return {
    items: dto.items.map(toVehicle),
    total: dto.total,
    page: dto.page,
    pageSize: dto.page_size,
    pageCount: Math.max(1, Math.ceil(dto.total / dto.page_size)),
  };
}
