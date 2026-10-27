function Dashboard({ widgets }: { widgets: Widget[] }) {
  return (
    <Grid
      items={widgets}
      renderItem={(w) => {
        const [expanded, setExpanded] = useState(false);       // ❌ hook inside render prop
        return <WidgetCard widget={w} expanded={expanded} onToggle={() => setExpanded((e) => !e)} />;
      }}
    />
  );
}
export {};
