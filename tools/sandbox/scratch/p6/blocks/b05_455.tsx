async function toggleBad(todo: Todo) {
  setTodos(todos.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t)));   // (1)
  try {
    await api.patchTodo(todo.id, { done: !todo.done });
  } catch {
    setTodos(todos);                                                              // (2)
  }
}
export {};
