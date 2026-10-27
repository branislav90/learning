function C() {
  const [s, dispatch] = useReducer((s: { n: number }, a: "inc") => ({ n: s.n + 1 }), { n: 0 });
  return <button onClick={() => { dispatch("inc"); dispatch("inc"); dispatch("inc"); }}>{s.n}</button>;
}
export {};
