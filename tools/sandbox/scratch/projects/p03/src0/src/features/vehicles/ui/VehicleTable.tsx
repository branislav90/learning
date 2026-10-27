import { Link } from "react-router";
import type { Vehicle } from "../model/vehicle";
export function VehicleTable({ vehicles }: { vehicles: readonly Vehicle[]; sort: { key: string; dir: string } }) {
  return <table><tbody>{vehicles.map((v) => <tr key={v.id}><td><Link to={`/vehicles/${v.id}`}>{v.registration}</Link></td><td>{v.status}</td></tr>)}</tbody></table>;
}
