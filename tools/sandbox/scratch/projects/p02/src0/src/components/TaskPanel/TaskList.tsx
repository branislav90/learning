// src/components/TaskPanel/TaskList.tsx
import { useState } from "react";
import type { CompletionFilter } from "../../types";
import { selectVisibleTasks, useTasks } from "../../state";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  projectId: string;
  filter: CompletionFilter;
  query: string;
}

export function TaskList({ projectId, filter, query }: TaskListProps) {
  const state = useTasks();
  const [editingId, setEditingId] = useState<string | null>(null);

  const visible = selectVisibleTasks(state, projectId, filter, query);
  const projects = state.projects; // for the "move" select

  if (visible.length === 0) {
    return <p className="empty">No tasks to show.</p>;
  }

  return (
    <ul className="task-list" aria-label="Tasks">
      {visible.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          projects={projects}
          editing={editingId === task.id}
          onStartEdit={setEditingId}
          onStopEdit={() => setEditingId(null)}
        />
      ))}
    </ul>
  );
}
