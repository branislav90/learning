type State = { items: readonly Post[]; page: number; status: "idle" | "loading" | "error"; error: string | null; hasMore: boolean };
type Action =
  | { type: "loadStarted" }
  | { type: "pageLoaded"; posts: readonly Post[]; hasMore: boolean }
  | { type: "loadFailed"; message: string };

function feedReducer(s: State, a: Action): State {
  switch (a.type) {
    case "loadStarted": return s.status === "loading" || !s.hasMore ? s : { ...s, status: "loading", error: null };
    case "pageLoaded":  return s.status !== "loading" ? s : { ...s, status: "idle", items: [...s.items, ...a.posts], page: s.page + 1, hasMore: a.hasMore };
    case "loadFailed":  return s.status !== "loading" ? s : { ...s, status: "error", error: a.message };
    default: return assertNever(a);
  }
}
export {};
