// src/platform/module-system/registry.ts
import type { AppModule, ExtensionPoint, ExtensionRegistry } from "./types";

export function createExtensionRegistry(): ExtensionRegistry {
  const store = new Map<string, unknown[]>();
  return {
    contribute(point, value) {
      const list = store.get(point.id) ?? [];
      list.push(value);
      store.set(point.id, list);
    },
    get<T>(point: ExtensionPoint<T>): readonly T[] {
      return (store.get(point.id) ?? []) as readonly T[];
    },
  };
}

export function composeModules(modules: readonly AppModule[]) {
  const ids = new Set<string>();
  for (const m of modules) {
    if (ids.has(m.id)) throw new Error(`Duplicate module id: ${m.id}`);
    ids.add(m.id);
  }
  const extensions = createExtensionRegistry();
  for (const m of modules) m.register?.({ extensions });
  return {
    extensions,
    routes: modules.flatMap((m) => m.routes),
    nav: modules.flatMap((m) => m.nav ?? []).sort((a, b) => a.order - b.order),
  };
}
export {};
