// Button.tsx
import type { ComponentPropsWithRef } from "react";
import styles from "./Button.module.css";
type Variant = "primary" | "secondary";
export function Button({ variant = "primary", type = "button", ...rest }:
  Omit<ComponentPropsWithRef<"button">, "className" | "style"> & { variant?: Variant }) {
  return <button {...rest} type={type} data-variant={variant} className={styles.root} />;
}
export {};
