import { useOutletContext } from "react-router";
import type { Vehicle } from "../model/vehicle";
export function VehicleSummaryTab() { const v = useOutletContext<Vehicle>(); return <p>Summary {v.registration}</p>; }
