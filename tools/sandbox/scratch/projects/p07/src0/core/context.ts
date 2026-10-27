// core/context.ts
import { createContext, use } from 'react'

export function createStrictContext<T>(name: string, parentName: string) {
  const Ctx = createContext<T | null>(null)
  Ctx.displayName = name
  function useStrict(): T {
    const value = use(Ctx) // `use` can read context conditionally in React 19; useContext is equivalent here
    if (value === null) throw new Error(`<${name}> must be used within <${parentName}>`)
    return value
  }
  return [Ctx, useStrict] as const
}
