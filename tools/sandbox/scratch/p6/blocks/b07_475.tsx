export function useProjectWithPlaceholder(id: string) {
  const qc = useQueryClient();
  return useQuery({
    ...projectQueries.detail(id),
    placeholderData: () => {
      // Find the summary in any cached list; show it dimmed until the real detail arrives.
      for (const [, page] of qc.getQueriesData<ProjectPage>({ queryKey: projectKeys.lists() })) {
        const hit = page?.items.find((p) => p.id === id);
        if (hit) return toDetailPlaceholder(hit);          // fields missing from the summary are explicitly `undefined`
      }
      return undefined;
    },
  });
}
declare function toDetailPlaceholder(s: ProjectSummary): Project;
export {};
