// src/features/vehicles/api/vehicleDto.ts  (wire format; never exported from the feature)
export interface VehicleDto {
  id: string;
  registration_number: string;
  status: string; // backend may add values; we cannot trust the union
  odometer_km: number | null;
  last_seen_at: string | null; // ISO 8601
  driver_id: string | null;
}

export interface PageDto<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}
