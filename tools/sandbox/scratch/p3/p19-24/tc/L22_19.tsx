import { useOptimistic, useState, startTransition } from 'react';

interface Todo { id: string; title: string; pending?: boolean }

export function Todos({ initial }: { initial: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initial);
  const [error, setError] = useState<string | null>(null);

  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (current: Todo[], title: string): Todo[] => [
      ...current,
      { id: `optimistic-${title}`, title, pending: true },
    ],
  );

  async function addTodoAction(formData: FormData) {
    const title = String(formData.get('title') ?? '').trim();
    if (!title) return;
    setError(null);
    addOptimisticTodo(title); // inside the form Action → allowed
    try {
      const saved = await api.createTodo(title); // returns Todo with real id
      startTransition(() => setTodos((prev) => [...prev, saved])); // post-await: re-wrap so it stays in the Action's transition
    } catch {
      setError('Could not add the todo.');
    }
  }

  return (
    <>
      <form action={addTodoAction}>
        <input name="title" required aria-label="New todo" />
        <button type="submit">Add</button>
      </form>
      {error && <p role="alert">{error}</p>}
      <ul>
        {optimisticTodos.map((t) => (
          <li key={t.id} style={{ opacity: t.pending ? 0.5 : 1 }}>{t.title}</li>
        ))}
      </ul>
    </>
  );
}
