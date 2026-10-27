import type { ElementType } from 'react'
import type { PolymorphicProps } from './types'
export function Box<E extends ElementType = 'div'>({ as, ...rest }: PolymorphicProps<E, { tone?: 'neutral' | 'danger' }>) {
  const Comp: ElementType = as ?? 'div'
  return <Comp {...rest} />
}
export const ok = <Box as="a" href="/x" tone="danger" />
// @ts-expect-error href not valid on div
export const bad = <Box as="div" href="/x" />
export const ok2 = <Box tone="neutral" id="x" />
