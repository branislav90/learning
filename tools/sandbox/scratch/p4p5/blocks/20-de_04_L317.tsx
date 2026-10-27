// packages/design-system/src/primitives/Stack.tsx
import type { ComponentPropsWithRef, ElementType } from "react";

type SpaceToken = 1 | 2 | 3 | 4 | 6 | 8;

type StackProps<T extends ElementType> = {
  as?: T;
  gap?: SpaceToken;
} & Omit<ComponentPropsWithRef<T>, "as" | "style" | "className">;

export function Stack<T extends ElementType = "div">({
  as,
  gap = 4,
  ...rest
}: StackProps<T>) {
  const Component: ElementType = as ?? "div";
  return (
    <Component
      {...rest}
      style={{ display: "flex", flexDirection: "column", gap: `var(--space-${gap})` }}
    />
  );
}
export {};
