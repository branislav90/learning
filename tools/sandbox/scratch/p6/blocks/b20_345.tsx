// Suspense-aware hook from a data library (TanStack Query v5; verify)
const { data: user } = useSuspenseQuery({ queryKey: ['user', id], queryFn: ({ signal }) => getJson<UserDto>(`/api/users/${id}`, { signal }) });
export {};
