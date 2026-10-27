// (a) nuke everything
onSuccess: () => queryClient.invalidateQueries()                      // refetches every active query

// (b) wrong key shape — does not match any entry
onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project'] })   // keys are ['projects', ...]

// (c) invalidating before the server finished — refetch can read old state
onMutate: () => queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
export {};
