function Editor({ initial }: { initial: Doc }) {
  const [h, dispatch] = useReducer(historyReducer<Doc>, initial, initialHistory<Doc>);
  const doc = h.present;

  useWindowEvent('keydown', (e) => {                  // from Lesson 14 (5.2)
    const mod = e.metaKey || e.ctrlKey;
    if (mod && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      dispatch({ type: e.shiftKey ? 'REDO' : 'UNDO' });
    }
  });

  return (
    <>
      <input
        value={doc.title}
        onChange={(e) => dispatch({ type: 'EXEC', command: setTitle(doc.title, e.target.value) })}
      />
      <button onClick={() => dispatch({ type: 'UNDO' })} disabled={h.past.length === 0}>Undo</button>
      <button onClick={() => dispatch({ type: 'REDO' })} disabled={h.future.length === 0}>Redo</button>
      {/* blocks ... <button onClick={() => dispatch({ type: 'EXEC', command: toggleBold(b.id) })}> */}
    </>
  );
}
export {};
