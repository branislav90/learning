import { useEffect, useState } from "react";
import { BUILD_ID } from "@/shared/config/build";

export function useNewVersionAvailable(intervalMs = 5 * 60_000) {
  const [stale, setStale] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const res = await fetch("/version.json", { cache: "no-store" });
        if (!res.ok) return;
        const { buildId } = (await res.json()) as { buildId: string };
        if (!cancelled && buildId !== BUILD_ID) setStale(true);
      } catch { /* offline or transient: ignore */ }
    }
    const id = window.setInterval(check, intervalMs);
    const onVisible = () => document.visibilityState === "visible" && check();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [intervalMs]);

  return stale;
}
