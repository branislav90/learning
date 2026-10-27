import type { VehicleApi } from "../api/vehicleApi";
export function createTransactionsLoader(_api: VehicleApi) { return async () => []; }
export function VehicleTransactionsTab() { return <p>Transactions</p>; }
