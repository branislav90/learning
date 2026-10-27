// slot.tsx  (React 19)
import { Children, cloneElement, isValidElement, type HTMLAttributes, type ReactElement, type Ref } from 'react';
import { mergeRefs } from './compose';          // Lesson 18, 5.3

type AnyProps = Record<string, unknown> & { ref?: Ref<unknown>; className?: string; style?: React.CSSProperties };

function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...slotProps, ...childProps };       // child wins by default
  for (const key of Object.keys(childProps)) {
    const s = slotProps[key], c = childProps[key];
    if (/^on[A-Z]/.test(key) && typeof s === 'function' && typeof c === 'function') {
      merged[key] = (...args: unknown[]) => { c(...args); s(...args); };   // both handlers run; child first
    }
  }
  merged.className = [slotProps.className, childProps.className].filter(Boolean).join(' ') || undefined;
  merged.style = { ...slotProps.style, ...childProps.style };
  return merged;
}

export function Slot({ children, ...slotProps }: HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement>; children?: React.ReactNode }) {
  const child = Children.only(children);                          // throws if not exactly one child
  if (!isValidElement<AnyProps>(child)) return null;
  // React 19: the child's ref is `child.props.ref`; reading `child.ref` is deprecated and warns.
  const childRef = child.props.ref as Ref<unknown> | undefined;
  return cloneElement(child, {
    ...mergeProps(slotProps as AnyProps, child.props),
    ref: mergeRefs(slotProps.ref as Ref<unknown> | undefined, childRef),
  } as AnyProps);
}
export {};
