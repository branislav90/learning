import { useState, memo } from "react";
import { track } from "./track.js";
const Child = memo(function Child({ onSave }) { track("child"); return <button onClick={onSave}>save</button>; });
export function Parent({ save }) {
  const [n, setN] = useState(0);
  const id = 7;
  return <div><span>{n}</span><button onClick={() => setN(n + 1)}>inc</button><Child onSave={() => save(id)} /></div>;
}
const Row = memo(function Row({ todo, onToggle }) { track("row"); return <li onClick={() => onToggle(todo.id)}>{todo.title}{todo.done ? " (done)" : ""}</li>; });
export function App2() {
  const [todos, setTodos] = useState(() => [1,2,3,4,5].map((i) => ({ id: i, title: "t" + i, done: false })));
  const toggle = (id) => setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  return <ul>{todos.map((t) => <Row key={t.id} todo={t} onToggle={toggle} />)}</ul>;
}
