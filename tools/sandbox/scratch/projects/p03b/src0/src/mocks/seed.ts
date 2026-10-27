import type { VehicleDto } from "../features/vehicles/api/vehicleDto";
const statuses = ["active", "maintenance", "offline", "weird"];
export const vehicles: VehicleDto[] = Array.from({ length: 45 }, (_, i) => ({
  id: `v${i + 1}`, registration_number: `AB${String(i + 1).padStart(3, "0")}`, status: statuses[i % 4]!, odometer_km: i % 5 === 0 ? null : i * 1000,
  last_seen_at: i % 7 === 0 ? "garbage" : "2026-01-01T00:00:00Z", driver_id: null,
}));
