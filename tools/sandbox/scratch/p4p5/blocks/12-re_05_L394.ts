export type History<S> = { past: readonly S[]; present: S; future: readonly S[] };
type HistoryControl = { type: "history/undone" } | { type: "history/redone" };

export function withHistory<S, A extends { type: string }>(reducer: (s: S, a: A) => S) {
  return (h: History<S>, a: A | HistoryControl): History<S> => {
    if (a.type === "history/undone") {
      if (h.past.length === 0) return h;
      return { past: h.past.slice(0, -1), present: h.past[h.past.length - 1], future: [h.present, ...h.future] };
    }
    if (a.type === "history/redone") {
      if (h.future.length === 0) return h;
      return { past: [...h.past, h.present], present: h.future[0], future: h.future.slice(1) };
    }
    const next = reducer(h.present, a as A);          // narrowing across a generic union needs a cast
    if (Object.is(next, h.present)) return h;          // no-op actions don't create history entries
    return { past: [...h.past, h.present], present: next, future: [] };
  };
}

// usage
const editorReducerWithHistory = withHistory(editorReducer);
const [h, dispatch] = useReducer(editorReducerWithHistory, { past: [], present: initialDoc, future: [] });
export {};
