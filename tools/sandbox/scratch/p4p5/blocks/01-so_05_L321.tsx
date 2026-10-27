// users/domain.ts — pure business rule
import type { User } from "./api";
export function visibleUsers(users: readonly User[], query: string): User[] {
  const q = query.trim().toLowerCase();
  return users.filter((u) => u.active && u.name.toLowerCase().includes(q));
}
export {};
