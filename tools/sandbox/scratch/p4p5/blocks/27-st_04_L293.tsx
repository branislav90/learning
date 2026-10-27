import { clsx } from "clsx";   // small class-name joiner: verify package/version

type Variant = "primary" | "ghost";
const variants: Record<Variant, string> = {
  primary: "bg-[--color-action-primary] text-[--color-on-action]",  // ⚠ arbitrary-value/variable syntax differs by version; verify
  ghost: "bg-transparent text-[--color-text-default]",
};

export function Button({ variant = "primary", className, ...rest }: React.ComponentProps<"button"> & { variant?: Variant }) {
  return <button {...rest} className={clsx("rounded-md px-4 py-2 focus-visible:outline-2", variants[variant], className)} />;
}
export {};
