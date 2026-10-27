import type { ComponentPropsWithRef } from 'react';
export type ButtonProps = ComponentPropsWithRef<'button'> & { variant?: 'primary' | 'secondary' | 'danger'; loading?: boolean; };
export function Button({ variant = 'primary', loading = false, disabled, children, className, ...rest }: ButtonProps) {
  return (<button type="button" {...rest} className={['btn', `btn-${variant}`, className].filter(Boolean).join(' ')} disabled={disabled || loading} aria-busy={loading || undefined}>{children}</button>);
}
