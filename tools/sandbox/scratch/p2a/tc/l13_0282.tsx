import { useState, useTransition } from "react";

export function Demo() {
  const [urgent, setUrgent] = useState(0);
  const [slow, setSlow] = useState(0);
  const [isPending, startTransition] = useTransition();

  console.log("render", { urgent, slow, isPending });

  return (
    <button
      onClick={() => {
        startTransition(() => setSlow((s) => s + 1)); // statement 1
        setUrgent((u) => u + 1);                      // statement 2
      }}
    >
      urgent={urgent} slow={slow}
    </button>
  );
}
