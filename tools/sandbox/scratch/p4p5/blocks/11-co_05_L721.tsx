function Editor({ doc }: { doc: Doc }) {
  const [text, setText] = useState(doc.text);
  return <textarea value={text} onChange={(e) => setText(e.target.value)} />;
}
// parent switches `doc` when the user clicks a different file in the sidebar
export {};
