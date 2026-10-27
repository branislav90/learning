// After: promise created outside render (cache by id), consumed with use()
const cache = new Map<string, Promise<User>>();
function getUser(id: string): Promise<User> {
  let p = cache.get(id);
  if (!p) { p = fetchUser(id); cache.set(id, p); }
  return p;
}

function UserPanel({ id }: { id: string }) {
  const user = use(getUser(id));            // suspends until resolved; throws to boundary if rejected
  return <UserCard user={user} />;
}

// Parent
<ErrorBoundary fallback={<ErrorView />}>
  <Suspense fallback={<Spinner />}>
    <UserPanel id={id} />
  </Suspense>
</ErrorBoundary>
export {};
