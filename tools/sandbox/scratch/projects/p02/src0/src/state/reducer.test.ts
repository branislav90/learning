// src/state/reducer.test.ts
import { describe, expect, it } from "vitest";
import { tasksReducer } from "./reducer";
import { INBOX_ID, type TasksState } from "../types";

const base: TasksState = {
  projects: [{ id: INBOX_ID, name: "Inbox" }, { id: "p1", name: "Work" }],
  tasks: [
    { id: "a", title: "A", done: false, priority: "normal", projectId: "p1", createdAt: 1 },
    { id: "b", title: "B", done: true, priority: "low", projectId: "p1", createdAt: 2 },
    { id: "c", title: "C", done: false, priority: "high", projectId: INBOX_ID, createdAt: 3 },
  ],
};

describe("tasksReducer", () => {
  it("toggle preserves identity of untouched tasks", () => {
    const next = tasksReducer(base, { type: "task/toggled", id: "a" });
    expect(next.tasks[0]).not.toBe(base.tasks[0]);
    expect(next.tasks[1]).toBe(base.tasks[1]);
    expect(next.tasks[2]).toBe(base.tasks[2]);
  });

  it("returns the same state object for a no-op", () => {
    expect(tasksReducer(base, { type: "task/toggled", id: "missing" })).toBe(base);
    expect(tasksReducer(base, { type: "task/renamed", id: "a", title: "  " })).toBe(base);
  });

  it("deleting a project re-homes its tasks to Inbox atomically", () => {
    const next = tasksReducer(base, { type: "project/removed", id: "p1" });
    expect(next.projects.map((p) => p.id)).toEqual([INBOX_ID]);
    expect(next.tasks.every((t) => t.projectId === INBOX_ID)).toBe(true);
    expect(next.tasks).toHaveLength(3);
  });

  it("refuses to delete Inbox", () => {
    expect(tasksReducer(base, { type: "project/removed", id: INBOX_ID })).toBe(base);
  });

  it("does not mutate its input", () => {
    const frozen = structuredClone(base);
    Object.freeze(frozen.tasks);
    Object.freeze(frozen.projects);
    expect(() => tasksReducer(frozen, { type: "task/removed", id: "a" })).not.toThrow();
  });

  it("is deterministic (same input, same output)", () => {
    const action = { type: "task/prioritized", id: "a", priority: "high" } as const;
    expect(tasksReducer(base, action)).toEqual(tasksReducer(base, action));
  });
});
