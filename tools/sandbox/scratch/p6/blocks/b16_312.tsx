export const jobsQuery = () =>
  queryOptions({
    queryKey: ['jobs', 'list'],
    queryFn: ({ signal }) => getJson<Job[]>('/api/jobs', signal),
    meta: { persist: true },
  });
export {};
