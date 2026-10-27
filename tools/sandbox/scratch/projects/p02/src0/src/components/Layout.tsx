// src/components/Layout.tsx
import { useState } from "react";
import { INBOX_ID } from "../types";
import { resolveSelectedProjectId, useTasks } from "../state";
import { Sidebar } from "./Sidebar/Sidebar";
import { TaskPanel } from "./TaskPanel/TaskPanel";

export function Layout() {
  const state = useTasks();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(INBOX_ID);

  // DERIVED: if the stored selection no longer exists, fall back. No effect.
  const projectId = resolveSelectedProjectId(state, selectedProjectId);

  return (
    <div className="layout">
      <Sidebar selectedProjectId={projectId} onSelect={setSelectedProjectId} />
      <TaskPanel projectId={projectId} />
    </div>
  );
}
