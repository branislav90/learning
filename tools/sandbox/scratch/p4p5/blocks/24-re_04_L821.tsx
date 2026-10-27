import type { ComponentPropsWithRef } from "react";

type Base = ComponentPropsWithRef<"button">;
type NewLoading = { loading?: boolean; isLoading?: never };
type LegacyLoading = { isLoading?: boolean; loading?: never };
export type ButtonProps = Base & (NewLoading | LegacyLoading);

export function Button({ loading, isLoading, children, disabled, ...rest }: ButtonProps) {
  if (isLoading !== undefined && import.meta.env.DEV) {
    console.warn("<Button isLoading> is deprecated; use `loading`.");
  }
  const busy = loading ?? isLoading ?? false;
  return (
    <button {...rest} disabled={disabled || busy} aria-busy={busy || undefined}>
      {children}
    </button>
  );
}
export {};
