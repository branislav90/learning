function Parent() {
  const [n, setN] = useState(0);
  function Child() { // new function identity each render of Parent
    const [text, setText] = useState("");
    return <input value={text} onChange={(e) => setText(e.target.value)} />;
  }
  return <><button onClick={() => setN(n + 1)}>{n}</button><Child /></>;
}
export {};
