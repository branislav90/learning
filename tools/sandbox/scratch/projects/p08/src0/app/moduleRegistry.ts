import type { ModuleManifest, PermissionKey } from '@/platform/module-kit'
// app/moduleRegistry.ts
export function buildRegistry(modules: ModuleManifest[], adapters: ReadonlyMap<string, unknown>) {
  const ids = new Set<string>()
  const errors: string[] = []
  for (const m of modules) {
    if (ids.has(m.id)) errors.push(`Duplicate module id "${m.id}"`)
    ids.add(m.id)
    for (const port of m.requires ?? []) {
      if (!adapters.has(port)) errors.push(`Module "${m.id}" requires port "${port}" but no adapter is registered`)
    }
  }
  if (errors.length) throw new Error(`Module registry invalid:\n- ${errors.join('\n- ')}`)

  return {
    modules,
    navFor(can: (p: PermissionKey) => boolean, flag: (f: string) => boolean) {
      return modules
        .filter((m) => !m.killSwitchFlag || flag(m.killSwitchFlag))
        .flatMap((m) => m.nav)
        .filter((n) => (!n.requires || can(n.requires)) && (!n.flag || flag(n.flag)))
        .sort((a, b) => (a.order ?? 100) - (b.order ?? 100))
    },
  }
}
