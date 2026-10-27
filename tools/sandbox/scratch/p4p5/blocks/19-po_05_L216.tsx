// polymorphic.ts
import type { ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType } from 'react';

type AsProp<C extends ElementType> = { as?: C };

/** Keys that the component's own props (and `as`) own: removed from the element's props. */
type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

export type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>['ref'];

export type PolymorphicProps<C extends ElementType, Props = object> =
  Props & AsProp<C> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>> &
  { ref?: PolymorphicRef<C> };
export {};
