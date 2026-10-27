const add = useMutation({
  mutationFn: (title: string) => postItem(title),
  onMutate: async (title) => {
    await qc.cancelQueries({ queryKey: ['items', 'list'] });
    const previous = qc.getQueryData<Item[]>(['items', 'list']);
    qc.setQueryData<Item[]>(['items', 'list'], (old = []) => [
      ...old, { id: -Date.now(), title, pending: true },
    ]);
    return { previous };
  },
  onError: (_e, _t, ctx) => qc.setQueryData(['items', 'list'], ctx?.previous),
  onSettled: () => qc.invalidateQueries({ queryKey: ['items', 'list'] }),
});
export {};
