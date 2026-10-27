import { useRef, useState } from "react";
import { flushSync } from "react-dom";

export function Todos() {
  const [todos, setTodos] = useState<string[]>([]);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLUListElement>(null);

  function add() {
    flushSync(() => {
      setTodos((t) => [...t, text]);   // render + commit happen synchronously, here
      setText("");
    });
    // DOM is now updated; the new <li> exists:
    listRef.current?.lastElementChild?.scrollIntoView({ block: "nearest" });
  }

  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} aria-label="New todo" />
      <button onClick={add}>Add</button>
      <ul ref={listRef}>{todos.map((t, i) => <li key={i}>{t}</li>)}</ul>
    </>
  );
}
