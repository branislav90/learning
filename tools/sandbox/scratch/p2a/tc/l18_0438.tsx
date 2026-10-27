import { useEffect, useState } from "react";

interface User { id: string; name: string }
type State = { status: "loading" } | { status: "ok"; user: User } | { status: "error"; error: unknown };

function UserCard({ userId }: { userId: string }) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });
    fetch(`/api/users/${encodeURIComponent(userId)}`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<User>;
      })
      .then((user) => setState({ status: "ok", user }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return; // expected on cleanup
        setState({ status: "error", error });
      });
    return () => controller.abort();            // cancels the in-flight request for THIS userId
  }, [userId]);

  if (state.status === "loading") return <p>Loading…</p>;
  if (state.status === "error") return <p role="alert">Failed to load user.</p>;
  return <p>{state.user.name}</p>;
}
export {};
