import { createContext, useContext, useRef, useSyncExternalStore, type ReactNode } from "react";

type Listener = () => void;

function createStore<S>(initial: S) {
  let state = initial;
  const listeners = new Set<Listener>();
  return {
    getState: () => state,
    setState(next: (s: S) => S) {
      const n = next(state);
      if (Object.is(n, state)) return;
      state = n;
      listeners.forEach((l) => l());
    },
    subscribe(l: Listener) {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}
type Store<S> = ReturnType<typeof createStore<S>>;

type EditorState = { text: string; cursor: number; dirty: boolean };
const EditorStoreContext = createContext<Store<EditorState> | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const ref = useRef<Store<EditorState> | null>(null);
  if (ref.current === null) {
    ref.current = createStore<EditorState>({ text: "", cursor: 0, dirty: false });
  }
  return <EditorStoreContext value={ref.current}>{children}</EditorStoreContext>;
}

export function useEditorStore() {
  const s = useContext(EditorStoreContext);
  if (!s) throw new Error("useEditorStore requires <EditorProvider>");
  return s;
}

export function useEditorSelector<T>(select: (s: EditorState) => T): T {
  const store = useEditorStore();
  return useSyncExternalStore(store.subscribe, () => select(store.getState()));
}
export {};
