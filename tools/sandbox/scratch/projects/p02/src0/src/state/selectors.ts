// src/state/selectors.ts
import { INBOX_ID, type CompletionFilter, type Task, type TasksState } from "../types";

export function resolveSelectedProjectId(state: TasksState, selectedId: string): string {
  return state.projects.some((p) => p.id === selectedId) ? selectedId : INBOX_ID;
}

export function selectVisibleTasks(
  state: TasksState,
  projectId: string,
  filter: CompletionFilter,
  query: string,
): Task[] {
  const q = query.trim().toLowerCase();
  return state.tasks.filter((t) => {
    if (t.projectId !== projectId) return false;
    if (filter === "open" && t.done) return false;
    if (filter === "done" && !t.done) return false;
    return q === "" || t.title.toLowerCase().includes(q);
  });
}

export function selectOpenCounts(state: TasksState): ReadonlyMap<string, number> {
  const counts = new Map<string, number>();
  for (const p of state.projects) counts.set(p.id, 0);
  for (const t of state.tasks) {
    if (!t.done) counts.set(t.projectId, (counts.get(t.projectId) ?? 0) + 1);
  }
  return counts;
}
