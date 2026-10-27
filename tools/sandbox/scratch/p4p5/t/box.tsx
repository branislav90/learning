import type { ElementType, ComponentPropsWithoutRef, ComponentPropsWithRef } from 'react';
type AsProp<C extends ElementType> = { as?: C };
type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);
export type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>['ref'];
export type PolymorphicProps<C extends ElementType, Props = object> = Props & AsProp<C> & Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>> & { ref?: PolymorphicRef<C> };
type BoxOwn = { p?: 0 | 1 | 2 | 3 | 4; gap?: 0 | 1 | 2 | 3 | 4 };
export function Box<C extends ElementType = 'div'>({ as, p = 0, gap = 0, className, ...rest }: PolymorphicProps<C, BoxOwn> & { className?: string }) {
  const Component: ElementType = as ?? 'div';
  return <Component className={`box p-${p} gap-${gap} ${className ?? ''}`} {...rest} />;
}
export const a = <Box as="a" href="/x" />;
// @ts-expect-error href is not valid on div
export const b = <Box href="/x" />;
// @ts-expect-error gap must be 0..4
export const c = <Box gap={7} />;
