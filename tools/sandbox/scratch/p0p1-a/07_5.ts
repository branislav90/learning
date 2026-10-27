// conceptual per-hook state: { value, deps }
function useMemoConceptual<T>(compute: () => T, deps: readonly unknown[]): T {
  const slot = currentHookSlot();                  // identified by call order
  if (slot.deps && depsEqual(slot.deps, deps)) return slot.value as T;
  const value = compute();
  slot.value = value; slot.deps = deps;
  return value;
}
const depsEqual = (a: readonly unknown[], b: readonly unknown[]) =>
  a.length === b.length && a.every((x, i) => Object.is(x, b[i]));
