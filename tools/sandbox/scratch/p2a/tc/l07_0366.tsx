import { useOptimistic, useRef } from "react";

export type Todo = {
  clientId: string;       // identity for React: assigned once when the todo is created, never changes
  id?: string;            // server id: appears after persistence; DATA, not identity
  title: string;
  pending?: boolean;
};

type Props = {
  todos: Todo[];
  onCreate: (todo: Todo) => Promise<void>;   // parent persists and stores the todo WITH the same clientId
};

export function Todos({ todos, onCreate }: Props) {
  const [optimistic, addOptimistic] = useOptimistic(
    todos,
    (current: Todo[], next: Todo) => [...current, { ...next, pending: true }],
  );
  const formRef = useRef<HTMLFormElement>(null);

  async function createTodo(formData: FormData) {
    const todo: Todo = { clientId: crypto.randomUUID(), title: String(formData.get("title") ?? "") };
    addOptimistic(todo);          // shows immediately with pending: true
    formRef.current?.reset();
    await onCreate(todo);         // when `todos` updates, the item has the same clientId (plus id)
  }

  return (
    <form ref={formRef} action={createTodo}>
      <input name="title" />
      <ul>
        {optimistic.map((t) => (
          <li key={t.clientId} aria-busy={t.pending}>{t.title}</li>   // ✅ stable across optimistic → confirmed
        ))}
      </ul>
    </form>
  );
}
