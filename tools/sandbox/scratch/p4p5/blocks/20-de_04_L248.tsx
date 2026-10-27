// packages/design-system/src/components/Button/Button.tsx
import type { ComponentPropsWithRef, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "danger";
type Size = "sm" | "md";

export type ButtonProps = Omit<ComponentPropsWithRef<"button">, "className" | "style"> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-variant={variant}
      data-size={size}
      className={styles.root}
    >
      {children}
    </button>
  );
}
export {};
