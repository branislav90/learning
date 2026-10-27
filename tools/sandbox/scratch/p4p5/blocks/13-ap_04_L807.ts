type Section<T> = { kind: "ok"; data: T } | { kind: "failed"; retryable: boolean };
export function makeLoadDashboard(d: { a: AGateway; b: BGateway; c: CGateway }) {
  return async function loadDashboard(signal?: AbortSignal) {
    const wrap = async <T,>(p: Promise<T>): Promise<Section<T>> => {
      try { return { kind: "ok", data: await p }; }
      catch (e) { if (signal?.aborted) throw e; return { kind: "failed", retryable: true }; }
    };
    const [a, b, c] = await Promise.all([wrap(d.a.get(signal)), wrap(d.b.get(signal)), wrap(d.c.get(signal))]);
    return { sections: { a, b, c } };
  };
}
export {};
