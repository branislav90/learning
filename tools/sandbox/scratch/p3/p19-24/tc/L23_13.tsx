export {};
// 🔴
useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 1000); // reads `count`
  return () => clearInterval(id);
}, []); // lint: count missing
