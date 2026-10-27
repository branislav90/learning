function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function SettingsPanel() {
  return (
    <Panel title="Settings">
      <label>Theme <select><option>Light</option><option>Dark</option></select></label>
    </Panel>
  );
}
export {};
