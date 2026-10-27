declare const projectKeys: any; type projectKeys<T=any,U=any,V=any> = any;
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useRenameProject(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => api.renameProject(id, name),   // returns the full updated Project

    onSuccess: (updated) => {
      // 1. Write-through: the detail entry now equals the server's authoritative answer.
      qc.setQueryData(projectKeys.detail(id), updated);
    },

    onSettled: () => {
      // 2. Lists may reorder / change membership: refetch them, but not everything.
      void qc.invalidateQueries({ queryKey: projectKeys.lists() });
      // 3. If the write could have failed ambiguously, converge the detail too (cheap, deduped).
      void qc.invalidateQueries({ queryKey: projectKeys.detail(id), refetchType: 'none' });
    },
  });
}
declare const api: { renameProject(id: string, name: string): Promise<Project> };
interface Project { id: string; name: string; updatedAt: string }
export {};
