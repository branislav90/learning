// core/dev.ts
export function warn(condition: unknown, message: string) {
  if (process.env.NODE_ENV !== 'production' && !condition) console.warn(`[acme-ui] ${message}`)
}
