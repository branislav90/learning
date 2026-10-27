import { useLayoutEffect, useState, useTransition } from "react";

let renderInvocations = 0;     // module-level counter: acceptable ONLY as a diagnostic probe
let commits = 0;

export default function Probe() {
  const [n, setN] = useState(0);
  const [isPending, startTransition] = useTransition();

  renderInvocations++;                       // (1) runs every time React calls this function
  console.log("render", { n, renderInvocations });

  useLayoutEffect(() => {                    // (2) runs once per commit that includes this component
    commits++;
    console.log("commit", { n, commits });
  });

  return (
    <button
      onClick={() => startTransition(() => setN((c) => c + 1))}
      aria-busy={isPending}
    >
      count {n}
    </button>
  );
}
