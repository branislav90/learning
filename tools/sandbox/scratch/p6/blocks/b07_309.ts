// features/projects/queries.ts — keys + options live together; hooks and prefetchers reuse them
import { queryOptions } from '@tanstack/react-query';   // ⚠ verify availability/name in your version
import { projectsApi, type ListFilters } from './api';
import { projectKeys } from './keys';

export const projectQueries = {
  list: (filters: ListFilters) =>
    queryOptions({
      queryKey: projectKeys.list(filters),
      queryFn: ({ signal }) => projectsApi.list(filters, signal),   // forward the signal ⇒ cancellation (lesson 02)
      staleTime: 30_000,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: projectKeys.detail(id),
      queryFn: ({ signal }) => projectsApi.detail(id, signal),
      staleTime: 5 * 60_000,
    }),
};
export {};
