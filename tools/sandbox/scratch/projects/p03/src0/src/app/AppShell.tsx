import { useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router";
export function AppShell() {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => { mainRef.current?.querySelector<HTMLElement>("h1")?.focus(); }, [location.pathname]);
  return (<div><nav aria-label="Main"><Link to="/">Overview</Link> <Link to="/vehicles">Vehicles</Link></nav><main ref={mainRef}><Outlet /></main></div>);
}
