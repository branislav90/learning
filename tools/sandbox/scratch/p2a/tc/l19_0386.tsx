import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

/** No-op on the server; layout effect in the browser. Avoids server warnings in versions that emit them. */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface Message { id: string; text: string }

export function MessageList({ messages }: { messages: readonly Message[] }): ReactNode {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const distanceFromBottom = useRef(0);         // updated by scroll events (outside render)
  const firstIdRef = useRef<string | undefined>(undefined);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (el) distanceFromBottom.current = el.scrollHeight - el.clientHeight - el.scrollTop;
  };

  useIsomorphicLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const firstId = messages[0]?.id;
    const prepended = firstIdRef.current !== undefined && firstId !== firstIdRef.current;
    firstIdRef.current = firstId;
    if (prepended) {
      // Older messages were added at the top: keep the viewport anchored to the same content.
      el.scrollTop = el.scrollHeight - el.clientHeight - distanceFromBottom.current;
    }
  }, [messages]);

  return (
    <div ref={scrollerRef} onScroll={onScroll} style={{ height: 400, overflowY: "auto" }}>
      {messages.map((m) => <p key={m.id}>{m.text}</p>)}
    </div>
  );
}
