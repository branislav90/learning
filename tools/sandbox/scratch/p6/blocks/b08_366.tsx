// ❌ A: key does not contain all inputs
function UserPosts({ userId }: { userId: number }) {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch(`/api/users/${userId}/posts`).then((r) => r.json()),
  }).data;
}
export {};
