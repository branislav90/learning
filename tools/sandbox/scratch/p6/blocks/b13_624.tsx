const cache = new Map<number, Promise<User>>();
export function getUser(id: number): Promise<User> {
  let p = cache.get(id);
  if (!p) {
    p = fetch(`/api/users/${id}`).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json() as Promise<User>;
    });
    p.catch(() => cache.delete(id));       // allow retry after failure
    cache.set(id, p);
  }
  return p;
}
export const invalidateUser = (id: number) => cache.delete(id);
// usage: const user = use(getUser(id));
export {};
