import { useEffect, useState } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';

export function useRetryMessage(q: Pick<UseQueryResult, 'failureCount' | 'isFetching'>) {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (!q.isFetching || q.failureCount === 0) { setSlow(false); return; }
    const id = setTimeout(() => setSlow(true), 5000);
    return () => clearTimeout(id);
  }, [q.isFetching, q.failureCount]);
  if (!q.isFetching || q.failureCount === 0) return null;
  return slow ? 'Taking longer than usual…' : 'Still trying…';
}
export {};
