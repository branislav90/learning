import { useEffect, useRef } from 'react';

export function useWindowEvent<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: Omit<AddEventListenerOptions, 'signal'>,
) {
  const handlerRef = useRef(handler);
  useEffect(() => { handlerRef.current = handler; });         // keep latest after each commit

  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener(
      type,
      (event) => handlerRef.current(event),
      { ...options, signal: controller.signal },
    );
    return () => controller.abort();                          // removes the listener
  }, [type, options?.capture, options?.passive, options?.once]);
}
export {};
