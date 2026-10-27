// Presentational: props in, markup out
type Todo = { id: string; title: string; done: boolean };

function TodoListView({ todos, onToggle }: { todos: readonly Todo[]; onToggle(id: string): void }) {
  return (
    <ul>
      {todos.map((t) => (
        <li key={t.id}>
          <label>
            <input type="checkbox" checked={t.done} onChange={() => onToggle(t.id)} />
            {t.title}
          </label>
        </li>
      ))}
    </ul>
  );
}

// Container-role: owns the state
function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([{ id: "1", title: "Write lesson", done: false }]);
  const toggle = (id: string) =>
    setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  return <TodoListView todos={todos} onToggle={toggle} />;
}
export {};
