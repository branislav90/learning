// use-event-listener.ts
import { useEffect } from "react";
import { useLatest } from "./use-latest";

export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: { capture?: boolean; passive?: boolean },
): void {
  const handlerRef = useLatest(handler);
  const capture = options?.capture;
  const passive = options?.passive;

  useEffect(() => {
    const listener = (event: WindowEventMap[K]) => handlerRef.current(event);
    window.addEventListener(type, listener, { capture, passive });
    return () => window.removeEventListener(type, listener, { capture });
  }, [type, capture, passive, handlerRef]);
}
export {};
