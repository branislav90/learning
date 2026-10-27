type State =
  | { status: "loading" }
  | { status: "success"; data: Data }
  | { status: "error"; error: unknown };

export function useDashboard(userId: string): State {
  const [state, setState] = useState<State>({ status: "loading" });
  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });
    fetch(`/api/dashboard/${userId}`, { signal: controller.signal })
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json() as Promise<Data>; })
      .then((data) => setState({ status: "success", data }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({ status: "error", error });
      });
    return () => controller.abort();
  }, [userId]);
  return state;
}
