type State =
  | { s: 'idle' }
  | { s: 'submitting'; attempt: number }
  | { s: 'waiting'; attempt: number; error: string }
  | { s: 'failed'; error: string }
  | { s: 'succeeded' };
type Event =
  | { t: 'SUBMIT' } | { t: 'OK' } | { t: 'FAIL'; error: string; transient: boolean }
  | { t: 'RETRY_TIMER' } | { t: 'RESET' };

const MAX_ATTEMPTS = 3;

export function reduce(state: State, e: Event): State {
  switch (state.s) {
    case 'idle': return e.t === 'SUBMIT' ? { s: 'submitting', attempt: 1 } : state;
    case 'submitting':
      if (e.t === 'OK') return { s: 'succeeded' };
      if (e.t === 'FAIL') {
        return e.transient && state.attempt < MAX_ATTEMPTS
          ? { s: 'waiting', attempt: state.attempt, error: e.error }
          : { s: 'failed', error: e.error };
      }
      return state;
    case 'waiting': return e.t === 'RETRY_TIMER' ? { s: 'submitting', attempt: state.attempt + 1 } : e.t === 'RESET' ? { s: 'idle' } : state;
    case 'failed': return e.t === 'SUBMIT' ? { s: 'submitting', attempt: 1 } : e.t === 'RESET' ? { s: 'idle' } : state;
    case 'succeeded': return e.t === 'RESET' ? { s: 'idle' } : state;
  }
}

export function useSubmitWithRetry(send: (signal: AbortSignal) => Promise<void>, isTransient: (e: unknown) => boolean) {
  const [state, dispatch] = useReducer(reduce, { s: 'idle' } as State);
  const attempt = state.s === 'submitting' ? state.attempt : 0;

  useEffect(() => {
    if (state.s !== 'submitting') return;
    const ctrl = new AbortController();
    send(ctrl.signal).then(
      () => dispatch({ t: 'OK' }),
      (err: unknown) => {
        if (ctrl.signal.aborted) return;                       // unmount/reset: ignore
        dispatch({ t: 'FAIL', error: err instanceof Error ? err.message : 'Error', transient: isTransient(err) });
      },
    );
    return () => ctrl.abort();
  }, [state.s, attempt, send, isTransient]);                   // re-run for each new attempt

  useEffect(() => {
    if (state.s !== 'waiting') return;
    const delay = Math.random() * Math.min(8000, 500 * 2 ** (state.attempt - 1)); // full jitter
    const id = setTimeout(() => dispatch({ t: 'RETRY_TIMER' }), delay);
    return () => clearTimeout(id);
  }, [state]);

  return { state, submit: () => dispatch({ t: 'SUBMIT' }), reset: () => dispatch({ t: 'RESET' }) };
}
export {};
