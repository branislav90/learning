type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

type AsyncAction<T> =
  | { type: 'start' }
  | { type: 'resolve'; data: T }
  | { type: 'reject'; error: Error }
  | { type: 'reset' };

function asyncReducer<T>(s: AsyncState<T>, a: AsyncAction<T>): AsyncState<T> {
  switch (a.type) {
    case 'start': return { status: 'loading' };
    case 'resolve': return { status: 'success', data: a.data };
    case 'reject': return { status: 'error', error: a.error };
    case 'reset': return { status: 'idle' };
  }
}

export function useAsyncStatus<T>() {
  return useReducer(asyncReducer<T>, { status: 'idle' } as AsyncState<T>);
}
