import { useRef, useState } from 'react';

export function useLatestAction<TArg, TResult>(
  run: (arg: TArg, signal: AbortSignal) => Promise<TResult>,
) {
  const controllerRef = useRef<AbortController | null>(null);
  const [state, setState] = useState<
    | { status: 'idle' }
    | { status: 'pending' }
    | { status: 'success'; value: TResult }
    | { status: 'error'; error: Error }
  >({ status: 'idle' });

  async function trigger(arg: TArg) {
    controllerRef.current?.abort();                  // cancel the previous operation
    const controller = new AbortController();
    controllerRef.current = controller;
    setState({ status: 'pending' });
    try {
      const value = await run(arg, controller.signal);
      if (controller.signal.aborted) return;
      setState({ status: 'success', value });
    } catch (e) {
      if (controller.signal.aborted) return;
      setState({ status: 'error', error: e instanceof Error ? e : new Error(String(e)) });
    }
  }

  function cancel() { controllerRef.current?.abort(); }
  return { state, trigger, cancel };
}
export {};
