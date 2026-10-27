// Text.tsx
import type { ElementType } from 'react';
import type { PolymorphicProps } from './polymorphic';

type TextOwnProps = {
  size?: 'sm' | 'md' | 'lg';
  tone?: 'default' | 'muted' | 'danger';
};

export function Text<C extends ElementType = 'span'>({
  as,
  size = 'md',
  tone = 'default',
  className,
  ...rest
}: PolymorphicProps<C, TextOwnProps> & { className?: string }) {
  const Component: ElementType = as ?? 'span';
  return <Component className={['text', `text--${size}`, `text--${tone}`, className].filter(Boolean).join(' ')} {...rest} />;
}
export {};
