import { flushSync } from "react-dom";
import { useRef, useState } from "react";

export function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const listRef = useRef<HTMLUListElement>(null);

  function send(text: string) {
    flushSync(() => {
      setMessages((m) => [...m, text]);
    });
    // The DOM now contains the new <li>. Without flushSync it would not yet.
    listRef.current?.lastElementChild?.scrollIntoView();
  }

  return (
    <ul ref={listRef}>
      {messages.map((m, i) => <li key={i}>{m}</li>)}
    </ul>
  );
}
