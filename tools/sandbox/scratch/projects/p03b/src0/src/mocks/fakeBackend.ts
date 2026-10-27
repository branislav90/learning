// src/mocks/fakeBackend.ts
import type { HttpClient, RequestOptions } from "../shared/http/httpClient";
import { HttpError } from "../shared/http/httpError";
import { vehicles as seedVehicles } from "./seed";
import type { PageDto, VehicleDto } from "../features/vehicles/api/vehicleDto"; // mocks MAY import DTOs

export interface FakeBackendOptions {
  latencyMs?: number;
  /** return a status code to simulate failure for a given path, else undefined */
  failure?: (path: string) => number | "network" | undefined;
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new HttpError("aborted", "Request aborted"));
    const id = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(id);
      reject(new HttpError("aborted", "Request aborted"));
    }, { once: true });
  });
}

export function createFakeBackend({ latencyMs = 250, failure }: FakeBackendOptions = {}): HttpClient {
  return {
    async get<T>(path: string, { params = {}, signal }: RequestOptions = {}): Promise<T> {
      await sleep(latencyMs, signal);
      const fail = failure?.(path);
      if (fail === "network") throw new HttpError("network", "Network error");
      if (typeof fail === "number") throw new HttpError(fail >= 500 ? "server" : "client", `HTTP ${fail}`, fail);

      if (path === "/vehicles") return listVehicles(params) as T;
      const match = /^\/vehicles\/([^/]+)$/.exec(path);
      if (match) {
        const found = seedVehicles.find((v) => v.id === decodeURIComponent(match[1]!));
        if (!found) throw new HttpError("not-found", "HTTP 404", 404);
        return found as T;
      }
      throw new HttpError("not-found", "HTTP 404", 404);
    },
  };
}

function listVehicles(params: NonNullable<RequestOptions["params"]>): PageDto<VehicleDto> {
  const q = String(params.q ?? "").toLowerCase();
  const status = params.status === undefined ? null : String(params.status);
  const pageSize = Number(params.page_size ?? 20);
  const page = Math.max(1, Number(params.page ?? 1));
  let rows = seedVehicles.filter(
    (v) => (q === "" || v.registration_number.toLowerCase().includes(q)) && (status === null || v.status === status),
  );
  // sorting by params.sort / params.dir omitted for brevity: implement it
  const total = rows.length;
  rows = rows.slice((page - 1) * pageSize, page * pageSize);
  return { items: rows, total, page, page_size: pageSize };
}
