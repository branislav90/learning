type Reducer<S, A> = (s: S, a: A) => S;
interface ReducerCell<S, A> { value: S; queue: A[]; dispatch: (a: A) => void; reducer: Reducer<S, A> }

export function useReducer<S, A>(reducer: Reducer<S, A>, initial: S): [S, (a: A) => void] {
  const i = inst();
  const hook = i.nextHook();
  if (i.isMount) {
    const cell: ReducerCell<S, A> = {
      value: initial, queue: [], reducer,
      dispatch: (a) => { cell.queue.push(a); i.dirty = true; },
    };
    hook.state = cell;
  }
  const cell = hook.state as ReducerCell<S, A>;
  cell.reducer = reducer;                                  // latest reducer wins
  for (const a of cell.queue) cell.value = cell.reducer(cell.value, a);
  cell.queue = [];
  return [cell.value, cell.dispatch];
}

export function useCallback<T extends (...a: never[]) => unknown>(fn: T, deps: readonly unknown[]): T {
  return useMemo(() => fn, deps);
}

export function useStateViaReducer<S>(initial: S): [S, (a: S | ((p: S) => S)) => void] {
  return useReducer<S, S | ((p: S) => S)>(
    (s, a) => (typeof a === "function" ? (a as (p: S) => S)(s) : a),
    initial,
  );
}
