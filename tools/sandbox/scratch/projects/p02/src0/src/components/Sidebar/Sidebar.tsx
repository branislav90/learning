import { useTasks, useTasksDispatch } from "../../state";
export function Sidebar({ selectedProjectId, onSelect }: { selectedProjectId: string; onSelect: (id: string) => void }) {
  const s = useTasks(); const d = useTasksDispatch();
  return <nav>{s.projects.map(p => <div key={p.id}><button aria-pressed={p.id === selectedProjectId} onClick={() => onSelect(p.id)}>{p.name}</button>
    {p.id !== "inbox" && <button aria-label={`Delete project ${p.name}`} onClick={() => d({ type: "project/removed", id: p.id })}>x</button>}</div>)}</nav>;
}
