function Counter() {
  const [count, setCount] = useState(0);
  useEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") setCount(count + 1);   // closes over `count`
  });
  return <p>{count}</p>;
}
export {};
