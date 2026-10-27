function Checkout({ userId }: { userId: number | null }) {
  const user = useQuery({
    queryKey: ['users', userId],
    queryFn: ({ signal }) => getJson<{ id: number; planId: string }>(`/api/users/${userId}`, signal),
    enabled: userId !== null,
  });

  const plan = useQuery({
    queryKey: ['plans', user.data?.planId],
    queryFn: ({ signal }) => getJson<{ price: number }>(`/api/plans/${user.data!.planId}`, signal),
    enabled: !!user.data?.planId,
  });
  ...
}
export {};
