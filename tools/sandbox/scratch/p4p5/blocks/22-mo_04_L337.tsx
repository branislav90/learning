import type { ComponentPropsWithRef } from "react";

export interface ButtonProps extends ComponentPropsWithRef<"button"> {
  variant?: "primary" | "secondary";
  loading?: boolean;
}

export function Button({ variant = "primary", loading = false, children, disabled, ...rest }: ButtonProps) {
  return (
    <button data-variant={variant} aria-busy={loading || undefined} disabled={disabled || loading} {...rest}>
      {children}
    </button>
  );
}
export {};
