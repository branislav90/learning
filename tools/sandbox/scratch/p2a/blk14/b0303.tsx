import { useState, useTransition } from "react";

export function RebaseDemo() {
  const [n, setN] = useState(1);
  const [isPending, startTransition] = useTransition();

  console.log("render n =", n, "isPending =", isPending);

  return (
    <button
      onClick={() => {
        startTransition(() => setN((x) => x + 1)); // T: +1, transition lane
        setN((x) => x * 2);                         // U: ×2, urgent lane
      }}
    >
      n = {n} {isPending ? "(pending)" : ""}
    </button>
  );
}
