// src/features/vehicles/ui/VehicleFilters.tsx
import { useState } from "react";
import { useSearchParams } from "react-router";
import { toSearchParams, type StatusFilter, type VehicleListQuery } from "../model/listQuery";

const STATUS_OPTIONS: readonly { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "maintenance", label: "In maintenance" },
  { value: "offline", label: "Offline" },
];

export function VehicleFilters({ query }: { query: VehicleListQuery }) {
  const [, setSearchParams] = useSearchParams();
  // Draft keeps the input responsive between URL commits. Initialized from the URL;
  // re-synchronized by remounting via `key` on the parent (see below), not by an effect.
  const [draft, setDraft] = useState(query.q);

  function commit(next: Partial<VehicleListQuery>, { replace }: { replace: boolean }) {
    setSearchParams(toSearchParams({ ...query, page: 1, ...next }), { replace });
  }

  return (
    <form role="search" onSubmit={(e) => e.preventDefault()}>
      <label>
        Search
        <input
          type="search"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            commit({ q: e.target.value.trim() }, { replace: true }); // F5: no history spam
          }}
        />
      </label>
      <label>
        Status
        <select
          value={query.status}
          onChange={(e) => commit({ status: e.target.value as StatusFilter }, { replace: false })}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>
    </form>
  );
}
