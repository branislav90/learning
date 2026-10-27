import { isValidElement, type ComponentType, type ReactElement, type ReactNode } from "react";
export function isElementOfType<P>(node: ReactNode, type: ComponentType<P>): node is ReactElement<P> {
  return isValidElement(node) && node.type === type;
}
