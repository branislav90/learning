// slot.tsx
import { Children, cloneElement, isValidElement, type HTMLAttributes, type ReactElement, type ReactNode } from "react";
import { mergeProps } from "./merge-props";

export function Slot({ children, ...slotProps }: HTMLAttributes<HTMLElement> & { children?: ReactNode }) {
  const child = Children.only(children);                   // exactly one element, or throws
  if (!isValidElement(child)) return null;
  const element = child as ReactElement<Record<string, unknown>>;
  return cloneElement(element, mergeProps(slotProps as Record<string, unknown>, element.props));
}
export {};
