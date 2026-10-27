// src/components/TaskPanel/TaskComposer.tsx
import { useState, type FormEvent } from "react";
import { newTask, useTasksDispatch } from "../../state";

export function TaskComposer({ projectId }: { projectId: string }) {
  const dispatch = useTasksDispatch();
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (title.trim() === "") {
      setError("Enter a task title.");
      return;
    }
    dispatch(newTask(projectId, title));
    setTitle("");
    setError(null);
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Add task">
      <label>
        New task
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <button type="submit">Add</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
