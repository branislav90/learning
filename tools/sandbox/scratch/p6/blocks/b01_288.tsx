// UserProfile.tsx
import { useFetch } from './use-fetch';

interface User { id: string; name: string; email: string }

// Stable reference: defined at module scope, not re-created each render.
function parseUser(raw: unknown): User {
  if (
    typeof raw === 'object' && raw !== null &&
    typeof (raw as Record<string, unknown>).id === 'string' &&
    typeof (raw as Record<string, unknown>).name === 'string' &&
    typeof (raw as Record<string, unknown>).email === 'string'
  ) {
    const r = raw as Record<string, string>;
    return { id: r.id, name: r.name, email: r.email };
  }
  throw new Error('Invalid User payload');
}

export function UserProfile({ userId }: { userId: string }) {
  const state = useFetch(`/api/users/${encodeURIComponent(userId)}`, parseUser);

  switch (state.status) {
    case 'loading': return <p aria-busy="true">Loading…</p>;
    case 'error':   return <p role="alert">Could not load user: {state.error.message}</p>;
    case 'success': return <h1>{state.data.name}</h1>;
  }
}
export {};
