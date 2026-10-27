// packages/ds/src/Button.tsx
import type { ComponentPropsWithRef } from 'react';
import { deprecated } from './internal/deprecate';

type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  /** @deprecated Use `variant="ghost"`. Removed in v5. */
  link?: boolean;
};

export function Button({ variant = 'primary', link, ref, className, ...rest }: ButtonProps) {
  if (link) {
    deprecated('Button.link', 'Use variant="ghost" instead.', { removeIn: 'v5' });
  }
  const resolved = link ? 'ghost' : variant;
  return <button ref={ref} className={`ds-btn ds-btn--${resolved} ${className ?? ''}`} {...rest} />;
}
