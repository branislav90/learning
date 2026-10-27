type PossibleRef<T> = React.Ref<T> | undefined;

export function composeRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  return (node) => {
    const cleanups: Array<() => void> = [];
    for (const ref of refs) {
      if (typeof ref === "function") {
        const result = ref(node);
        if (typeof result === "function") cleanups.push(result);       // React 19 cleanup form
        else cleanups.push(() => ref(null));                           // pre-19 convention: call with null on detach
      } else if (ref) {
        (ref as React.MutableRefObject<T | null>).current = node;
        cleanups.push(() => { (ref as React.MutableRefObject<T | null>).current = null; });
      }
    }
    return () => cleanups.forEach((c) => c());
  };
}
export {};
