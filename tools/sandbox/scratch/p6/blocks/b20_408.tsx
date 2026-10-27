export function useToggleTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['todos', 'toggle'],
    mutationFn: (v: { id: string; done: boolean }) => patchTodo(v.id, { done: v.done }),
    onMutate: async (v) => {
      await qc.cancelQueries({ queryKey: ['todos', 'list'] });
      const previous = qc.getQueryData<Todo[]>(['todos', 'list']);
      qc.setQueryData<Todo[]>(['todos', 'list'], (old) => old?.map((t) => (t.id === v.id ? { ...t, done: v.done } : t)));
      return { previous };
    },
    onError: (_err, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(['todos', 'list'], ctx.previous);
    },
    onSettled: () => {
      if (qc.isMutating({ mutationKey: ['todos', 'toggle'] }) === 1) {   // only the last settled mutation reconciles (verify count semantics)
        void qc.invalidateQueries({ queryKey: ['todos', 'list'] });
      }
    },
  });
}
export {};
