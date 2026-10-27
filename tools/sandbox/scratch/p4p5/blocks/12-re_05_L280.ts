type Action =
  | { type: "SET_ITEMS"; items: Item[] }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "SET_PAGE"; page: number };

// components must dispatch four actions in the right order to express "page loaded"
dispatch({ type: "SET_LOADING", loading: false });
dispatch({ type: "SET_ITEMS", items: [...state.items, ...page.items] });  // reads state in the component: stale-prone
dispatch({ type: "SET_PAGE", page: state.page + 1 });
export {};
