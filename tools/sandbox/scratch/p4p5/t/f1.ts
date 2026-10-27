type Handlers<S extends { status: string }, E extends { type: string }> = {
  [K in S['status']]: (state: Extract<S, { status: K }>, event: E) => S | undefined;
};

export function createMachine<S extends { status: string }, E extends { type: string }>(
  handlers: Handlers<S, E>,
) {
  return (state: S, event: E): S => {
    const handler = handlers[state.status as S['status']] as (s: S, e: E) => S | undefined;
    return handler(state, event) ?? state;   // undefined => ignored => same reference
  };
}
export {};
