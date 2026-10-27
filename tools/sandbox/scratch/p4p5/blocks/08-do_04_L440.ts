// contexts/fleet/domain/fleet-driver.ts
export interface FleetDriver { readonly id: DriverId; readonly name: string; readonly licenceClass: string; readonly vehicleIds: readonly VehicleId[]; }

// contexts/cards/domain/card-holder.ts
export interface CardHolder { readonly driverId: DriverId; readonly displayName: string; readonly limit: Money; readonly pinStatus: "set" | "locked" | "unset"; }

// contexts/compliance/domain/working-time.ts
export interface DriverWorkingTime { readonly driverId: DriverId; readonly restPeriods: readonly RestPeriod[]; }
export {};
