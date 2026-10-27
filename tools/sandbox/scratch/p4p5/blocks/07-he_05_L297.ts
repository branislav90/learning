// merge-props.ts
type AnyProps = Record<string, unknown>;

export function mergeProps(slot: AnyProps, child: AnyProps): AnyProps {
  const merged: AnyProps = { ...slot, ...child };           // child wins by default
  for (const key of Object.keys(slot)) {
    const s = slot[key];
    const c = child[key];
    if (/^on[A-Z]/.test(key) && typeof s === "function" && typeof c === "function") {
      merged[key] = (...args: unknown[]) => { c(...args); s(...args); };  // child first, then slot
    } else if (key === "className") {
      merged[key] = [s, c].filter(Boolean).join(" ");
    } else if (key === "style") {
      merged[key] = { ...(s as object), ...(c as object) };
    }
  }
  return merged;
}
export {};
