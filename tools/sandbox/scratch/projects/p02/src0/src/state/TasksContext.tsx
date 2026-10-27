// src/state/TasksContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type { TasksState } from "../types";
import type { TasksAction } from "./actions";
import { tasksReducer } from "./reducer";
import { loadState, saveState } from "./storage";

const TasksStateContext = createContext<TasksState | null>(null);
const TasksDispatchContext = createContext<Dispatch<TasksAction> | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  // Lazy initializer: `loadState` is passed as a function and runs on mount
  // (twice in StrictMode dev, which is harmless because it is a pure read).
  const [state, dispatch] = useReducer(tasksReducer, undefined, loadState);

  // Synchronization with an EXTERNAL system. Not derived state.
  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <TasksStateContext value={state}>
      <TasksDispatchContext value={dispatch}>{children}</TasksDispatchContext>
    </TasksStateContext>
  );
}

export function useTasks(): TasksState {
  const value = useContext(TasksStateContext);
  if (value === null) throw new Error("useTasks must be used inside <TasksProvider>");
  return value;
}

export function useTasksDispatch(): Dispatch<TasksAction> {
  const value = useContext(TasksDispatchContext);
  if (value === null) throw new Error("useTasksDispatch must be used inside <TasksProvider>");
  return value;
}
