import { INBOX_ID, type TasksState } from "../types";
export const seedState: TasksState = {
  projects: [{ id: INBOX_ID, name: "Inbox" }, { id: "p1", name: "Work" }],
  tasks: [
    { id: "a", title: "Alpha", done: false, priority: "normal", projectId: INBOX_ID, createdAt: 1 },
    { id: "b", title: "Beta", done: false, priority: "high", projectId: INBOX_ID, createdAt: 2 },
    { id: "c", title: "Gamma", done: false, priority: "low", projectId: "p1", createdAt: 3 },
  ],
};
