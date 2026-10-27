type Action =
  | { type: "loadStarted" }
  | { type: "pageLoaded"; items: readonly Item[]; hasMore: boolean }
  | { type: "loadFailed"; message: string };

function reducer(state: ListState, action: Action): ListState {
  switch (action.type) {
    case "loadStarted":
      return state.status === "loading" ? state : { ...state, status: "loading", error: null };
    case "pageLoaded":
      return { ...state, status: "idle", items: [...state.items, ...action.items], page: state.page + 1, hasMore: action.hasMore };
    case "loadFailed":
      return { ...state, status: "error", error: action.message };
    default:
      return assertNever(action);
  }
}
export {};
