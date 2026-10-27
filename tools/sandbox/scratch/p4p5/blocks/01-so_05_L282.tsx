// users/api.ts — data acquisition
export type User = { id: string; name: string; email: string; active: boolean };

export async function fetchUsers(signal?: AbortSignal): Promise<User[]> {
  const res = await fetch("/api/users", { signal });
  if (!res.ok) throw new Error(`Failed to load users (${res.status})`);
  return res.json();
}
export {};
