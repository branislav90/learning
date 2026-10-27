class Basket { items: string[] = []; add(i: string) { this.items.push(i); } }
function Cart() {
  const [basket] = useState(() => new Basket());
  return <button onClick={() => basket.add("x")}>{basket.items.length}</button>; // never re-renders
}
export {};
