const MemoList = memo(List) as typeof List;
function Parent() {
  const [n, setN] = useState(0);
  return <><button onClick={() => setN(n + 1)}>{n}</button>
    <MemoList items={ITEMS} getKey={(i) => i.id} renderItem={(i) => <Row item={i} />} /></>;
}
export {};
