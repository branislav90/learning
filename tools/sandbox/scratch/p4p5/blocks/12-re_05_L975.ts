export type Filter = "all" | "active" | "done";
export type Todo = { id: string; text: string; done: boolean };
export type TodosState = { todos: readonly Todo[]; filter: Filter };
export type TodosAction =
  | { type: "todoAdded"; id: string; text: string }
  | { type: "todoToggled"; id: string }
  | { type: "todoRemoved"; id: string }
  | { type: "todosFiltered"; filter: Filter }
  | { type: "completedCleared" };

export function todosReducer(s: TodosState, a: TodosAction): TodosState {
  switch (a.type) {
    case "todoAdded": {
      const text = a.text.trim();
      return text === "" ? s : { ...s, todos: [...s.todos, { id: a.id, text, done: false }] };
    }
    case "todoToggled":
      return s.todos.some((t) => t.id === a.id)
        ? { ...s, todos: s.todos.map((t) => (t.id === a.id ? { ...t, done: !t.done } : t)) }
        : s;
    case "todoRemoved":
      return s.todos.some((t) => t.id === a.id) ? { ...s, todos: s.todos.filter((t) => t.id !== a.id) } : s;
    case "todosFiltered":
      return s.filter === a.filter ? s : { ...s, filter: a.filter };
    case "completedCleared":
      return s.todos.some((t) => t.done) ? { ...s, todos: s.todos.filter((t) => !t.done) } : s;
    default:
      return assertNever(a);
  }
}
export {};
