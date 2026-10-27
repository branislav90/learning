import { useLayoutEffect, type RefObject } from "react";
export function useImperativeText(ref: RefObject<HTMLElement | null>, text: string): void {
  useLayoutEffect(() => { if (ref.current) ref.current.textContent = text; }, [ref, text]);
}
// <td ref={cellRef} />  — React renders NO children into this node.
