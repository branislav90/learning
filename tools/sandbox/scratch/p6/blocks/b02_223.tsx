// use-search.ts
import { useEffect, useState } from 'react';
import { fetchJson } from './fetch-json'; // from lesson 01 §5.1; accepts an AbortSignal

export type SearchState =
  | { status: 'idle' }
  | { status: 'loading'; query: string }
  | { status: 'success'; query: string; results: Product[] }
  | { status: 'error'; query: string; error: Error };

export function useSearch(query: string): SearchState {
  const [state, setState] = useState<SearchState>({ status: 'idle' });

  useEffect(() => {
    if (query.trim() === '') {
      setState({ status: 'idle' });
      return;
    }
    const controller = new AbortController();
    setState({ status: 'loading', query });

    fetchJson(`/api/search?q=${encodeURIComponent(query)}`, controller.signal)
      .then((raw) => parseProducts(raw))
      .then((results) => {
        if (controller.signal.aborted) return;       // belt and braces
        setState({ status: 'success', query, results });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;       // our own cancellation: not an error
        setState({
          status: 'error',
          query,
          error: err instanceof Error ? err : new Error(String(err)),
        });
      });

    return () => controller.abort();
  }, [query]);

  return state;
}
export {};
