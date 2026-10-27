export function Item({ id }: { id: string }) {
  const [selected, setSelected] = useState(false);
  return (
    <button
      aria-pressed={selected}
      onClick={() => {
        setSelected((s) => !s);
        track("item_toggled", { id });      // once per user action
      }}
    >
      {id}
    </button>
  );
}
