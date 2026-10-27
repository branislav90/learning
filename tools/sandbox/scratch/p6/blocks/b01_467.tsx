import { Suspense, use } from 'react';

// The promise is created OUTSIDE render and cached by key.
const cache = new Map<string, Promise<User>>();
function loadUser(id: string): Promise<User> {
  let p = cache.get(id);
  if (!p) {
    p = fetchJson(`/api/users/${encodeURIComponent(id)}`).then(parseUser);
    cache.set(id, p);
  }
  return p;
}

function Profile({ id }: { id: string }) {
  const user = use(loadUser(id)); // suspends until resolved; throws on rejection → Error Boundary
  return <h1>{user.name}</h1>;
}

export function Page({ id }: { id: string }) {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <Profile id={id} />
    </Suspense>
  );
}
export {};
