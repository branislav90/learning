// src/state/reducer.ts
import { INBOX_ID, type Task, type TasksState } from "../types";
import type { TasksAction } from "./actions";

/** Apply `change` to the task with `id`; return the SAME array if nothing changed. */
function updateTask(
  tasks: readonly Task[],
  id: string,
  change: (t: Task) => Task,
): readonly Task[] {
  let changed = false;
  const next = tasks.map((t) => {
    if (t.id !== id) return t; // identity preserved
    const updated = change(t);
    if (updated !== t) changed = true;
    return updated;
  });
  return changed ? next : tasks;
}

export function tasksReducer(state: TasksState, action: TasksAction): TasksState {
  switch (action.type) {
    case "task/added":
      return { ...state, tasks: [action.task, ...state.tasks] };

    case "task/toggled": {
      const tasks = updateTask(state.tasks, action.id, (t) => ({ ...t, done: !t.done }));
      return tasks === state.tasks ? state : { ...state, tasks };
    }

    case "task/renamed": {
      const title = action.title.trim();
      if (title === "") return state; // reject: invalid rename is a no-op
      const tasks = updateTask(state.tasks, action.id, (t) =>
        t.title === title ? t : { ...t, title },
      );
      return tasks === state.tasks ? state : { ...state, tasks };
    }

    case "task/prioritized": {
      const tasks = updateTask(state.tasks, action.id, (t) =>
        t.priority === action.priority ? t : { ...t, priority: action.priority },
      );
      return tasks === state.tasks ? state : { ...state, tasks };
    }

    case "task/moved": {
      if (!state.projects.some((p) => p.id === action.projectId)) return state;
      const tasks = updateTask(state.tasks, action.id, (t) =>
        t.projectId === action.projectId ? t : { ...t, projectId: action.projectId },
      );
      return tasks === state.tasks ? state : { ...state, tasks };
    }

    case "task/removed": {
      const tasks = state.tasks.filter((t) => t.id !== action.id);
      return tasks.length === state.tasks.length ? state : { ...state, tasks };
    }

    case "tasks/completedCleared": {
      const tasks = state.tasks.filter((t) => !(t.projectId === action.projectId && t.done));
      return tasks.length === state.tasks.length ? state : { ...state, tasks };
    }

    case "project/added": {
      const name = action.name.trim();
      if (name === "") return state;
      return { ...state, projects: [...state.projects, { id: action.id, name }] };
    }

    case "project/removed": {
      if (action.id === INBOX_ID) return state; // invariant: Inbox is permanent
      if (!state.projects.some((p) => p.id === action.id)) return state;
      return {
        projects: state.projects.filter((p) => p.id !== action.id),
        // atomic cascade: re-home tasks in the same transition
        tasks: state.tasks.map((t) => (t.projectId === action.id ? { ...t, projectId: INBOX_ID } : t)),
      };
    }

    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}
