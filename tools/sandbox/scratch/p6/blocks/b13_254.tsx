import { queryOptions, useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { Suspense, useTransition, useState } from 'react';

const userOptions = (id: number) =>
  queryOptions({
    queryKey: ['users', 'detail', id] as const,
    queryFn: async ({ signal }) => {
      const r = await fetch(`/api/users/${id}`, { signal });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return (await r.json()) as { id: number; name: string };
    },
    staleTime: 60_000,
  });

function Profile({ id }: { id: number }) {
  const { data } = useSuspenseQuery(userOptions(id));   // data is non-undefined: no loading branch
  return <h2>{data.name}</h2>;
}

export function UserSwitcher({ ids }: { ids: number[] }) {
  const [current, setCurrent] = useState(ids[0]);
  const [isPending, startTransition] = useTransition();
  const qc = useQueryClient();

  return (
    <div>
      {ids.map((id) => (
        <button
          key={id}
          onMouseEnter={() => qc.prefetchQuery(userOptions(id))}        // start fetch before render
          onClick={() => startTransition(() => setCurrent(id))}        // keep old UI while loading
          aria-pressed={id === current}
        >
          User {id}
        </button>
      ))}
      <div aria-busy={isPending} style={{ opacity: isPending ? 0.6 : 1 }}>
        <Suspense fallback={<p>Loading…</p>}>
          <Profile id={current} />
        </Suspense>
      </div>
    </div>
  );
}
export {};
