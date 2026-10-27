// src/state/actions.ts
import type { Priority, Task } from "../types";

export type TasksAction =
  | { type: "task/added"; task: Task }
  | { type: "task/toggled"; id: string }
  | { type: "task/renamed"; id: string; title: string }
  | { type: "task/prioritized"; id: string; priority: Priority }
  | { type: "task/moved"; id: string; projectId: string }
  | { type: "task/removed"; id: string }
  | { type: "tasks/completedCleared"; projectId: string }
  | { type: "project/added"; id: string; name: string }
  | { type: "project/removed"; id: string };

// Impure helpers live OUTSIDE the reducer. They are called from event handlers.
export function newTask(projectId: string, title: string): TasksAction {
  return {
    type: "task/added",
    task: {
      id: crypto.randomUUID(),
      title: title.trim(),
      done: false,
      priority: "normal",
      projectId,
      createdAt: Date.now(),
    },
  };
}

export function newProject(name: string): TasksAction {
  return { type: "project/added", id: crypto.randomUUID(), name: name.trim() };
}
