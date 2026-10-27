// use-resource.ts
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { fetchJson, HttpError } from './fetch-json';

export type ResourceState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; kind: 'offline' | 'not-found' | 'http' | 'parse'; error: Error };

type Action<T> =
  | { type: 'start' }
  | { type: 'resolve'; data: T }
  | { type: 'reject'; error: Error };

function classify(error: Error): Extract<ResourceState<never>, { status: 'error' }>['kind'] {
  if (error instanceof HttpError) return error.status === 404 ? 'not-found' : 'http';
  if (error instanceof TypeError) return 'offline'; // fetch network failures are TypeError
  return 'parse';
}

function reducer<T>(_: ResourceState<T>, action: Action<T>): ResourceState<T> {
  switch (action.type) {
    case 'start': return { status: 'loading' };
    case 'resolve': return { status: 'success', data: action.data };
    case 'reject': return { status: 'error', kind: classify(action.error), error: action.error };
  }
}

export function useResource<T>(url: string, parse: (raw: unknown) => T) {
  const [state, dispatch] = useReducer(
    reducer as (s: ResourceState<T>, a: Action<T>) => ResourceState<T>,
    { status: 'loading' } as ResourceState<T>,
  );
  const [attempt, bump] = useReducer((n: number) => n + 1, 0);

  const parseRef = useRef(parse);
  useEffect(() => { parseRef.current = parse; });   // latest parser, no dependency churn

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: 'start' });
    fetchJson(url, controller.signal)
      .then((raw) => dispatch({ type: 'resolve', data: parseRef.current(raw) }))
      .catch((e: unknown) => {
        if (controller.signal.aborted) return;
        dispatch({ type: 'reject', error: e instanceof Error ? e : new Error(String(e)) });
      });
    return () => controller.abort();
  }, [url, attempt]);

  const refetch = useCallback(() => bump(), []);
  return { state, refetch };
}
export {};
