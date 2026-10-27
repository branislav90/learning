// ⚠ Legacy path: only if you support React 18 as a peer.
import { forwardRef, type ComponentPropsWithoutRef } from "react";

export const Input = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<"input">>(
  function Input(props, ref) {
    return <input ref={ref} {...props} />;
  }
);
export {};
