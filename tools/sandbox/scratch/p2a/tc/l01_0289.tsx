import { useState } from "react";

type Todo = { id: number; title: string; done: boolean };

export function TodoList({ initial }: { initial: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initial);

  function add() {
    todos.push({ id: Date.now(), title: "New", done: false }); // mutation
    setTodos(todos);                                            // same reference
  }

  return (
    <>
      <button onClick={add}>Add</button>
      <ul>{todos.map((t) => <li key={t.id}>{t.title}</li>)}</ul>
    </>
  );
}
