function EditableTitle({ title, onSave }: { title: string; onSave: (t: string) => void }) {
  const [draft, setDraft] = useState(title);       // initial only
  useEffect(() => { setDraft(title); }, [title]);  // "keep in sync"
  return (
    <>
      <input value={draft} onChange={(e) => setDraft(e.target.value)} />
      <button onClick={() => onSave(draft)}>Save</button>
    </>
  );
}
export {};
