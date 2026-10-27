type ButtonProps = { variant?: "primary" | "danger" | "ghost" } & React.ComponentPropsWithRef<"button">;
export function Button({ variant = "primary", ...rest }: ButtonProps) {
  return <button data-variant={variant} {...rest} />;
}
// <Button variant="danger" variant="ghost" /> is not expressible (and duplicate JSX attributes error).
export {};
