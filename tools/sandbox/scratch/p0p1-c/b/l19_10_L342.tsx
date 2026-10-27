export {};
import type { ComponentPropsWithoutRef } from "react";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "secondary" | "danger";
};

export function Button({ variant = "primary", className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={`btn btn-${variant} ${className ?? ""}`} {...rest} />;
}
// <Button onclick={…} />   → error: 'onclick' does not exist (did you mean 'onClick'?)
