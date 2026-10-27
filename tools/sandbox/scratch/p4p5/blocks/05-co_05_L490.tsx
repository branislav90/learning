// accordion.tsx — excerpt
import { createContext, use, useMemo, useReducer, type ReactNode } from "react";

type State = { open: ReadonlySet<string> };
type Action = { type: "toggle"; id: string } | { type: "set"; id: string; open: boolean };

function reducer(state: State, action: Action): State {
  const open = new Set(state.open);
  if (action.type === "toggle") {
    open.has(action.id) ? open.delete(action.id) : open.add(action.id);
  } else {
    action.open ? open.add(action.id) : open.delete(action.id);
  }
  return { open };
}

const StateContext = createContext<State | null>(null);
const DispatchContext = createContext<React.Dispatch<Action> | null>(null);
const ItemContext = createContext<string | null>(null);

export function Accordion({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { open: new Set<string>() });
  return (
    <DispatchContext value={dispatch}>
      <StateContext value={state}>{children}</StateContext>
    </DispatchContext>
  );
}

export function AccordionItem({ id, children }: { id: string; children: ReactNode }) {
  return <ItemContext value={id}>{children}</ItemContext>;
}

function useItem() {
  const id = use(ItemContext);
  if (id === null) throw new Error("Accordion parts must be inside <AccordionItem>.");
  return id;
}

export function AccordionTrigger({ children }: { children: ReactNode }) {
  const id = useItem();
  const state = use(StateContext)!;
  const dispatch = use(DispatchContext)!;
  const open = state.open.has(id);
  return (
    <button type="button" aria-expanded={open} onClick={() => dispatch({ type: "toggle", id })}>
      {children}
    </button>
  );
}
export {};
