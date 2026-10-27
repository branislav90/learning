import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  console.log("Counter render, count =", count);
  return <button onClick={() => setCount(count + 1)}>Clicked {count}</button>;
}
export {};
