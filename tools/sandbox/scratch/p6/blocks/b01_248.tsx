// use-fetch.ts
import { useEffect, useState } from 'react';
import { fetchJson } from './fetch-json';

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

type Parser<T> = (raw: unknown) => T; // throws on invalid input

export function useFetch<T>(url: string, parse: Parser<T>): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });

    fetchJson(url, controller.signal)
      .then((raw) => {
        setState({ status: 'success', data: parse(raw) });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return; // intentional cancel: not an error
        setState({
          status: 'error',
          error: err instanceof Error ? err : new Error(String(err)),
        });
      });

    return () => controller.abort();
  }, [url, parse]);

  return state;
}
export {};
