import { useInfiniteQuery } from '@tanstack/react-query';

type Page = { items: Todo[]; nextCursor: string | null };

const q = useInfiniteQuery({
  queryKey: ['todos', 'infinite'],
  queryFn: ({ pageParam, signal }) =>
    getJson<Page>(`/api/todos?cursor=${pageParam ?? ''}`, signal),
  initialPageParam: null as string | null,       // REQUIRED in v5
  getNextPageParam: (last) => last.nextCursor,   // return undefined/null → no more pages
});

const all = q.data?.pages.flatMap((p) => p.items) ?? [];
// <button disabled={!q.hasNextPage || q.isFetchingNextPage} onClick={() => q.fetchNextPage()} />
export {};
