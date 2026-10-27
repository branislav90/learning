export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
export const ok = <T,>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E,>(error: E): Result<never, E> => ({ ok: false, error });
export function matchResult<T, E, R>(r: Result<T, E>, h: { ok: (v: T) => R; err: (e: E) => R }): R {
  return r.ok ? h.ok(r.value) : h.err(r.error);
}

type NotFound = { kind: 'not_found'; id: string };
export async function fetchUser(id: string): Promise<Result<User, NotFound>> {
  const res = await fetch(`/api/users/${id}`);
  if (res.status === 404) return err({ kind: 'not_found', id });
  if (!res.ok) throw new AppError(`GET /users/${id} → ${res.status}`, 'server', { retryable: res.status >= 500 });
  return ok((await res.json()) as User);   // in production validate with a schema at this boundary
}
export {};
