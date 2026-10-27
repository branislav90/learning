// server.tsx (Node, handles every request)
const queryClient = new QueryClient();               // module scope

export async function render(req: Request) {
  const session = await getSession(req);
  await queryClient.prefetchQuery({ queryKey: ['me'], queryFn: () => fetchMe(session.token) });
  const state = dehydrate(queryClient);
  return renderToString(<App state={state} />);
}
export {};
