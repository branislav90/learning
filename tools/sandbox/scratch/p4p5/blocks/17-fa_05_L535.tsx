function useSnapshotHistory<S>(initial: S) {
  const [past, setPast] = useState<S[]>([]);
  const [present, setPresent] = useState(initial);
  const [future, setFuture] = useState<S[]>([]);
  const set = (next: S) => { setPast((p) => [...p, present]); setPresent(next); setFuture([]); };
  const undo = () => { if (!past.length) return; setFuture((f) => [present, ...f]); setPresent(past.at(-1)!); setPast((p) => p.slice(0, -1)); };
  const redo = () => { if (!future.length) return; setPast((p) => [...p, present]); setPresent(future[0]); setFuture((f) => f.slice(1)); };
  return { present, set, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 };
}
export {};
