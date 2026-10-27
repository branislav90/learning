import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Todo { id: string; title: string; done: boolean }
const todosKey = ['todos'] as const;

export function useToggleTodo() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (v: { id: string; done: boolean }) => api.patchTodo(v.id, { done: v.done }),

    onMutate: async (v) => {
      await qc.cancelQueries({ queryKey: todosKey });                  // stop in-flight reads overwriting the prediction
      const previous = qc.getQueryData<Todo[]>(todosKey);              // snapshot (see §2.5 for its limits)
      qc.setQueryData<Todo[]>(todosKey, (old) =>
        old?.map((t) => (t.id === v.id ? { ...t, done: v.done } : t)),
      );
      return { previous };                                             // becomes `context` in onError
    },

    onError: (_err, _v, context) => {
      if (context?.previous) qc.setQueryData(todosKey, context.previous);  // rollback (coarse)
    },

    onSettled: () => {
      void qc.invalidateQueries({ queryKey: todosKey });               // converge to truth either way
    },
  });
}
declare const api: { patchTodo(id: string, body: Partial<Todo>): Promise<Todo> };
export {};
