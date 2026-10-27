import {
  Children, cloneElement, isValidElement,
  type CSSProperties, type HTMLAttributes, type ReactElement, type Ref,
} from "react";

type AnyProps = Record<string, unknown>;

function setRef<T>(ref: Ref<T> | undefined, value: T | null): void | (() => void) {
  if (typeof ref === "function") return ref(value) as void | (() => void);
  if (ref) (ref as { current: T | null }).current = value;
}

// ⚠ React 19: callback refs may return a cleanup function.
export function composeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    const cleanups = refs.map((r) => setRef(r, node));
    return () => {
      refs.forEach((r, i) => {
        const cleanup = cleanups[i];
        if (typeof cleanup === "function") cleanup();
        else setRef(r, null);
      });
    };
  };
}

function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...slotProps, ...childProps }; // child wins by default

  for (const key of Object.keys(slotProps)) {
    const s = slotProps[key];
    const c = childProps[key];
    if (/^on[A-Z]/.test(key) && typeof s === "function" && typeof c === "function") {
      merged[key] = (...args: unknown[]) => {
        c(...args);   // child first
        s(...args);   // then the component's handler
      };
    } else if (key === "style") {
      merged.style = { ...(s as CSSProperties), ...(c as CSSProperties) };
    } else if (key === "className") {
      merged.className = [s, c].filter(Boolean).join(" ");
    }
  }
  return merged;
}

type SlotProps = HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> };

export function Slot({ children, ...slotProps }: SlotProps) {
  if (!isValidElement(children)) {
    // Children.only throws a descriptive error for non-single-element children.
    Children.only(children);
    return null;
  }
  const child = children as ReactElement<AnyProps & { ref?: Ref<HTMLElement> }>;
  const childRef = child.props.ref; // ⚠ React 19: ref is a prop. In React 18 use (child as any).ref.
  const merged = mergeProps(slotProps as AnyProps, child.props);
  return cloneElement(child, {
    ...merged,
    ref: composeRefs(slotProps.ref, childRef),
  });
}
export {};
