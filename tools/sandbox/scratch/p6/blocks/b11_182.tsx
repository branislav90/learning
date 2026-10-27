import { createContext, use, useMemo, useReducer, type Dispatch, type ReactNode } from 'react';

interface Filters { range: '7d' | '30d'; region: string }
type Action = { type: 'range'; value: Filters['range'] } | { type: 'region'; value: string };

const FiltersCtx = createContext<Filters | null>(null);
const FiltersDispatchCtx = createContext<Dispatch<Action> | null>(null);

function reducer(s: Filters, a: Action): Filters {
  switch (a.type) {
    case 'range': return { ...s, range: a.value };
    case 'region': return { ...s, region: a.value };
  }
}

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { range: '7d', region: 'EU' });
  return (
    <FiltersCtx value={state}>
      <FiltersDispatchCtx value={dispatch}>{children}</FiltersDispatchCtx>
    </FiltersCtx>
  );
}

export function useFilters(): Filters {
  const v = use(FiltersCtx);
  if (v === null) throw new Error('useFilters must be used within FiltersProvider');
  return v;
}
export function useFiltersDispatch(): Dispatch<Action> {
  const v = use(FiltersDispatchCtx);
  if (v === null) throw new Error('useFiltersDispatch must be used within FiltersProvider');
  return v;
}
export {};
