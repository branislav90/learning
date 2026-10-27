import { useRef } from "react";

export function useStableIds<T extends object>(items: readonly T[], businessKey: (t: T) => string): Array<T & { _id: string }> {
  const idsRef = useRef(new Map<string, string>());
  const next = items.map((item) => {
    const bk = businessKey(item);
    let id = idsRef.current.get(bk);
    if (!id) { id = crypto.randomUUID(); idsRef.current.set(bk, id); }   // ⚠ writes to a ref during render
    return { ...item, _id: id };
  });
  return next;
}
