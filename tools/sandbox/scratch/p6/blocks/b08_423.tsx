const queryClient = useQueryClient();

const rename = useMutation({
  mutationFn: (v: { id: number; title: string }) => patchTodo(v.id, { title: v.title }),

  onMutate: async (v) => {
    await queryClient.cancelQueries({ queryKey: todoKeys.detail(v.id) }); // stop in-flight refetch overwriting us
    const previous = queryClient.getQueryData<Todo>(todoKeys.detail(v.id));
    queryClient.setQueryData<Todo>(todoKeys.detail(v.id), (old) =>
      old ? { ...old, title: v.title } : old,
    );
    return { previous };           // context for onError
  },

  onError: (_err, v, ctx) => {
    if (ctx?.previous) queryClient.setQueryData(todoKeys.detail(v.id), ctx.previous);
  },

  onSettled: (_data, _err, v) =>
    queryClient.invalidateQueries({ queryKey: todoKeys.detail(v.id) }), // converge on server truth
});
export {};
