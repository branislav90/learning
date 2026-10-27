// Speculative
type ButtonProps<T extends React.ElementType = "button"> = {
  as?: T;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  shadow?: "none" | "sm" | "md" | "lg";
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  loadingText?: string;
  tooltip?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as">;
export {};
