declare const enqueue: any; type enqueue<T=any,U=any,V=any> = any;
declare const Job: any; type Job<T=any,U=any,V=any> = any;
declare const drain: any; type drain<T=any,U=any,V=any> = any;
import { useQueryClient, useMutation } from '@tanstack/react-query';

function useCompleteJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: number) => {
      const item = await enqueue('COMPLETE_JOB', { jobId });   // 1. durable intent
      qc.setQueryData<Job[]>(['jobs', 'list'], (jobs) =>        // 2. optimistic cache update
        jobs?.map((j) => (j.id === jobId ? { ...j, status: 'complete', pendingSync: true } : j)),
      );
      await drain(() => void qc.invalidateQueries({ queryKey: ['jobs'] })); // 3. try to sync now
      return item.id;
    },
  });
}
export {};
