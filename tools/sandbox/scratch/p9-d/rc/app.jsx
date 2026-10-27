import { useState } from "react";
import { track } from "./track.js";
function TodoRow({ todo, onToggle }) {
  track("row");
  return <li onClick={() => onToggle(todo.id)}>{todo.title}{todo.done ? " (done)" : ""}</li>;
}
function TodoList({ todos, onToggle }) {
  track("list");
  return <ul>{todos.map((t) => <TodoRow key={t.id} todo={t} onToggle={onToggle} />)}</ul>;
}
export function App() {
  track("app");
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState(() => [1,2,3,4,5].map((i) => ({ id: i, title: "t" + i, done: false })));
  const toggle = (id) => setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>Clicked {count}</button>
      <TodoList todos={todos} onToggle={toggle} />
    </>
  );
}
