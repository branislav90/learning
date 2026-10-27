// core/types.ts
import type { ComponentPropsWithRef, ElementType } from 'react'

export type PolymorphicProps<E extends ElementType, Own = {}> =
  Own & { as?: E } & Omit<ComponentPropsWithRef<E>, keyof Own | 'as'>
