import { useMutation, useMutationState, useQuery } from '@tanstack/react-query';

function TodoList() {
  const { data: todos = [] } = useQuery({ queryKey: ['todos'], queryFn: api.listTodos });

  // Pending toggle mutations' variables, by mutation key. ⚠ verify useMutationState signature in v5 docs.
  const pending = useMutationState({
    filters: { mutationKey: ['toggle-todo'], status: 'pending' },
    select: (m) => m.state.variables as { id: string; done: boolean },
  });

  const view = todos.map((t) => {
    const p = pending.filter((x) => x.id === t.id).at(-1);   // latest pending toggle for this todo
    return p ? { ...t, done: p.done, pending: true } : t;
  });
  /* render `view` */
}
export {};
