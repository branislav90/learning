import { useEffect, useId, useRef } from "react";

export function Row({ label }: { label: string }) {
  const id = useId();                              // deterministic per position in the tree, safe to re-invoke
  return <li id={id}>{label}</li>;
}

export function Registry() {
  const commits = useRef(0);
  useEffect(() => {
    commits.current += 1;                          // runs only for committed renders; no state, so no re-render loop
  });
  return <button onClick={() => alert(commits.current)}>Show commit count</button>;
}
