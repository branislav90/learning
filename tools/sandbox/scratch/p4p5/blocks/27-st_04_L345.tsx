// Button.tsx
import { base, variant } from "./button.css";
export function Button({ v = "primary", ...rest }: React.ComponentProps<"button"> & { v?: keyof typeof variant }) {
  return <button {...rest} className={`${base} ${variant[v]}`} />;
}
export {};
