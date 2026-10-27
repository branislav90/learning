type Variant = "solid" | "outline" | "ghost";
type Tone = "neutral" | "primary" | "danger";
type Size = "sm" | "md" | "lg";

type ButtonProps = Omit<React.ComponentPropsWithoutRef<"button">, "children"> & {
  ref?: React.Ref<HTMLButtonElement>;
  variant?: Variant;
  tone?: Tone;
  size?: Size;
  loading?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  asChild?: boolean;
  children: React.ReactNode;
};
export {};
