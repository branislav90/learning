// src/types.ts
export type Priority = "low" | "normal" | "high";
export type CompletionFilter = "all" | "open" | "done";

export const INBOX_ID = "inbox" as const;

export interface Task {
  readonly id: string;
  readonly title: string;
  readonly done: boolean;
  readonly priority: Priority;
  readonly projectId: string;
  readonly createdAt: number; // epoch ms, supplied by the action creator
}

export interface Project {
  readonly id: string;
  readonly name: string;
}

export interface TasksState {
  readonly tasks: readonly Task[];
  readonly projects: readonly Project[];
}
