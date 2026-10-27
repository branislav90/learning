export interface DomainEvents {
  "card.blocked": { cardId: string; reason: "lost" | "stolen" | "fraud"; at: string };
  "vehicle.assigned": { vehicleId: string; driverId: string; at: string };
}
export type EventName = keyof DomainEvents;
export {};
