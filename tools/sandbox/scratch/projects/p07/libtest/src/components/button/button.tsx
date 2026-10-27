// components/button/button.tsx
import type { ComponentPropsWithRef } from 'react'
import { Slot } from '../../core/slot'

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: 'solid' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  asChild?: boolean
}

export function Button({ variant = 'solid', size = 'md', loading, asChild, disabled, className, children, onClick, ...rest }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  const inert = disabled || loading
  return (
    <Comp
      {...rest}
      className={['acme-button', className].filter(Boolean).join(' ')}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      // `disabled` removes the button from the tab order. While loading we keep focus and
      // announce state via aria-disabled so keyboard users do not lose their place.
      disabled={asChild ? undefined : disabled}
      aria-disabled={inert || undefined}
      aria-busy={loading || undefined}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => (inert ? e.preventDefault() : onClick?.(e))}
    >
      {children}
    </Comp>
  )
}
