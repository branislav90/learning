function ProductSearch() {
  const [text, setText] = useState("");
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setDebounced(text), 300);
    return () => clearTimeout(id);
  }, [text]);
  const results = useProductQuery(debounced);
  return <input value={text} onChange={(e) => setText(e.target.value)} />;
}
// UserSearch and OrderSearch repeat the same 7 lines
export {};
