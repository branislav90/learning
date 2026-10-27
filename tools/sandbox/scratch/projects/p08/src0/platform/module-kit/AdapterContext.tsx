// platform/module-kit/AdapterContext.tsx
import { createContext, use, type ReactNode } from 'react'
import type { PortKey } from './types'

type Registry = ReadonlyMap<string, unknown>
const AdapterContext = createContext<Registry | null>(null)

export function AdapterProvider({ adapters, children }: { adapters: Registry; children: ReactNode }) {
  return <AdapterContext value={adapters}>{children}</AdapterContext>
}

export function usePort<T>(key: PortKey<T>): T {
  const reg = use(AdapterContext)
  if (!reg) throw new Error('usePort must be used inside <AdapterProvider>')
  const impl = reg.get(key)
  if (!impl) throw new Error(`No adapter registered for port "${key}"`)
  return impl as T
}
