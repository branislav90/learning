function WidgetCardWithState({ widget }: { widget: Widget }) {
  const [expanded, setExpanded] = useState(false);              // belongs to a real component instance
  return <WidgetCard widget={widget} expanded={expanded} onToggle={() => setExpanded((e) => !e)} />;
}

<Grid items={widgets} getKey={(w) => w.id} renderItem={(w) => <WidgetCardWithState widget={w} />} />
export {};
