type Handlers<S, A extends { type: string }> = {
  [K in A["type"]]: (state: S, action: Extract<A, { type: K }>) => S;
};

export function createReducer<S, A extends { type: string }>(handlers: Handlers<S, A>) {
  return (state: S, action: A): S => {
    const handler = handlers[action.type as A["type"]] as (s: S, a: A) => S;
    return handler(state, action);
  };
}

const reducer = createReducer<CounterState, CounterAction>({
  incremented: (s) => ({ count: s.count + 1 }),
  decremented: (s) => ({ count: s.count - 1 }),
  reset: () => ({ count: 0 }),
});
export {};
