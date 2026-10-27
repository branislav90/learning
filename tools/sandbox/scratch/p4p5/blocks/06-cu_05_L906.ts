type History<T> = { past: T[]; present: T; future: T[] };
type Action<T> = { type: "set"; value: T } | { type: "undo" } | { type: "redo" };

function reducer<T>(h: History<T>, a: Action<T>): History<T> {
  switch (a.type) {
    case "set": return { past: [...h.past, h.present], present: a.value, future: [] };
    case "undo": return h.past.length === 0 ? h : { past: h.past.slice(0, -1), present: h.past[h.past.length - 1], future: [h.present, ...h.future] };
    case "redo": return h.future.length === 0 ? h : { past: [...h.past, h.present], present: h.future[0], future: h.future.slice(1) };
  }
}

export function useUndoableState<T>(initial: T) {
  const [h, dispatch] = useReducer(reducer<T>, { past: [], present: initial, future: [] });
  return {
    state: h.present,
    set: (value: T) => dispatch({ type: "set", value }),
    undo: () => dispatch({ type: "undo" }),
    redo: () => dispatch({ type: "redo" }),
    canUndo: h.past.length > 0,
    canRedo: h.future.length > 0,
  };
}
export {};
