// src/features/vehicles/model/listQuery.ts
import type { VehicleStatus } from "./vehicle";

export const SORT_KEYS = ["registration", "odometer", "lastSeen"] as const;
export type SortKey = (typeof SORT_KEYS)[number];
export type SortDir = "asc" | "desc";
export type StatusFilter = Exclude<VehicleStatus, "unknown"> | "all";

export interface VehicleListQuery {
  q: string;
  status: StatusFilter;
  sort: SortKey;
  dir: SortDir;
  page: number;
}

export const DEFAULT_QUERY: VehicleListQuery = {
  q: "",
  status: "all",
  sort: "registration",
  dir: "asc",
  page: 1,
};

const STATUSES: readonly StatusFilter[] = ["all", "active", "maintenance", "offline"];
const MAX_Q = 100;

function pick<T extends string>(value: string | null, allowed: readonly T[], fallback: T): T {
  return allowed.find((a) => a === value) ?? fallback;
}

export function parseVehicleListQuery(params: URLSearchParams): VehicleListQuery {
  const rawPage = Number.parseInt(params.get("page") ?? "", 10);
  return {
    q: (params.get("q") ?? "").slice(0, MAX_Q).trim(),
    status: pick(params.get("status"), STATUSES, DEFAULT_QUERY.status),
    sort: pick(params.get("sort"), SORT_KEYS, DEFAULT_QUERY.sort),
    dir: pick(params.get("dir"), ["asc", "desc"] as const, DEFAULT_QUERY.dir),
    page: Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1,
  };
}

/** Inverse of parse; omits defaults so URLs stay short and canonical. */
export function toSearchParams(query: VehicleListQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.q !== "") params.set("q", query.q);
  if (query.status !== DEFAULT_QUERY.status) params.set("status", query.status);
  if (query.sort !== DEFAULT_QUERY.sort) params.set("sort", query.sort);
  if (query.dir !== DEFAULT_QUERY.dir) params.set("dir", query.dir);
  if (query.page !== DEFAULT_QUERY.page) params.set("page", String(query.page));
  return params;
}
