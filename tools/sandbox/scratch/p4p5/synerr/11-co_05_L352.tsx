function TitleEditor({ title, onSave }: { title: string; onSave: (t: string) => void }) {
  const [draft, setDraft] = useState(title);
  return (/* same body */);
}

// the parent resets the editor when the *record* changes, not on every string change
<TitleEditor key={record.id} title={record.title} onSave={save} />
export {};
