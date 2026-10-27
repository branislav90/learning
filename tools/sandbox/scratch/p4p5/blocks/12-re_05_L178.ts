// counter.ts
export type CounterState = { count: number };
export type CounterAction =
  | { type: "incremented" }
  | { type: "decremented" }
  | { type: "reset" };

function assertNever(x: never): never {
  throw new Error(`Unhandled action: ${JSON.stringify(x)}`);
}

export function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case "incremented": return { count: state.count + 1 };
    case "decremented": return { count: state.count - 1 };
    case "reset":       return { count: 0 };
    default:            return assertNever(action);
  }
}
export {};
