import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type PolymorphicProps<T extends ElementType, Extra = object> = Extra &
  Omit<ComponentPropsWithoutRef<T>, keyof Extra | "as"> & { as?: T };

type TextOwnProps = { tone?: "default" | "muted" | "danger"; children?: ReactNode };

export function Text<T extends ElementType = "span">({
  as,
  tone = "default",
  ...rest
}: PolymorphicProps<T, TextOwnProps>) {
  const Component: ElementType = as ?? "span";
  return <Component data-tone={tone} {...rest} />;
}

// <Text as="a" href="/x">link</Text>   ✔ href accepted
// <Text as="span" href="/x">           ✘ compile error: span has no href
export {};
