import { cloneElement, isValidElement, type ReactElement, type HTMLAttributes } from "react";

export function Slot({ children, ...slotProps }: HTMLAttributes<HTMLElement> & { children: ReactElement<HTMLAttributes<HTMLElement>> }) {
  if (!isValidElement(children)) return null;
  const childProps = children.props;
  return cloneElement(children, {
    ...slotProps,
    ...childProps,
    className: [slotProps.className, childProps.className].filter(Boolean).join(" ") || undefined,
    style: { ...slotProps.style, ...childProps.style },
    // Note: spreading childProps after slotProps means the child's handlers REPLACE the slot's.
  });
}
export {};
