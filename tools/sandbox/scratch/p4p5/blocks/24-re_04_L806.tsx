import { useEffect, useState } from "react";

export function Ticker() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((c) => c + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{n}</span>;
}
export {};
