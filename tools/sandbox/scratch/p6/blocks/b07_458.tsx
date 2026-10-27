function ProjectOverview({ id }: { id: string }) {
  const project = useProject(id);                                     // A
  const owner = useQuery({                                            // B depends on A
    queryKey: ['users', 'detail', project.data?.ownerId],
    queryFn: ({ signal }) => usersApi.detail(project.data!.ownerId, signal),
    enabled: project.data !== undefined,                              // ⚠ option name; verify
  });
  const tasks = useQuery(taskQueries.byProject(id));                  // C independent: starts in parallel with A
  /* render */
}
export {};
