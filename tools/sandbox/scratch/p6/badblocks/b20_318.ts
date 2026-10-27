onSuccess: (todo) => {
  queryClient.setQueryData(todoKeys.detail(todo.id), todo);
  void queryClient.invalidateQueries({ queryKey: ['todos', 'list'] });
},
export {};
