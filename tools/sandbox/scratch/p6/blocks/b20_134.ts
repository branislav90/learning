const todoKeys = { list: (f: Filters) => ['todos', 'list', f] as const, detail: (id: string) => ['todos', 'detail', id] as const };

const rename = useMutation({
  mutationFn: (v: { id: string; title: string }) => patchTodo(v.id, { title: v.title }),
  onSuccess: (todo) => queryClient.setQueryData(todoKeys.detail(todo.id), todo),
});
export {};
