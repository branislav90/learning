// users/useUsers.ts — async state; knows nothing about filtering or markup
import { useEffect, useState } from "react";
import { fetchUsers, type User } from "./api";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; users: User[] };

export function useUsers(load: typeof fetchUsers = fetchUsers): State {
  const [state, setState] = useState<State>({ status: "loading" });
  useEffect(() => {
    const ctrl = new AbortController();
    setState({ status: "loading" });
    load(ctrl.signal).then(
      (users) => setState({ status: "ready", users }),
      (e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setState({ status: "error", message: e instanceof Error ? e.message : "Unknown error" });
      },
    );
    return () => ctrl.abort();
  }, [load]);
  return state;
}
export {};
