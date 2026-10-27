// route loader
export const loader = (qc: QueryClient) => async ({ params }: { params: { id: string } }) => {
  const id = Number(params.id);
  void qc.prefetchQuery(userOptions(id));
  void qc.prefetchQuery(postsOptions(id));       // both start immediately, in parallel
  return null;
};

// component
function UserPage({ id }: { id: number }) {
  const [u, p] = useSuspenseQueries({ queries: [userOptions(id), postsOptions(id)] });
  return <View user={u.data} posts={p.data} />;
}
export {};
