// hooks/useControllableState.ts
import { useCallback, useRef, useState } from 'react'

interface Options<T> {
  value: T | undefined
  defaultValue: T
  onChange?: (next: T) => void
}

export function useControllableState<T>({ value, defaultValue, onChange }: Options<T>) {
  const [internal, setInternal] = useState(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? value : internal

  // Detect controlled/uncontrolled flips in dev (a consumer bug, like React's own inputs).
  const wasControlled = useRef(isControlled)
  if (import.meta.env?.DEV && wasControlled.current !== isControlled) {
    console.warn('A component changed from ' + (wasControlled.current ? 'controlled to uncontrolled' : 'uncontrolled to controlled') + '. Decide on one for its lifetime.')
  }

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange // ⚠ writing a ref during render: see note

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved = typeof next === 'function' ? (next as (p: T) => T)(current) : next
      if (!isControlled) setInternal(resolved)
      if (!Object.is(resolved, current)) onChangeRef.current?.(resolved)
    },
    [isControlled, current],
  )
  return [current, setValue] as const
}
