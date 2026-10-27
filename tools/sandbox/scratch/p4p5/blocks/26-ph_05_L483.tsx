import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";

type TextOwnProps<E extends ElementType> = { as?: E; children?: ReactNode };
type TextProps<E extends ElementType> = TextOwnProps<E> &
  Omit<ComponentPropsWithRef<E>, keyof TextOwnProps<E>>;

export function Text<E extends ElementType = "span">({ as, ...props }: TextProps<E>) {
  const Comp: ElementType = as ?? "span";
  return <Comp {...props} />;
}

// <Text as="a" href="/x" ref={anchorRef}>ok</Text>      compiles
// <Text as="span" href="/x">no</Text>                    error: 'href' not in span props
// <Text>default span</Text>
export {};
