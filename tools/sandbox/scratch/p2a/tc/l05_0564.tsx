import { isValidElement, type ComponentType, type ReactNode } from "react";

export function renderSlot<P extends object>(slot: ReactNode | ComponentType<P>, props: P): ReactNode {
  if (typeof slot === "function") {
    const Slot = slot as ComponentType<P>;
    return <Slot {...props} />;
  }
  return slot;               // already a renderable node (element, string, array, null...)
}
