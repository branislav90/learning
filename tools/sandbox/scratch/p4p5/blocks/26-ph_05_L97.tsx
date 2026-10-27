type S = { items: string[] };
function reducer(state: S, action: { type: "add"; item: string }): S {
  state.items.push(action.item);
  return { items: state.items };
}
function List() {
  const [s, dispatch] = useReducer(reducer, { items: [] });
  return (
    <>
      <button onClick={() => dispatch({ type: "add", item: "a" })}>add</button>
      <ul>{s.items.map((x, i) => <li key={i}>{x}</li>)}</ul>
    </>
  );
}
export {};
