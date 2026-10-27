// features/projects/api.ts — HTTP only; knows nothing about React or the cache
import { fetchJson } from '@/lib/fetch-json';
import { parseProject, parseProjectPage, type Project, type ProjectPage } from './parsers';
import { projectKeys } from './keys';   // see lesson 06 §5.2

export const projectsApi = {
  list: async (filters: ListFilters, signal: AbortSignal): Promise<ProjectPage> =>
    parseProjectPage(await fetchJson(`/api/projects?${toSearch(filters)}`, signal)),

  detail: async (id: string, signal: AbortSignal): Promise<Project> =>
    parseProject(await fetchJson(`/api/projects/${encodeURIComponent(id)}`, signal)),

  rename: async (id: string, name: string, version: number): Promise<Project> =>
    parseProject(await sendJson(`/api/projects/${encodeURIComponent(id)}`, 'PATCH', { name }, { 'If-Match': String(version) })),
};
declare function toSearch(f: ListFilters): string;
declare function sendJson(url: string, method: string, body: unknown, headers?: Record<string, string>): Promise<unknown>;
export interface ListFilters { status?: 'active' | 'archived'; page?: number }
export {};
