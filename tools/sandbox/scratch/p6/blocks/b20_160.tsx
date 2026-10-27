'use client';
export function Profile({ id }: { id: string }) {
  const user = use(fetch(`/api/users/${id}`).then((r) => r.json() as Promise<UserDto>));
  return <h1>{user.name}</h1>;
}
// parent: <Suspense fallback={<Spinner />}><Profile id="7" /></Suspense>
export {};
