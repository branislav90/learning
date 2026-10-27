import { useEffect, useRef } from "react";
export function useCommitCount(): number {
  const count = useRef(0);
  useEffect(() => { count.current += 1; });   // runs after every commit
  return count.current;                        // value as of the *previous* commit
}
