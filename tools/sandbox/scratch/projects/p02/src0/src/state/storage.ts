// src/state/storage.ts
import { INBOX_ID, type Priority, type Project, type Task, type TasksState } from "../types";
import { seedState } from "./seed";

const STORAGE_KEY = "taskboard:v1";
const SCHEMA_VERSION = 1;

interface Persisted {
  version: number;
  state: TasksState;
}

const PRIORITIES: readonly Priority[] = ["low", "normal", "high"];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isTask(v: unknown): v is Task {
  return (
    isRecord(v) &&
    typeof v.id === "string" &&
    typeof v.title === "string" &&
    typeof v.done === "boolean" &&
    typeof v.projectId === "string" &&
    typeof v.createdAt === "number" &&
    PRIORITIES.includes(v.priority as Priority)
  );
}

function isProject(v: unknown): v is Project {
  return isRecord(v) && typeof v.id === "string" && typeof v.name === "string";
}

function parse(raw: string): TasksState | null {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(data) || data.version !== SCHEMA_VERSION || !isRecord(data.state)) return null;
  const { tasks, projects } = data.state;
  if (!Array.isArray(tasks) || !Array.isArray(projects)) return null;
  if (!tasks.every(isTask) || !projects.every(isProject)) return null;
  if (!projects.some((p) => p.id === INBOX_ID)) return null; // invariant
  // Orphan tasks (unknown project) are repaired rather than rejected.
  const ids = new Set(projects.map((p) => p.id));
  return {
    projects,
    tasks: tasks.map((t) => (ids.has(t.projectId) ? t : { ...t, projectId: INBOX_ID })),
  };
}

export function loadState(storage: Pick<Storage, "getItem"> = localStorage): TasksState {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return seedState;
    return parse(raw) ?? seedState;
  } catch {
    // Storage can throw (privacy mode, disabled storage). Degrade to seed.
    return seedState;
  }
}

export function saveState(state: TasksState, storage: Pick<Storage, "setItem"> = localStorage): void {
  try {
    const payload: Persisted = { version: SCHEMA_VERSION, state };
    storage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Quota exceeded or storage unavailable. Persistence is best-effort.
  }
}
