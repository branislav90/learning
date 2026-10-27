// shared/ui/Button.tsx  (adapter: your API, their implementation)
import MuiButton from "@mui/material/Button";   // ⚠ verify current import path conventions
export type ButtonProps = { variant?: "primary" | "secondary"; children: React.ReactNode; onClick?: () => void };
export function Button({ variant = "primary", ...rest }: ButtonProps) {
  return <MuiButton variant={variant === "primary" ? "contained" : "outlined"} {...rest} />;
}
export {};
