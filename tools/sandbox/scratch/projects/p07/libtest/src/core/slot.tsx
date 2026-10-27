// core/slot.tsx
import { Children, cloneElement, isValidElement, type HTMLAttributes, type ReactElement, type Ref } from 'react'
import { composeEventHandlers, composeRefs } from './compose'

interface SlotProps extends HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
  ref?: Ref<HTMLElement>
}

export function Slot({ children, ref, ...slotProps }: SlotProps) {
  const child = Children.only(children)
  if (!isValidElement(child)) return null
  const childProps = child.props as Record<string, unknown> & { ref?: Ref<HTMLElement> }
  return cloneElement(child as ReactElement<Record<string, unknown>>, {
    ...mergeProps(slotProps, childProps),
    ref: composeRefs(ref, childProps.ref), // React 19: element ref lives in props.ref
  })
}

function mergeProps(slot: Record<string, any>, child: Record<string, any>) {
  const merged = { ...slot, ...child }
  for (const key of Object.keys(slot)) {
    if (/^on[A-Z]/.test(key) && typeof slot[key] === 'function' && typeof child[key] === 'function') {
      merged[key] = composeEventHandlers(child[key], slot[key]) // child (consumer) first
    }
  }
  if (slot.className || child.className) merged.className = [slot.className, child.className].filter(Boolean).join(' ')
  if (slot.style || child.style) merged.style = { ...slot.style, ...child.style }
  return merged
}
