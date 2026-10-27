function mergeProps(slot: Record<string, any>, child: Record<string, any>) {
  const merged = { ...slot, ...child };
  for (const k of Object.keys(slot)) {
    if (/^on[A-Z]/.test(k) && typeof slot[k] === "function" && typeof child[k] === "function") {
      merged[k] = (...a: unknown[]) => { child[k](...a); slot[k](...a); };
    } else if (k === "className") merged.className = [slot.className, child.className].filter(Boolean).join(" ");
  }
  return merged;
}
function Slot({ children, ...slotProps }: any) {
  const child = React.Children.only(children) as React.ReactElement<any>;
  return React.cloneElement(child, { ...mergeProps(slotProps, child.props), ref: composeRefs(slotProps.ref, child.props.ref) });
}
export {};
