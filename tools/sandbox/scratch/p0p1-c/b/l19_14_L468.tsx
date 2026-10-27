export {};
import { useEffect, useReducer } from "react";

interface User { id: number; name: string }

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; users: User[] }
  | { status: "error"; message: string };

type Action =
  | { type: "fetch" }
  | { type: "resolve"; users: User[] }
  | { type: "reject"; message: string };

function assertNever(x: never): never {
  throw new Error(`Unexpected: ${JSON.stringify(x)}`);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "fetch":   return { status: "loading" };
    case "resolve": return { status: "success", users: action.users };
    case "reject":  return { status: "error", message: action.message };
    default:        return assertNever(action);
  }
}

export function UserList() {
  const [state, dispatch] = useReducer(reducer, { status: "idle" });   // State and Action inferred from reducer

  useEffect(() => {
    const ac = new AbortController();
    dispatch({ type: "fetch" });
    fetch("/api/users", { signal: ac.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<User[]>;          // ⚠ unvalidated: see Lesson 18 for validation at the boundary
      })
      .then((users) => dispatch({ type: "resolve", users }))
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return;   // cleanup abort: ignore
        dispatch({ type: "reject", message: e instanceof Error ? e.message : "Unknown error" });
      });
    return () => ac.abort();
  }, []);

  switch (state.status) {
    case "idle":
    case "loading": return <p>Loading…</p>;
    case "error":   return <p role="alert">{state.message}</p>;
    case "success": return <ul>{state.users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>;
    default:        return assertNever(state);
  }
}
