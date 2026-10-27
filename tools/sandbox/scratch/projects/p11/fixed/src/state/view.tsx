import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react';
import type { Priority, SortKey, Status } from '../types';

export interface View {
  query: string;
  status: Status | 'all';
  priority: Priority | 'all';
  sortKey: SortKey;
  selectedId: number | null;
  liveEnabled: boolean;
  theme: 'light' | 'dark';
}

const initialView: View = {
  query: '', status: 'all', priority: 'all', sortKey: 'createdAt',
  selectedId: null, liveEnabled: false, theme: 'light',
};

const reducer = (state: View, patch: Partial<View>): View => ({ ...state, ...patch });

const ViewCtx = createContext<View | null>(null);
const SetViewCtx = createContext<Dispatch<Partial<View>> | null>(null);

export function useView(): View {
  const v = useContext(ViewCtx);
  if (!v) throw new Error('ViewProvider missing');
  return v;
}
export function useSetView(): Dispatch<Partial<View>> {
  const v = useContext(SetViewCtx);
  if (!v) throw new Error('ViewProvider missing');
  return v;
}

export function ViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useReducer(reducer, initialView);

  useEffect(() => {
    document.documentElement.dataset.theme = view.theme; // synchronizing with an external system (the DOM outside React)
  }, [view.theme]);

  return (
    <SetViewCtx value={setView}>
      <ViewCtx value={view}>{children}</ViewCtx>
    </SetViewCtx>
  );
}
