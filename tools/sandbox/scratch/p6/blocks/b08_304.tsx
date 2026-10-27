// features/todos/TodoList.tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { todoKeys, todoListOptions, type Todo, type TodoFilters } from './todoQueries';

export function TodoList({ filters }: { filters: TodoFilters }) {
  const queryClient = useQueryClient();
  const { data, isPending, isError, error, isFetching, isPlaceholderData } =
    useQuery(todoListOptions(filters));

  const toggle = useMutation({
    mutationFn: async (todo: Todo) => {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !todo.done }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as Todo;
    },
    onSuccess: (updated) => {
      // 1. write the authoritative detail directly (no extra request)
      queryClient.setQueryData(todoKeys.detail(updated.id), updated);
      // 2. lists may now be wrong (filters!) → mark stale & refetch active ones
      return queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });

  if (isPending) return <p>Loading…</p>;
  if (isError) return <p role="alert">{error.message}</p>;

  return (
    <div aria-busy={isFetching}>
      <ul style={{ opacity: isPlaceholderData ? 0.6 : 1 }}>
        {data.items.map((t) => (
          <li key={t.id}>
            <label>
              <input
                type="checkbox"
                checked={t.done}
                disabled={toggle.isPending && toggle.variables.id === t.id}
                onChange={() => toggle.mutate(t)}
              />
              {t.title}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
export {};
