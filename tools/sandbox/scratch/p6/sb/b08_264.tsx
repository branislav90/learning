// features/todos/todoQueries.ts
import { queryOptions, keepPreviousData } from '@tanstack/react-query';

export type Todo = { id: number; title: string; done: boolean };
export type TodoFilters = { status: 'all' | 'open' | 'done'; page: number };

export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters: TodoFilters) => [...todoKeys.lists(), filters] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
};

async function getJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export const todoListOptions = (filters: TodoFilters) =>
  queryOptions({
    queryKey: todoKeys.list(filters),
    queryFn: ({ signal }) =>
      getJson<{ items: Todo[]; total: number }>(
        `/api/todos?status=${filters.status}&page=${filters.page}`,
        signal,
      ),
    staleTime: 30_000,
    placeholderData: keepPreviousData, // keep showing previous page while next loads
  });

export const todoDetailOptions = (id: number) =>
  queryOptions({
    queryKey: todoKeys.detail(id),
    queryFn: ({ signal }) => getJson<Todo>(`/api/todos/${id}`, signal),
  });
export {};
