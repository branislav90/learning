// state/selection.tsx
import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";

type State = { readonly ids: ReadonlySet<string> };
type Action =
  | { type: "toggle"; id: string }
  | { type: "selectMany"; ids: readonly string[] }
  | { type: "clear" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "toggle": {
      const next = new Set(state.ids);
      if (next.has(action.id)) next.delete(action.id); else next.add(action.id);
      return { ids: next };
    }
    case "selectMany":
      return { ids: new Set(action.ids) };
    case "clear":
      return state.ids.size === 0 ? state : { ids: new Set() };
  }
}

// Two contexts: reads change often, commands never change identity.
const SelectionStateContext = createContext<State | null>(null);
const SelectionCommandsContext = createContext<{
  toggle(id: string): void;
  selectMany(ids: readonly string[]): void;
  clear(): void;
} | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { ids: new Set<string>() });
  const commands = useMemo(
    () => ({
      toggle: (id: string) => dispatch({ type: "toggle", id }),
      selectMany: (ids: readonly string[]) => dispatch({ type: "selectMany", ids }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [], // dispatch is stable
  );
  return (
    <SelectionCommandsContext value={commands}>
      <SelectionStateContext value={state}>{children}</SelectionStateContext>
    </SelectionCommandsContext>
  );
}

export function useIsSelected(id: string): boolean {
  const s = useContext(SelectionStateContext);
  if (!s) throw new Error("useIsSelected outside SelectionProvider");
  return s.ids.has(id);
}
export function useSelectedIds(): ReadonlySet<string> {
  const s = useContext(SelectionStateContext);
  if (!s) throw new Error("useSelectedIds outside SelectionProvider");
  return s.ids;
}
export function useSelectionCommands() {
  const c = useContext(SelectionCommandsContext);
  if (!c) throw new Error("useSelectionCommands outside SelectionProvider");
  return c;
}
export {};
