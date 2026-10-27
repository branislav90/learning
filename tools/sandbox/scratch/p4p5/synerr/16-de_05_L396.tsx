// ANTI-PATTERN: untyped, ambient, global
const registry = new Map<string, unknown>();
export const register = (name: string, impl: unknown) => registry.set(name, impl);
export const locate = <T,>(name: string) => registry.get(name) as T;   // cast: types are a lie

function Widget() {
  const http = locate<Http>('http');         // dependency invisible in signature, typo-prone, global
  ...
}
export {};
