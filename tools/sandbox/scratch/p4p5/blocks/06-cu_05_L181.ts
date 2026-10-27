// use-json-resource.ts
import { useEffect, useState } from "react";

export type Resource<T> =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

export function useJsonResource<T>(url: string | null): Resource<T> {
  const [state, setState] = useState<Resource<T>>({ status: "idle" });

  useEffect(() => {
    if (url === null) {
      setState({ status: "idle" });
      return;
    }
    const controller = new AbortController();
    setState({ status: "pending" });

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<T>;
      })
      .then((data) => setState({ status: "success", data }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;       // ignore our own cancellation
        setState({ status: "error", error: err instanceof Error ? err : new Error(String(err)) });
      });

    return () => controller.abort();                // url changed or unmounted
  }, [url]);

  return state;
}
export {};
