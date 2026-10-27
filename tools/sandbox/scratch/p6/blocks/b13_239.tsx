// Client Component
'use client';
import { use } from 'react';

export function UserCard({ userPromise }: { userPromise: Promise<{ name: string }> }) {
  const user = use(userPromise);        // suspends until resolved; throws if rejected
  return <h2>{user.name}</h2>;
}
export {};
