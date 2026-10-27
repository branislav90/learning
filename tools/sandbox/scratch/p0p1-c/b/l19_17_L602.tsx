export {};
import type { ComponentProps } from "react";
type ButtonProps = ComponentProps<typeof Button>;   // props of your own Button, including variant
type NativeInput = ComponentProps<"input">;          // includes `ref` in React 19 typings
