import { useState } from "react";
import { useTasks } from "../../state";
import { TaskComposer } from "./TaskComposer";
import { TaskList } from "./TaskList";
export function TaskPanel({ projectId }: { projectId: string }) {
  const s = useTasks(); const [q] = useState("");
  return <section><h2>{s.projects.find(p => p.id === projectId)?.name}</h2><TaskComposer projectId={projectId} /><TaskList projectId={projectId} filter="all" query={q} /></section>;
}
