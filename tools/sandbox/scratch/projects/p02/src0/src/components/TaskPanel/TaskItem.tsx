// src/components/TaskPanel/TaskItem.tsx
import { memo, useState, type KeyboardEvent } from "react";
import type { Priority, Project, Task } from "../../types";
import { useTasksDispatch } from "../../state";

interface TaskItemProps {
  task: Task;
  projects: readonly Project[];
  editing: boolean;
  onStartEdit: (id: string) => void;
  onStopEdit: () => void;
}

export const TaskItem = memo(function TaskItem({
  task,
  projects,
  editing,
  onStartEdit,
  onStopEdit,
}: TaskItemProps) {
  const dispatch = useTasksDispatch();

  return (
    <li className={task.done ? "task task--done" : "task"}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => dispatch({ type: "task/toggled", id: task.id })}
        aria-label={`Complete ${task.title}`}
      />

      {editing ? (
        // `key` on the editor is unnecessary here: it unmounts when `editing` flips to false,
        // so its local draft resets naturally.
        <TitleEditor
          initial={task.title}
          onSave={(title) => {
            dispatch({ type: "task/renamed", id: task.id, title });
            onStopEdit();
          }}
          onCancel={onStopEdit}
        />
      ) : (
        <span onDoubleClick={() => onStartEdit(task.id)}>{task.title}</span>
      )}

      <select
        aria-label={`Priority for ${task.title}`}
        value={task.priority}
        onChange={(e) =>
          dispatch({ type: "task/prioritized", id: task.id, priority: e.target.value as Priority })
        }
      >
        <option value="low">Low</option>
        <option value="normal">Normal</option>
        <option value="high">High</option>
      </select>

      <select
        aria-label={`Move ${task.title} to project`}
        value={task.projectId}
        onChange={(e) => dispatch({ type: "task/moved", id: task.id, projectId: e.target.value })}
      >
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <button type="button" onClick={() => onStartEdit(task.id)}>
        Edit
      </button>
      <button type="button" onClick={() => dispatch({ type: "task/removed", id: task.id })}>
        Delete
      </button>
    </li>
  );
});

function TitleEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial: string;
  onSave: (title: string) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(initial);

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") onSave(draft);
    else if (e.key === "Escape") onCancel();
  }

  return (
    <input
      autoFocus
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={() => onSave(draft)}
      aria-label="Task title"
    />
  );
}
