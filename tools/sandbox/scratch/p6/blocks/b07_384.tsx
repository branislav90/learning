function ProjectEditor({ project, isRefreshing }: { project: Project; isRefreshing: boolean }) {
  const rename = useRenameProject(project.id);
  const [draftName, setDraftName] = useState(project.name);
  const baselineVersion = useRef(project.version);          // version the draft was based on

  const changedUnderMe = project.version !== baselineVersion.current;   // server moved on while editing
  const dirty = draftName !== project.name;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        rename.mutate(
          { name: draftName, version: project.version },   // send the version we *intend* to overwrite
          { onSuccess: () => { baselineVersion.current = project.version; } },   // ⚠ simplified; see note
        );
      }}
    >
      {changedUnderMe && (
        <p role="status">
          This project was updated by someone else.{' '}
          <button type="button" onClick={() => { setDraftName(project.name); baselineVersion.current = project.version; }}>
            Discard my changes and load theirs
          </button>
        </p>
      )}
      <input value={draftName} onChange={(e) => setDraftName(e.target.value)} aria-busy={isRefreshing} />
      <button disabled={!dirty || rename.isPending}>Save</button>
      {rename.isError && <p role="alert">Could not save. Your changes are kept.</p>}
    </form>
  );
}
export {};
