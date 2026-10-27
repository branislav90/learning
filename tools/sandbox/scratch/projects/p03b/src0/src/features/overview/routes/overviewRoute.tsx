import { useLoaderData } from "react-router";
import type { OverviewApi } from "../index";
export function createOverviewLoader(api: OverviewApi) { return () => api.get(); }
export function OverviewPage() { const d = useLoaderData() as { total: number }; return <h1 tabIndex={-1}>Overview {d.total}</h1>; }
