// button.css.ts (vanilla-extract-style API; ⚠ verify names/signatures in current docs)
import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "./theme.css";

export const base = style({
  padding: `${vars.space[2]} ${vars.space[4]}`,
  borderRadius: vars.radius.md,
});
export const variant = styleVariants({
  primary: { background: vars.color.action.primary, color: vars.color.onAction },
  danger:  { background: vars.color.feedback.danger, color: vars.color.onAction },
});
export {};
