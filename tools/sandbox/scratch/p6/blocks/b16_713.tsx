import { listPending } from './outbox'; // returns items with status pending|in-flight

export async function reapplyPending(qc: QueryClient) {
  const items = await listPending();
  qc.setQueryData<Job[]>(['jobs', 'list'], (jobs) => {
    if (!jobs) return jobs;
    const done = new Set(items.filter(i => i.type === 'COMPLETE_JOB').map(i => (i.payload as { jobId: number }).jobId));
    return jobs.map(j => (done.has(j.id) ? { ...j, status: 'complete', pendingSync: true } : j));
  });
}
export {};
