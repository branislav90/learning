// session.ts
export const session = { user: null as User | null };
export function setSession(u: User | null) { session.user = u; }

// Header.tsx
export function Header() { return <span>{session.user?.name ?? "Guest"}</span>; }
export {};
