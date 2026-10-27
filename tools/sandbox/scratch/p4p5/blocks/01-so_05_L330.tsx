// users/UserListView.tsx — presentational
import type { User } from "./api";
export function UserListView({ users }: { users: readonly Pick<User, "id" | "name" | "email">[] }) {
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name} ({u.email})</li>
      ))}
    </ul>
  );
}
export {};
