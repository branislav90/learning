function whichPropsChanged(prev: Record<string, unknown>, next: Record<string, unknown>) {
  return Object.keys({ ...prev, ...next }).filter((k) => !Object.is(prev[k], next[k]));
}
