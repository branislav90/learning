export async function render(req: Request) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const session = await getSession(req);
  await queryClient.prefetchQuery({ queryKey: ['me'], queryFn: () => fetchMe(session.token) });
  return renderToString(<App state={dehydrate(queryClient)} />);
}
export {};
