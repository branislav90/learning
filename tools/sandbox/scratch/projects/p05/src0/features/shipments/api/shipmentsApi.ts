import type { Shipment, ShipmentPage } from "./types";
import type { ShipmentFilters } from "../model/filters";
export const DB: Shipment[] = Array.from({ length: 5000 }, (_, i) => ({ id: `s${i}`, reference: `REF${i}`, customer: `C${i % 50}`, status: "pending", price: i }));
export const shipmentsApi = {
  calls: [] as unknown[],
  async list(p: Omit<ShipmentFilters, "open"> & { cursor: string | null; limit: number }, _signal?: AbortSignal): Promise<ShipmentPage> {
    shipmentsApi.calls.push(p);
    const start = p.cursor ? Number(p.cursor) : 0;
    const items = DB.slice(start, start + p.limit);
    return { items, nextCursor: start + p.limit < DB.length ? String(start + p.limit) : null, total: DB.length };
  },
  async get(id: string, _signal?: AbortSignal): Promise<Shipment> { return DB.find((s) => s.id === id)!; },
  async bulkAssign(_ids: string[], _a: string): Promise<void> { throw new Error("conflict"); },
};
