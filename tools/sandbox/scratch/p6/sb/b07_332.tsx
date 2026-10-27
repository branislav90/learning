declare const ListFilters: any; type ListFilters<T=any,U=any,V=any> = any;
declare const projectQueries: any; type projectQueries<T=any,U=any,V=any> = any;
declare const projectsApi: any; type projectsApi<T=any,U=any,V=any> = any;
declare const projectKeys: any; type projectKeys<T=any,U=any,V=any> = any;
// features/projects/hooks.ts — the only things components import
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useProjects = (filters: ListFilters) => useQuery(projectQueries.list(filters));
export const useProject = (id: string) => useQuery(projectQueries.detail(id));

export function usePrefetchProject() {
  const qc = useQueryClient();
  return (id: string) => void qc.prefetchQuery(projectQueries.detail(id));   // respects staleTime: fresh ⇒ no request
}

export function useRenameProject(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, version }: { name: string; version: number }) => projectsApi.rename(id, name, version),
    onSuccess: (updated) => { qc.setQueryData(projectKeys.detail(id), updated); },   // write-through (06 §2.6)
    onSettled: () => { void qc.invalidateQueries({ queryKey: projectKeys.lists() }); },
  });
}
export {};
