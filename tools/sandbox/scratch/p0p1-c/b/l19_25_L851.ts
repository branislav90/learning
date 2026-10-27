export {};
import { useCallback, useState } from "react";
export function useToggle(initial = false): readonly [boolean, () => void] {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn((v) => !v), []);
  return [on, toggle] as const;
}
