import { useRef } from 'react';
import type { ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType } from 'react';
type AsProp<C extends ElementType> = { as?: C };
type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);
export type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>['ref'];
export type PolymorphicProps<C extends ElementType, Props = object> =
  Props & AsProp<C> & Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>> & { ref?: PolymorphicRef<C> };
type TextOwnProps = { size?: 'sm' | 'md' | 'lg'; tone?: 'default' | 'muted' | 'danger' };
export function Text<C extends ElementType = 'span'>({ as, size = 'md', tone = 'default', className, ...rest }: PolymorphicProps<C, TextOwnProps> & { className?: string }) {
  const Component: ElementType = as ?? 'span';
  return <Component className={['text', `text--${size}`, `text--${tone}`, className].filter(Boolean).join(' ')} {...rest} />;
}
export function U() {
const a = useRef<HTMLAnchorElement>(null);
const d = useRef<HTMLDivElement>(null);
return <>
<Text>plain</Text>
<Text as="a" href="/x" ref={a}>link</Text>
{/* @ts-expect-error ref */}
<Text as="a" href="/x" ref={d}>link</Text>
{/* @ts-expect-error href */}
<Text as="span" href="/x">no</Text>
<Text as="input" size="lg" />
{/* @ts-expect-error size */}
<Text size="xl">no</Text>
<Text as="label" htmlFor="email">Email</Text>
</>;
}
